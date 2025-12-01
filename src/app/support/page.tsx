import { Coffee, Heart, Sparkles, Code, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export default function Support() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-6">
          <Coffee className="h-10 w-10 text-slate-900" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
          Unterstütze AddOnForge
        </h1>
        <p className="text-xl text-slate-300 mb-6">
          Hilf mir, die WoW-Community mit großartigen AddOns zu versorgen
        </p>
      </div>

      {/* Main Card */}
      <div className="wow-card p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <Sparkles className="h-8 w-8 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">
              Warum deine Unterstützung wichtig ist
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              AddOnForge ist ein Community-Projekt, das ich in meiner Freizeit entwickle und betreibe. 
              Mit der Einstellung von WeakAuras wollte ich eine Plattform schaffen, auf der die Community 
              selbst entscheidet, welche AddOns entwickelt werden.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Deine Unterstützung hilft mir, mehr Zeit in die Entwicklung zu investieren und die 
              Plattform am Laufen zu halten. Alle AddOns bleiben kostenlos und open-source!
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="wow-card p-6">
          <Zap className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Server & Hosting</h3>
          <p className="text-slate-400">
            Firebase-Dienste, Domain und Hosting kosten Geld. Deine Unterstützung deckt diese Kosten.
          </p>
        </div>

        <div className="wow-card p-6">
          <Code className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Entwicklungszeit</h3>
          <p className="text-slate-400">
            Mehr Unterstützung = Mehr Zeit für AddOn-Entwicklung und neue Features.
          </p>
        </div>

        <div className="wow-card p-6">
          <Users className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Community-Features</h3>
          <p className="text-slate-400">
            Discord-Integration, Benachrichtigungen und weitere Features für die Community.
          </p>
        </div>

        <div className="wow-card p-6">
          <Heart className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Motivation</h3>
          <p className="text-slate-400">
            Deine Unterstützung zeigt, dass die Community hinter diesem Projekt steht!
          </p>
        </div>
      </div>

      {/* CTA Card */}
      <div className="wow-card p-8 text-center mb-8">
        <Coffee className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          Spendiere mir einen Kaffee ☕
        </h2>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Jeder Beitrag hilft! Ob ein einzelner Kaffee oder regelmäßige Unterstützung - 
          du machst einen Unterschied.
        </p>
        
        <a
          href="https://buymeacoffee.com/nxmsz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          <Coffee className="h-6 w-6" />
          Buy Me a Coffee
        </a>

        <p className="text-slate-500 text-sm mt-4">
          Sichere Zahlung über Buy Me a Coffee
        </p>
      </div>

      {/* FAQ */}
      <div className="wow-card p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Häufige Fragen</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-200 mb-2">
              Werden AddOns kostenpflichtig?
            </h3>
            <p className="text-slate-400 text-sm">
              Nein! Alle AddOns bleiben kostenlos und open-source. Deine Unterstützung ermöglicht 
              es mir nur, mehr Zeit zu investieren.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">
              Was passiert mit meiner Spende?
            </h3>
            <p className="text-slate-400 text-sm">
              Server-Kosten, Domain, Firebase-Dienste und vor allem mehr Zeit für die Entwicklung 
              von Community-gewünschten AddOns.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">
              Kann ich auch anders helfen?
            </h3>
            <p className="text-slate-400 text-sm">
              Ja! Erstelle Anfragen, stimme ab, teile die Plattform mit anderen Spielern oder 
              trage zum Code bei (GitHub).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">
              Gibt es Vorteile für Unterstützer?
            </h3>
            <p className="text-slate-400 text-sm">
              Aktuell nicht - alle Features bleiben für alle kostenlos. In Zukunft könnte es 
              ein Unterstützer-Badge oder ähnliches geben.
            </p>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center mt-8">
        <Link href="/" className="text-amber-400 hover:underline">
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}

