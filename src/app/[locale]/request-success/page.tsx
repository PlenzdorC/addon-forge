'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Coffee, ArrowRight, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';

function RequestSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get('id');
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    // A/B Testing: 50% chance to show support page
    const shouldShowSupport = Math.random() < 0.5;
    setShowSupport(shouldShowSupport);
  }, []);

  if (!requestId) {
    router.push('/');
    return null;
  }

  // Variant A: Show support request
  if (showSupport) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="wow-card p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-slate-100 mb-4">
            Anfrage erfolgreich erstellt! 🎉
          </h1>
          <p className="text-slate-300 mb-8">
            Deine AddOn-Anfrage wurde veröffentlicht und ist jetzt für die Community sichtbar.
          </p>

          {/* Support Section */}
          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-lg p-8 mb-8">
            <Coffee className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-100 mb-3">
              Unterstütze AddOnForge ☕
            </h2>
            <p className="text-slate-300 mb-6">
              AddOnForge ist ein kostenloses Community-Projekt. Wenn dir die Plattform gefällt 
              und du die Entwicklung unterstützen möchtest, würde ich mich über einen Kaffee freuen!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://buymeacoffee.com/nmxsz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Coffee className="h-5 w-5" />
                Buy Me a Coffee
              </a>

              <Link
                href={`/request/${requestId}`}
                className="inline-flex items-center justify-center gap-2 wow-button-secondary"
              >
                Zur Anfrage
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <p className="text-slate-500 text-sm mt-4">
              Alle AddOns bleiben kostenlos - deine Unterstützung hilft mir, mehr Zeit zu investieren
            </p>
          </div>

          {/* Alternative Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block text-amber-400 hover:underline"
            >
              <Home className="inline h-4 w-4 mr-1" />
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Variant B: Direct to request (Control group)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="wow-card p-8 text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-slate-100 mb-4">
          Anfrage erfolgreich erstellt! 🎉
        </h1>
        <p className="text-slate-300 mb-8">
          Deine AddOn-Anfrage wurde veröffentlicht und ist jetzt für die Community sichtbar.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            href={`/request/${requestId}`}
            className="wow-button inline-flex items-center gap-2"
          >
            Zur Anfrage
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/"
            className="wow-button-secondary inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Zur Startseite
          </Link>
        </div>

        {/* Info */}
        <div className="text-sm text-slate-400 space-y-2">
          <p>Die Community kann jetzt für deine Anfrage abstimmen und kommentieren.</p>
          <p>Du wirst per E-Mail benachrichtigt, wenn es Updates gibt.</p>
        </div>
      </div>
    </div>
  );
}

export default function RequestSuccess() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    }>
      <RequestSuccessContent />
    </Suspense>
  );
}

