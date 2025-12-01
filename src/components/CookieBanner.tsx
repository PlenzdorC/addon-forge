'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookiesAccepted', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="max-w-6xl mx-auto wow-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <Cookie className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Cookie-Hinweis
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Wir verwenden Cookies und ähnliche Technologien, um die Funktionalität unserer Website zu gewährleisten. 
              Dazu gehören notwendige Cookies für Firebase Authentication und Firestore Database. 
              Durch die Nutzung dieser Website stimmst du der Verwendung von Cookies zu.
            </p>
            <p className="text-slate-400 text-xs mb-4">
              Weitere Informationen findest du in unserer{' '}
              <Link href="/privacy" className="text-amber-400 hover:underline">
                Datenschutzerklärung
              </Link>
              {' '}und im{' '}
              <Link href="/imprint" className="text-amber-400 hover:underline">
                Impressum
              </Link>
              .
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={acceptCookies}
                className="wow-button text-sm"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={declineCookies}
                className="wow-button-secondary text-sm"
              >
                Nur notwendige
              </button>
            </div>
          </div>

          <button
            onClick={declineCookies}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
            aria-label="Schließen"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

