import { Shield, Database, Cookie, Eye, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Datenschutzerklärung</h1>
        <p className="text-slate-400">
          Informationen zur Verarbeitung deiner Daten
        </p>
      </div>

      {/* Übersicht */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Datenschutz auf einen Blick</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Diese Datenschutzerklärung klärt dich über die Art, den Umfang und Zweck der Verarbeitung 
              von personenbezogenen Daten innerhalb unseres Onlineangebotes auf.
            </p>
          </div>
        </div>
      </div>

      {/* Verantwortlicher */}
      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Verantwortlicher</h2>
        <div className="text-slate-300 space-y-1">
          <p className="font-semibold">Christian Plenzdorf</p>
          <p>Paul-Ritter-Straße 25</p>
          <p>90431 Nürnberg</p>
          <p>Deutschland</p>
          <p className="mt-3">
            E-Mail:{' '}
            <a 
              href="mailto:christian.plenzdorf.business@gmail.com"
              className="text-amber-400 hover:underline"
            >
              christian.plenzdorf.business@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Datenerfassung */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Database className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <h2 className="text-xl font-bold text-slate-100">Welche Daten erfassen wir?</h2>
        </div>

        <div className="space-y-6 text-slate-300">
          <div>
            <h3 className="font-semibold text-slate-200 mb-2">1. Google Authentication</h3>
            <p className="text-sm leading-relaxed mb-2">
              Wenn du dich mit Google anmeldest, erfassen wir:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Google User-ID (eindeutige Kennung)</li>
              <li>E-Mail-Adresse</li>
              <li>Name (Google-Profilname)</li>
              <li>Profilbild (optional)</li>
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              Diese Daten werden von Google bereitgestellt und in Firebase Authentication gespeichert.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">2. Benutzerprofil</h3>
            <p className="text-sm leading-relaxed mb-2">
              In unserer Datenbank (Firebase Firestore) speichern wir:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>User-ID</li>
              <li>E-Mail-Adresse</li>
              <li>Benutzername (von dir gewählt)</li>
              <li>Profilbild-URL</li>
              <li>Admin-Status (true/false)</li>
              <li>Erstellungsdatum</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">3. AddOn-Anfragen</h3>
            <p className="text-sm leading-relaxed mb-2">
              Wenn du eine Anfrage erstellst, speichern wir:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Titel und Beschreibung der Anfrage</li>
              <li>Kategorie und Priorität</li>
              <li>Deine User-ID und Benutzername</li>
              <li>Erstellungs- und Änderungsdatum</li>
              <li>Upvotes und Kommentare</li>
              <li>Optional: Tags, Screenshots, Links</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-2">4. Kommentare</h3>
            <p className="text-sm leading-relaxed mb-2">
              Bei Kommentaren speichern wir:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Kommentartext</li>
              <li>Deine User-ID und Benutzername</li>
              <li>Erstellungsdatum</li>
              <li>Admin-Status (für Admin-Badge)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Zweck der Datenverarbeitung */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Eye className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <h2 className="text-xl font-bold text-slate-100">Zweck der Datenverarbeitung</h2>
        </div>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Authentifizierung</h3>
            <p className="leading-relaxed">
              Wir verwenden deine Daten, um dich zu identifizieren und dir Zugang zu deinem Profil 
              und deinen Anfragen zu gewähren.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Community-Funktionen</h3>
            <p className="leading-relaxed">
              Dein Benutzername und Profilbild werden öffentlich angezeigt, damit andere Benutzer 
              sehen können, wer Anfragen erstellt und kommentiert hat.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Verwaltung</h3>
            <p className="leading-relaxed">
              Admins können Anfragen moderieren und den Status ändern. Deine E-Mail-Adresse wird 
              nicht öffentlich angezeigt.
            </p>
          </div>
        </div>
      </div>

      {/* Cookies */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Cookie className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <h2 className="text-xl font-bold text-slate-100">Cookies und lokale Speicherung</h2>
        </div>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Firebase Authentication</h3>
            <p className="leading-relaxed">
              Firebase verwendet Cookies und lokale Speicherung (localStorage), um deine Anmeldung 
              zu speichern. Diese sind notwendig für die Funktionalität der Website.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Cookie-Präferenzen</h3>
            <p className="leading-relaxed">
              Wir speichern deine Cookie-Präferenzen in localStorage, damit der Cookie-Banner nicht 
              bei jedem Besuch angezeigt wird.
            </p>
          </div>
        </div>
      </div>

      {/* Datensicherheit */}
      <div className="wow-card p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Lock className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <h2 className="text-xl font-bold text-slate-100">Datensicherheit</h2>
        </div>

        <div className="space-y-4 text-slate-300 text-sm">
          <p className="leading-relaxed">
            Wir verwenden Firebase (Google Cloud Platform) für die Datenspeicherung. Firebase bietet:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Verschlüsselte Datenübertragung (HTTPS)</li>
            <li>Verschlüsselte Datenspeicherung</li>
            <li>Firestore Security Rules für Zugriffskontrolle</li>
            <li>Regelmäßige Sicherheitsupdates</li>
          </ul>
        </div>
      </div>

      {/* Deine Rechte */}
      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Deine Rechte (DSGVO)</h2>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Auskunftsrecht</h3>
            <p className="leading-relaxed">
              Du hast das Recht, Auskunft über deine gespeicherten Daten zu erhalten.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Berichtigungsrecht</h3>
            <p className="leading-relaxed">
              Du kannst deine Daten jederzeit in den Einstellungen ändern.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Löschungsrecht</h3>
            <p className="leading-relaxed">
              Du kannst die Löschung deiner Daten beantragen. Kontaktiere uns dazu per E-Mail.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Widerspruchsrecht</h3>
            <p className="leading-relaxed">
              Du kannst der Verarbeitung deiner Daten widersprechen.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Datenübertragbarkeit</h3>
            <p className="leading-relaxed">
              Du hast das Recht, deine Daten in einem strukturierten Format zu erhalten.
            </p>
          </div>
        </div>
      </div>

      {/* Drittanbieter */}
      <div className="wow-card p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Drittanbieter-Dienste</h2>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Google Firebase</h3>
            <p className="leading-relaxed mb-2">
              Wir nutzen Firebase (Google LLC) für:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Authentication (Anmeldung)</li>
              <li>Firestore Database (Datenspeicherung)</li>
              <li>Hosting (Website-Bereitstellung)</li>
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              Datenschutzerklärung: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">firebase.google.com/support/privacy</a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Google Sign-In</h3>
            <p className="leading-relaxed">
              Für die Anmeldung nutzen wir Google Sign-In. Dabei werden Daten an Google übermittelt.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Datenschutzerklärung: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">policies.google.com/privacy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div className="wow-card p-8">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Fragen zum Datenschutz?</h2>
        <p className="text-slate-300 text-sm mb-4">
          Bei Fragen zur Verarbeitung deiner Daten kannst du uns jederzeit kontaktieren:
        </p>
        <p className="text-slate-300">
          <a 
            href="mailto:christian.plenzdorf.business@gmail.com"
            className="text-amber-400 hover:underline"
          >
            christian.plenzdorf.business@gmail.com
          </a>
        </p>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400">
            Stand: Dezember 2024 | <Link href="/imprint" className="text-amber-400 hover:underline">Impressum</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

