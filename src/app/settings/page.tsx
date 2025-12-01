'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Loader2, Save, User, Mail, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Settings() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [displayName, setDisplayName] = useState('');
  const [originalDisplayName, setOriginalDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const name = userDoc.data()?.displayName || user.displayName || '';
            setDisplayName(name);
            setOriginalDisplayName(name);
          } else {
            setDisplayName(user.displayName || '');
            setOriginalDisplayName(user.displayName || '');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!displayName.trim()) {
      setError('Bitte gib einen Benutzernamen ein.');
      return;
    }

    if (displayName.trim().length < 3) {
      setError('Der Benutzername muss mindestens 3 Zeichen lang sein.');
      return;
    }

    if (displayName.trim().length > 20) {
      setError('Der Benutzername darf maximal 20 Zeichen lang sein.');
      return;
    }

    if (displayName.trim() === originalDisplayName) {
      setError('Du hast keine Änderungen vorgenommen.');
      return;
    }

    setSaving(true);

    try {
      const userRef = doc(db, 'users', user!.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userRef, {
          displayName: displayName.trim(),
        });
      } else {
        // Create new document if it doesn't exist
        const { setDoc, serverTimestamp } = await import('firebase/firestore');
        await setDoc(userRef, {
          uid: user!.uid,
          email: user!.email,
          displayName: displayName.trim(),
          photoURL: user!.photoURL || null,
          isAdmin: false,
          createdAt: serverTimestamp(),
        });
      }

      setOriginalDisplayName(displayName.trim());
      setSuccess('Benutzername erfolgreich geändert!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating display name:', err);
      setError('Fehler beim Speichern. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Einstellungen</h1>
        <p className="text-slate-400">Verwalte dein Profil und deine Einstellungen</p>
      </div>

      {/* Profile Info */}
      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-6">Profil-Informationen</h2>

        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="h-20 w-20 rounded-full border-4 border-amber-500"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <User className="h-10 w-10 text-slate-900" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-slate-100">{displayName}</h3>
            <div className="flex items-center gap-2 text-slate-400 mt-1">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            {user.metadata.creationTime && (
              <div className="flex items-center gap-2 text-slate-400 mt-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Mitglied seit {new Date(user.metadata.creationTime).toLocaleDateString('de-DE')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
              Benutzername
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="wow-input w-full"
              maxLength={20}
              disabled={saving}
            />
            <p className="text-xs text-slate-500 mt-1">
              {displayName.length}/20 Zeichen (min. 3)
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Dieser Name wird öffentlich bei deinen Anfragen und Kommentaren angezeigt.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || displayName.trim() === originalDisplayName}
              className="wow-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Änderungen speichern
                </>
              )}
            </button>

            <Link href="/profile" className="wow-button-secondary">
              Abbrechen
            </Link>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="wow-card p-8">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Account-Informationen</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">E-Mail:</span>
            <span className="text-slate-200">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Anbieter:</span>
            <span className="text-slate-200">Google</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">User-ID:</span>
            <span className="text-slate-200 font-mono text-xs">{user.uid}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

