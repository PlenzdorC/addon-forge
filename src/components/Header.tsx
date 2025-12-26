'use client';

import { Sword, User, LogOut, LogIn, Shield, Globe } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { isUserAdmin } from '@/lib/admin';
import {useTranslations, useLocale} from 'next-intl';
import {Link, usePathname, useRouter} from '@/i18n/routing';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const checkAdminAndGetName = async () => {
      if (user) {
        // Ensure user document exists
        const { ensureUserDocument } = await import('@/lib/admin');
        await ensureUserDocument(user);
        
        const adminStatus = await isUserAdmin(user);
        setIsAdmin(adminStatus);
        
        // Get display name from Firestore
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setDisplayName(userDoc.data()?.displayName || user.displayName || 'User');
        } else {
          setDisplayName(user.displayName || 'User');
        }
      } else {
        setIsAdmin(false);
        setDisplayName('');
      }
    };
    checkAdminAndGetName();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Sword className="h-8 w-8 text-amber-500 group-hover:text-amber-400 transition-colors" />
            <div className="absolute inset-0 blur-lg bg-amber-500/30 group-hover:bg-amber-400/40 transition-all" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              {t('logo')}
            </span>
            <span className="text-xs text-slate-400 -mt-1">
              {t('subtitle')}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-amber-400 ${
              isActive('/') ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            {t('requests')}
          </Link>
          <Link
            href="/create"
            className={`text-sm font-medium transition-colors hover:text-amber-400 ${
              isActive('/create') ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            {t('createRequest')}
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-amber-400 ${
              isActive('/about') ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            {t('about')}
          </Link>
          <Link
            href="/support"
            className={`text-sm font-medium transition-colors hover:text-amber-400 ${
              isActive('/support') ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            ☕ {t('support')}
          </Link>
          {user && (
            <Link
              href="/settings"
              className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                isActive('/settings') ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              {t('settings')}
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-amber-400 flex items-center gap-1 ${
                pathname.startsWith('/admin') ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              <Shield className="h-4 w-4" />
              {t('admin')}
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => switchLanguage('de')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                locale === 'de' 
                  ? 'bg-amber-500 text-slate-900' 
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              aria-label="Deutsch"
            >
              DE
            </button>
            <button
              onClick={() => switchLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                locale === 'en' 
                  ? 'bg-amber-500 text-slate-900' 
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              aria-label="English"
            >
              EN
            </button>
          </div>
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-slate-700 animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/profile"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName || 'User'}
                    className="h-8 w-8 rounded-full border-2 border-amber-500"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-900" />
                  </div>
                )}
                <span className="hidden md:block text-sm text-slate-300">
                  {displayName || 'User'}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title={t('logout')}
              >
                <LogOut className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded-lg transition-all text-slate-900 font-semibold"
            >
              <LogIn className="h-4 w-4" />
              <span>{t('login')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

