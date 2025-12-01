'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, LogIn, User, Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [signingIn, setSigningIn] = useState(false);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [tempUser, setTempUser] = useState<any>(null);
  
  // Email/Password state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    if (user && !showUsernamePrompt) {
      router.push('/');
    }
  }, [user, router, showUsernamePrompt]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // New user - show username prompt
        setTempUser(user);
        setUsername(user.displayName || '');
        setShowUsernamePrompt(true);
        setSigningIn(false);
      } else {
        // Existing user - redirect
        // Make sure displayName exists, if not use Google name
        if (!userDoc.data()?.displayName) {
          await setDoc(doc(db, 'users', user.uid), {
            ...userDoc.data(),
            displayName: user.displayName || 'User',
          }, { merge: true });
        }
        router.push('/');
      }
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message || 'Fehler beim Anmelden. Bitte versuche es erneut.');
      setSigningIn(false);
    }
  };

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSigningIn(true);

    // Validation
    if (!email || !password) {
      setError('Bitte fülle alle Felder aus.');
      setSigningIn(false);
      return;
    }

    if (isRegisterMode && password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      setSigningIn(false);
      return;
    }

    if (isRegisterMode && password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      setSigningIn(false);
      return;
    }

    try {
      let result;
      
      if (isRegisterMode) {
        // Register new user
        result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Show username prompt for new users
        setTempUser(user);
        setUsername('');
        setShowUsernamePrompt(true);
        setSigningIn(false);
      } else {
        // Sign in existing user
        result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Check if user document exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          setTempUser(user);
          setUsername('');
          setShowUsernamePrompt(true);
          setSigningIn(false);
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      console.error('Error with email/password auth:', err);
      
      // User-friendly error messages
      let errorMessage = 'Fehler beim Anmelden. Bitte versuche es erneut.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Ungültige E-Mail-Adresse.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Kein Benutzer mit dieser E-Mail gefunden.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Falsches Passwort.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Das Passwort ist zu schwach.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Zu viele Anmeldeversuche. Bitte versuche es später erneut.';
      }
      
      setError(errorMessage);
      setSigningIn(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');

    if (!resetEmail) {
      setError('Bitte gib deine E-Mail-Adresse ein.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess('Passwort-Reset-Link wurde an deine E-Mail gesendet!');
      setTimeout(() => {
        setShowResetPassword(false);
        setResetEmail('');
        setResetSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Error sending password reset:', err);
      
      if (err.code === 'auth/user-not-found') {
        setError('Kein Benutzer mit dieser E-Mail gefunden.');
      } else {
        setError('Fehler beim Senden des Reset-Links. Bitte versuche es erneut.');
      }
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Bitte gib einen Benutzernamen ein.');
      return;
    }

    if (username.trim().length < 3) {
      setError('Der Benutzername muss mindestens 3 Zeichen lang sein.');
      return;
    }

    if (username.trim().length > 20) {
      setError('Der Benutzername darf maximal 20 Zeichen lang sein.');
      return;
    }

    setSigningIn(true);
    setError('');

    try {
      // Create user document with custom username
      await setDoc(doc(db, 'users', tempUser.uid), {
        uid: tempUser.uid,
        email: tempUser.email,
        displayName: username.trim(),
        photoURL: tempUser.photoURL || null,
        isAdmin: false,
        createdAt: serverTimestamp(),
      });

      // Redirect to home
      router.push('/');
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError('Fehler beim Erstellen des Profils. Bitte versuche es erneut.');
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Password Reset Modal
  if (showResetPassword) {
    return (
      <div className="max-w-md mx-auto">
        <div className="wow-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-4">
              <Lock className="h-8 w-8 text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Passwort zurücksetzen</h1>
            <p className="text-slate-400">
              Gib deine E-Mail-Adresse ein und wir senden dir einen Reset-Link
            </p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-slate-300 mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="deine@email.de"
                  className="wow-input w-full pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {resetSuccess && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-400 text-sm">{resetSuccess}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="wow-button flex-1"
              >
                Reset-Link senden
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetEmail('');
                  setError('');
                }}
                className="wow-button-secondary"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Username prompt for new users
  if (showUsernamePrompt) {
    return (
      <div className="max-w-md mx-auto">
        <div className="wow-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-4">
              <User className="h-8 w-8 text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Willkommen!</h1>
            <p className="text-slate-400">
              Wähle einen Benutzernamen für dein Profil
            </p>
          </div>

          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Benutzername
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="z.B. DragonSlayer"
                className="wow-input w-full"
                maxLength={20}
                autoFocus
                disabled={signingIn}
              />
              <p className="text-xs text-slate-500 mt-1">
                {username.length}/20 Zeichen (min. 3)
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={signingIn || !username.trim()}
              className="w-full wow-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  Wird erstellt...
                </>
              ) : (
                'Profil erstellen'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <p>
              Dieser Name wird öffentlich angezeigt und kann später in den Einstellungen geändert werden.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Login screen
  return (
    <div className="max-w-md mx-auto">
      <div className="wow-card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-4">
            <LogIn className="h-8 w-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            {isRegisterMode ? 'Registrieren' : 'Willkommen zurück'}
          </h1>
          <p className="text-slate-400">
            {isRegisterMode 
              ? 'Erstelle einen Account, um AddOn-Anfragen zu erstellen'
              : 'Melde dich an, um AddOn-Anfragen zu erstellen und abzustimmen'
            }
          </p>
        </div>

        <div className="space-y-4">
          {/* Email/Password Form */}
          <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  className="wow-input w-full pl-10"
                  disabled={signingIn}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="wow-input w-full pl-10"
                  disabled={signingIn}
                />
              </div>
            </div>

            {isRegisterMode && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Passwort bestätigen
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="wow-input w-full pl-10"
                    disabled={signingIn}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={signingIn}
              className="w-full wow-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  {isRegisterMode ? 'Wird registriert...' : 'Wird angemeldet...'}
                </>
              ) : (
                <>
                  {isRegisterMode ? 'Registrieren' : 'Anmelden'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">Oder</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Wird angemeldet...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Mit Google anmelden
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Toggle Register/Login */}
          <div className="text-center">
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-sm text-amber-400 hover:underline"
            >
              {isRegisterMode 
                ? 'Bereits einen Account? Hier anmelden' 
                : 'Noch keinen Account? Hier registrieren'
              }
            </button>
          </div>

          {/* Password Reset Link */}
          {!isRegisterMode && (
            <div className="text-center">
              <button
                onClick={() => setShowResetPassword(true)}
                className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
              >
                Passwort vergessen?
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>
            Durch die Anmeldung stimmst du unserer{' '}
            <Link href="/privacy" className="text-amber-400 hover:underline">
              Datenschutzerklärung
            </Link>
            {' '}zu. Weitere Infos im{' '}
            <Link href="/imprint" className="text-amber-400 hover:underline">
              Impressum
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
