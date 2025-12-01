'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { isUserAdmin } from '@/lib/admin';
import { Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading) {
        if (!user) {
          router.push('/login');
          return;
        }

        const adminStatus = await isUserAdmin(user);
        setIsAdmin(adminStatus);
        setChecking(false);

        if (!adminStatus) {
          // Not an admin, redirect after a moment
          setTimeout(() => router.push('/'), 2000);
        }
      }
    };

    checkAdmin();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <div className="wow-card p-12 text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Zugriff verweigert
          </h2>
          <p className="text-slate-400 mb-6">
            Du benötigst Admin-Rechte, um auf diesen Bereich zuzugreifen.
          </p>
          <Link href="/" className="wow-button inline-block">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

