'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { AddonRequest } from '@/types';
import RequestCard from '@/components/RequestCard';
import { Loader2, User, Mail, Calendar } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [userRequests, setUserRequests] = useState<AddonRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setDisplayName(userDoc.data()?.displayName || user.displayName || 'Anonymous');
          } else {
            setDisplayName(user.displayName || 'Anonymous');
          }
        } catch (error) {
          console.error('Error fetching display name:', error);
          setDisplayName(user.displayName || 'Anonymous');
        }
      }
    };

    fetchDisplayName();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'requests'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AddonRequest[];
      setUserRequests(requests);
      setLoadingRequests(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="wow-card p-8 mb-8">
        <div className="flex items-center gap-6">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName || 'User'}
              className="h-24 w-24 rounded-full border-4 border-amber-500"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <User className="h-12 w-12 text-slate-900" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              {displayName || 'Anonymous'}
            </h1>
            <div className="space-y-1">
              {user.email && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>Mitglied seit {new Date(user.metadata.creationTime!).toLocaleDateString('de-DE')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{userRequests.length}</div>
            <div className="text-sm text-slate-400">Anfragen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">
              {userRequests.reduce((sum, req) => sum + req.upvotes, 0)}
            </div>
            <div className="text-sm text-slate-400">Upvotes erhalten</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">
              {userRequests.filter((req) => req.status === 'completed').length}
            </div>
            <div className="text-sm text-slate-400">Fertiggestellt</div>
          </div>
        </div>
      </div>

      {/* User's Requests */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Deine Anfragen</h2>
        {loadingRequests ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : userRequests.length === 0 ? (
          <div className="wow-card p-12 text-center">
            <p className="text-slate-400 text-lg mb-4">
              Du hast noch keine Anfragen erstellt.
            </p>
            <a href="/create" className="wow-button inline-block">
              Erste Anfrage erstellen
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {userRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

