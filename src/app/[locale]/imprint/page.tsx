import { Scale, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Imprint() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Impressum</h1>
        <p className="text-slate-400">
          Angaben gemäß § 5 TMG
        </p>
      </div>

      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-6">
          <Scale className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-4">Verantwortlich für den Inhalt</h2>
            
            <div className="space-y-3 text-slate-300">
              <p className="font-semibold text-lg">Christian Plenzdorf</p>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Paul-Ritter-Straße 25</p>
                  <p>90431 Nürnberg</p>
                  <p>Deutschland</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-500" />
                <a 
                  href="mailto:christian.plenzdorf.business@gmail.com"
                  className="text-amber-400 hover:underline"
                >
                  christian.plenzdorf.business@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Haftungsausschluss</h2>
        
        <div className="space-y-6 text-slate-300">
          <div>
            <h3 className="font-semibold text-slate-200 mb-2">Haftung für Inhalte</h3>
            <p className="text-sm leading-relaxed">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
              Tätigkeit hinweisen.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">Haftung für Links</h3>
            <p className="text-sm leading-relaxed">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
              Seiten verantwortlich.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">Urheberrecht</h3>
            <p className="text-sm leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">Disclaimer</h3>
            <p className="text-sm leading-relaxed">
              AddOnForge ist ein unabhängiges Community-Projekt und steht in keiner Verbindung zu 
              Blizzard Entertainment oder World of Warcraft. World of Warcraft und alle zugehörigen 
              Marken sind Eigentum von Blizzard Entertainment.
            </p>
          </div>
        </div>
      </div>

      <div className="wow-card p-8">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Weitere Informationen</h2>
        <div className="space-y-2">
          <Link 
            href="/privacy" 
            className="block text-amber-400 hover:underline"
          >
            → Datenschutzerklärung
          </Link>
          <Link 
            href="/" 
            className="block text-amber-400 hover:underline"
          >
            → Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

