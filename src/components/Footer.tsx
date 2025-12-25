import { Github, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/50 bg-slate-900/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              AddOnForge
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Eine Community-Plattform für World of Warcraft AddOn-Anfragen.
              Inspiriert von WeakAuras, entwickelt für die Community.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Alle Anfragen
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Neue Anfrage erstellen
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Über das Projekt
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              Rechtliches
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/imprint"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              Unterstützung
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/support"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Unterstütze uns
                </Link>
              </li>
              <li>
                <a
                  href="https://buymeacoffee.com/nmxsz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  Buy Me a Coffee ☕
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-400">
              © {currentYear} AddOnForge. Alle Rechte vorbehalten.
            </p>
            
            <div className="flex items-center gap-4">
              <a
                href="https://buymeacoffee.com/nmxsz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-semibold rounded-lg transition-all text-sm"
              >
                ☕ Buy Me a Coffee
              </a>
              
              <p className="text-sm text-slate-400 flex items-center">
                Gemacht mit <Heart className="h-4 w-4 mx-1 text-red-500" /> für
                die WoW Community
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

