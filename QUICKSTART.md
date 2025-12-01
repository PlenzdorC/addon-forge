# 🚀 AddOnForge - Schnellstart

## ✅ Installation abgeschlossen!

Deine AddOnForge-Website ist jetzt bereit! Der Development Server läuft bereits auf:

**http://localhost:3000**

## 📋 Nächste Schritte

### 1. Firebase einrichten (WICHTIG!)

Die Website benötigt Firebase, um zu funktionieren. Folge dieser Anleitung:

#### Firebase-Projekt erstellen:
1. Gehe zu https://console.firebase.google.com/
2. Klicke auf "Projekt hinzufügen"
3. Gib einen Namen ein (z.B. "addon-forge")
4. Folge den Schritten

#### Firestore aktivieren:
1. Gehe zu "Firestore Database"
2. Klicke auf "Datenbank erstellen"
3. Wähle "Im Produktionsmodus starten"
4. Wähle einen Standort (z.B. "europe-west3")

#### Authentication aktivieren:
1. Gehe zu "Authentication"
2. Klicke auf "Erste Schritte"
3. Aktiviere "Google" als Anmeldeanbieter
4. Wähle eine Support-E-Mail

#### Web-App hinzufügen:
1. Gehe zur Projektübersicht
2. Klicke auf das Web-Symbol (`</>`)
3. Gib einen Namen ein
4. **KOPIERE die Firebase-Konfiguration!**

#### Konfiguration eintragen:
1. Öffne die Datei `.env.local` im `addon-forge` Ordner
2. Füge deine Firebase-Werte ein:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=dein_api_key_hier
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dein_projekt.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dein_projekt_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dein_projekt.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=deine_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=deine_app_id
```

3. **WICHTIG**: Starte den Development Server neu:
   - Drücke `Ctrl+C` im Terminal
   - Führe erneut aus: `npm run dev`

#### Firestore-Regeln einrichten:
1. Gehe zu "Firestore Database" → "Regeln"
2. Kopiere den Inhalt aus `firestore.rules`
3. Füge ihn ein und klicke auf "Veröffentlichen"

### 2. Website testen

Sobald Firebase eingerichtet ist:

1. Öffne http://localhost:3000
2. Klicke auf "Anmelden" (oben rechts)
3. Melde dich mit Google an
4. Erstelle deine erste AddOn-Anfrage!

## 🎨 Features

✅ **Hauptseite** - Alle AddOn-Anfragen im Überblick  
✅ **Neue Anfrage** - Formular zum Erstellen von Anfragen  
✅ **Anfrage-Details** - Detailseite mit Kommentaren und Upvotes  
✅ **Benutzer-Profil** - Übersicht über eigene Anfragen  
✅ **Filterung & Suche** - Nach Kategorie, Status und Text filtern  
✅ **Upvote-System** - Abstimmen für beliebte Anfragen  
✅ **Kommentare** - Diskutieren über Anfragen  
✅ **Responsive Design** - Funktioniert auf allen Geräten  
✅ **WoW-Theme** - Dunkles Design mit Gold-Akzenten  

## 📁 Projekt-Struktur

```
addon-forge/
├── src/
│   ├── app/                 # Next.js Seiten
│   │   ├── page.tsx        # Hauptseite (Anfragen-Übersicht)
│   │   ├── create/         # Neue Anfrage erstellen
│   │   ├── request/[id]/   # Anfrage-Detailseite
│   │   ├── login/          # Login-Seite
│   │   ├── profile/        # Benutzer-Profil
│   │   └── about/          # Über uns
│   ├── components/         # React-Komponenten
│   │   ├── Header.tsx      # Navigation
│   │   ├── Footer.tsx      # Fußzeile
│   │   ├── RequestCard.tsx # Anfrage-Karte
│   │   └── FilterBar.tsx   # Filter-Komponente
│   ├── lib/                # Utilities
│   │   ├── firebase.ts     # Firebase-Konfiguration
│   │   └── utils.ts        # Hilfsfunktionen
│   └── types/              # TypeScript-Typen
└── public/                 # Statische Dateien
```

## 🛠️ Verfügbare Commands

```bash
npm run dev      # Development Server starten
npm run build    # Production Build erstellen
npm run start    # Production Server starten
npm run lint     # Code-Qualität prüfen
```

## 🚀 Deployment

### Vercel (Empfohlen):
1. Pushe deinen Code zu GitHub
2. Gehe zu https://vercel.com
3. Importiere dein Repository
4. Füge die Umgebungsvariablen hinzu
5. Deploy!

### Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🎨 Anpassungen

### Design ändern:
- Farben: `src/app/globals.css`
- Komponenten: `src/components/`
- Layout: `src/app/layout.tsx`

### Features hinzufügen:
- Neue Seiten: `src/app/` erstellen
- Neue Komponenten: `src/components/` erstellen
- Neue Typen: `src/types/index.ts` erweitern

## 📚 Weitere Dokumentation

- **SETUP.md** - Detaillierte Setup-Anleitung
- **README.md** - Projekt-Übersicht
- **firestore.rules** - Datenbank-Sicherheitsregeln
- **firestore.indexes.json** - Datenbank-Indizes

## 🆘 Hilfe

### Häufige Probleme:

**"Firebase not initialized"**
→ Überprüfe `.env.local` und starte den Server neu

**"Permission denied"**
→ Überprüfe die Firestore-Regeln in der Firebase Console

**"Module not found"**
→ Führe `npm install` erneut aus

## 🎮 Viel Erfolg!

Deine AddOnForge-Website ist bereit für die WoW-Community! 

Bei Fragen oder Problemen, schau in die Dokumentation oder erstelle ein Issue.

**For the Horde! For the Alliance! For great AddOns!** 🗡️

