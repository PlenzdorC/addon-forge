'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AddonCategory, Priority } from '@/types';
import { Loader2, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getCategoryLabel } from '@/lib/utils';

export default function CreateRequest() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'UI' as AddonCategory,
    priority: 'medium' as Priority,
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Du musst angemeldet sein, um eine Anfrage zu erstellen.');
      return;
    }

    if (formData.title.trim().length < 5) {
      setError('Der Titel muss mindestens 5 Zeichen lang sein.');
      return;
    }

    if (formData.description.trim().length < 20) {
      setError('Die Beschreibung muss mindestens 20 Zeichen lang sein.');
      return;
    }

    setSubmitting(true);

    try {
      // Get user's display name from Firestore
      const { doc, getDoc } = await import('firebase/firestore');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userName = userDoc.exists() 
        ? userDoc.data()?.displayName || user.displayName || 'Anonymous'
        : user.displayName || 'Anonymous';

      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const requestData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        status: 'requested' as const,
        priority: formData.priority,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
        userName: userName,
        upvotes: 0,
        upvotedBy: [],
        comments: [],
      };

      // Only add optional fields if they have values
      if (user.photoURL) {
        requestData.userAvatar = user.photoURL;
      }
      
      if (tagsArray.length > 0) {
        requestData.tags = tagsArray;
      }

      const docRef = await addDoc(collection(db, 'requests'), requestData);
      router.push(`/request/${docRef.id}`);
    } catch (err) {
      console.error('Error creating request:', err);
      setError('Fehler beim Erstellen der Anfrage. Bitte versuche es erneut.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="wow-card p-12 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Anmeldung erforderlich</h2>
          <p className="text-slate-400 mb-6">
            Du musst angemeldet sein, um eine AddOn-Anfrage zu erstellen.
          </p>
          <Link href="/login" className="wow-button inline-block">
            Jetzt anmelden
          </Link>
        </div>
      </div>
    );
  }

  const categories: AddonCategory[] = ['UI', 'Combat', 'Utility', 'Social', 'Profession', 'Other'];
  const priorities: Priority[] = ['low', 'medium', 'high'];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Neue AddOn-Anfrage erstellen</h1>
        <p className="text-slate-400">
          Beschreibe deine Idee für ein World of Warcraft AddOn. Die Community kann für deine Anfrage
          stimmen und Kommentare hinterlassen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="wow-card p-8 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Titel <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="z.B. Verbesserte Questlog-Übersicht"
            className="wow-input w-full"
            required
            maxLength={100}
          />
          <p className="text-xs text-slate-500 mt-1">{formData.title.length}/100 Zeichen</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Beschreibung <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Beschreibe detailliert, welche Funktionen das AddOn haben soll und welches Problem es löst..."
            className="wow-input w-full min-h-[200px] resize-y"
            required
            maxLength={2000}
          />
          <p className="text-xs text-slate-500 mt-1">{formData.description.length}/2000 Zeichen</p>
        </div>

        {/* Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
              Kategorie <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as AddonCategory })}
              className="wow-input w-full"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-2">
              Priorität
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="wow-input w-full"
            >
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-2">
            Tags (optional)
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="z.B. ui, quest, tracking (mit Komma trennen)"
            className="wow-input w-full"
          />
          <p className="text-xs text-slate-500 mt-1">
            Füge Tags hinzu, um deine Anfrage besser auffindbar zu machen
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="wow-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Wird erstellt...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Anfrage erstellen
              </>
            )}
          </button>
          <Link href="/" className="wow-button-secondary">
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}

