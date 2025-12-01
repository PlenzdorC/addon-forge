# AddOnForge - Setup-Anleitung

Diese Anleitung führt dich Schritt für Schritt durch die Einrichtung von AddOnForge.

## Voraussetzungen

- Node.js 18+ installiert
- Ein Google-Konto für Firebase
- Git (optional)

## Schritt 1: Firebase-Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Gib deinem Projekt einen Namen (z.B. "addon-forge")
4. Google Analytics ist optional - kannst du aktivieren oder überspringen
5. Klicke auf "Projekt erstellen"

## Schritt 2: Firebase-Dienste aktivieren

### Firestore Database

1. Gehe im Firebase-Menü zu "Firestore Database"
2. Klicke auf "Datenbank erstellen"
3. Wähle "Im Produktionsmodus starten"
4. Wähle einen Standort (z.B. "europe-west3" für Deutschland)
5. Klicke auf "Aktivieren"

### Authentication

1. Gehe im Firebase-Menü zu "Authentication"
2. Klicke auf "Erste Schritte"
3. Klicke auf "Google" unter "Anmeldeanbieter"
4. Aktiviere den Schalter
5. Wähle eine Support-E-Mail
6. Klicke auf "Speichern"

### Storage (Optional - für Screenshots)

1. Gehe im Firebase-Menü zu "Storage"
2. Klicke auf "Erste Schritte"
3. Akzeptiere die Standardregeln
4. Wähle einen Standort
5. Klicke auf "Fertig"

## Schritt 3: Web-App zu Firebase hinzufügen

1. Gehe zur Projektübersicht (Zahnrad-Symbol → Projekteinstellungen)
2. Scrolle nach unten zu "Ihre Apps"
3. Klicke auf das Web-Symbol (`</>`)
4. Gib einen App-Spitznamen ein (z.B. "AddOnForge Web")
5. **WICHTIG**: Kopiere die Firebase-Konfiguration
6. Klicke auf "App registrieren"

Die Konfiguration sieht ungefähr so aus:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "addon-forge-xxxxx.firebaseapp.com",
  projectId: "addon-forge-xxxxx",
  storageBucket: "addon-forge-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Schritt 4: Lokale Umgebung einrichten

1. Öffne die Datei `.env.local` im `addon-forge` Ordner
2. Füge deine Firebase-Konfiguration ein:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=dein_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dein_projekt.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dein_projekt_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dein_projekt.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=deine_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=deine_app_id
```

## Schritt 5: Firestore-Regeln einrichten

1. Gehe in der Firebase Console zu "Firestore Database" → "Regeln"
2. Kopiere den Inhalt aus `firestore.rules`
3. Füge ihn in den Regel-Editor ein
4. Klicke auf "Veröffentlichen"

## Schritt 6: Firestore-Indizes erstellen

1. Gehe in der Firebase Console zu "Firestore Database" → "Indizes"
2. Die Indizes werden automatisch erstellt, wenn du die App verwendest
3. Alternativ: Verwende die Firebase CLI (siehe unten)

## Schritt 7: Anwendung starten

```bash
cd addon-forge
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Schritt 8: Erste Schritte

1. Klicke auf "Anmelden" und melde dich mit Google an
2. Erstelle deine erste AddOn-Anfrage
3. Teste die Upvote- und Kommentar-Funktionen

## Optional: Firebase CLI einrichten

Für Deployment und erweiterte Funktionen:

```bash
# Firebase CLI installieren
npm install -g firebase-tools

# In Firebase einloggen
firebase login

# Firebase-Projekt initialisieren
cd addon-forge
firebase init

# Wähle:
# - Firestore
# - Hosting
# - Verwende existierendes Projekt
# - Akzeptiere Standardeinstellungen
```

## Deployment

### Option 1: Vercel (Empfohlen für Next.js)

1. Gehe zu [vercel.com](https://vercel.com)
2. Importiere dein GitHub-Repository
3. Füge die Umgebungsvariablen hinzu
4. Klicke auf "Deploy"

### Option 2: Firebase Hosting

```bash
# Build erstellen
npm run build

# Deployen
firebase deploy
```

## Troubleshooting

### "Firebase not initialized"
- Überprüfe, ob alle Umgebungsvariablen in `.env.local` gesetzt sind
- Starte den Development Server neu

### "Permission denied" in Firestore
- Überprüfe die Firestore-Regeln
- Stelle sicher, dass du angemeldet bist

### "Missing indexes"
- Klicke auf den Link in der Fehlermeldung
- Firebase erstellt den Index automatisch

## Support

Bei Fragen oder Problemen:
- Erstelle ein Issue auf GitHub
- Überprüfe die [Firebase Dokumentation](https://firebase.google.com/docs)
- Überprüfe die [Next.js Dokumentation](https://nextjs.org/docs)

## Nächste Schritte

- Passe das Design an deine Wünsche an
- Füge weitere Features hinzu
- Erstelle ein Admin-Panel
- Integriere Discord-Benachrichtigungen
- Füge Screenshot-Upload hinzu

Viel Erfolg mit AddOnForge! 🗡️

