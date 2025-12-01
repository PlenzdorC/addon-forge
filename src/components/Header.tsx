'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sword, User, LogOut, LogIn, Shield } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { isUserAdmin } from '@/lib/admin';

export default function Header() {
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await isUserAdmin(user);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
              AddOnForge
            </span>
            <span className="text-xs text-slate-400 -mt-1">
              WoW AddOn Requests
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
            Anfragen
          </Link>
          <Link
            href="/create"
            className={`text-sm font-medium transition-colors hover:text-amber-400 ${
              isActive('/create') ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            Neue Anfrage
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-amber-400 ${
              isActive('/about') ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            Über uns
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-amber-400 flex items-center gap-1 ${
                pathname.startsWith('/admin') ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
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
                    alt={user.displayName || 'User'}
                    className="h-8 w-8 rounded-full border-2 border-amber-500"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-900" />
                  </div>
                )}
                <span className="hidden md:block text-sm text-slate-300">
                  {user.displayName || 'User'}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="Abmelden"
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
              <span>Anmelden</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

