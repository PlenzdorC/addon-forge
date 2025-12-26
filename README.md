# AddOnForge 🗡️

Eine moderne Community-Plattform für World of Warcraft AddOn-Anfragen, inspiriert von WeakAuras.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## 🎮 Über das Projekt

Mit der Ankündigung von World of Warcraft: Midnight und der Einstellung von WeakAuras entsteht eine Lücke in der WoW-Community. AddOnForge wurde geschaffen, um diese Lücke zu füllen und der Community eine Plattform zu bieten, auf der sie ihre AddOn-Wünsche teilen, diskutieren und deren Entwicklung verfolgen können.

## ✨ Features

### Für Benutzer
- **Öffentliche Anfragen**: Alle AddOn-Anfragen sind öffentlich einsehbar
- **Community-Voting**: Upvote-System für beliebte Anfragen
- **Status-Tracking**: Verfolge den Entwicklungsfortschritt in Echtzeit
- **Kommentare**: Diskutiere mit der Community über Anfragen
- **Kategorien & Filter**: Finde schnell relevante AddOn-Anfragen
- **News-Seite**: Entdecke die neuesten fertiggestellten AddOns
- **Benutzer-Profile**: Verwalte deine eigenen Anfragen
- **Mehrsprachig**: Vollständige Unterstützung für Deutsch und Englisch
- **Responsive Design**: Funktioniert auf allen Geräten

### Für Admins
- **Admin-Dashboard**: Übersicht über alle Statistiken und Anfragen
- **Anfragen verwalten**: Status ändern, Priorität setzen, Links hinzufügen
- **Status-Workflow**: requested → in-progress → completed/rejected
- **GitHub & Download-Links**: Füge Links zu fertigen AddOns hinzu
- **Geschützte Routen**: Nur Admins haben Zugriff auf Admin-Bereiche

## 🚀 Technologie-Stack

- **Frontend**: Next.js 15 mit React & TypeScript
- **Styling**: Tailwind CSS mit WoW-inspiriertem Dark Theme
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **i18n**: next-intl für Mehrsprachigkeit (DE/EN)
- **SEO**: Dynamische Metadata, Sitemap, Robots.txt, Schema.org
- **Deployment**: Firebase Hosting (oder Vercel)

## 📦 Installation

1. **Repository klonen**
```bash
git clone <repository-url>
cd addon-forge
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Firebase-Projekt erstellen**
   - Gehe zu [Firebase Console](https://console.firebase.google.com/)
   - Erstelle ein neues Projekt
   - Aktiviere Firestore Database
   - Aktiviere Authentication (Google Sign-In)
   - Aktiviere Storage (optional für Screenshots)

4. **Umgebungsvariablen konfigurieren**

Erstelle eine `.env.local` Datei mit deinen Firebase-Credentials:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# SEO Configuration (wichtig für Sitemap und Canonical URLs)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

5. **Firestore-Regeln einrichten**

Gehe zur Firebase Console → Firestore Database → Regeln und füge folgende Regeln ein:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{requestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && 
                      (resource.data.userId == request.auth.uid || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. **Development Server starten**
```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## 🏗️ Projekt-Struktur

```
addon-forge/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Hauptseite mit Anfragen-Übersicht
│   │   ├── create/            # Neue Anfrage erstellen
│   │   ├── request/[id]/      # Anfrage-Detailseite
│   │   ├── login/             # Login-Seite
│   │   ├── profile/           # Benutzer-Profil
│   │   ├── about/             # Über uns
│   │   ├── layout.tsx         # Root Layout
│   │   └── globals.css        # Globale Styles
│   ├── components/            # React-Komponenten
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── RequestCard.tsx
│   │   └── FilterBar.tsx
│   ├── lib/                   # Utilities & Konfiguration
│   │   ├── firebase.ts        # Firebase-Konfiguration
│   │   └── utils.ts           # Hilfsfunktionen
│   └── types/                 # TypeScript-Typen
│       └── index.ts
├── public/                    # Statische Assets
├── .env.local.example        # Beispiel für Umgebungsvariablen
└── package.json
```

## 🎨 Design

Das Design ist inspiriert von World of Warcraft mit:
- Dunklem Theme (Slate-Farben)
- Gold/Gelb-Akzenten (WoW-typisch)
- Modernen UI-Komponenten
- Responsivem Layout
- Smooth Animations

## 🔥 Firebase-Setup

### Firestore Collections

**requests**
```typescript
{
  id: string;
  title: string;
  description: string;
  category: 'UI' | 'Combat' | 'Utility' | 'Social' | 'Profession' | 'Other';
  status: 'requested' | 'in-progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  userName: string;
  upvotes: number;
  upvotedBy: string[];
  comments: Comment[];
  tags?: string[];
  githubRepo?: string;
  downloadUrl?: string;
}
```

### Authentication

- Google Sign-In ist aktiviert
- Weitere Provider können einfach hinzugefügt werden

## 🔍 SEO-Features

Das Projekt ist vollständig SEO-optimiert:

- ✅ **Dynamische Metadata**: Jede Seite hat optimierte Titel und Beschreibungen
- ✅ **Sitemap.xml**: Automatisch generiert unter `/sitemap.xml`
- ✅ **Robots.txt**: Konfiguriert unter `/robots.txt`
- ✅ **Schema.org Markup**: Strukturierte Daten für bessere Suchmaschinen-Integration
- ✅ **Open Graph & Twitter Cards**: Optimierte Social Media Previews
- ✅ **Canonical URLs**: Vermeidung von Duplicate Content
- ✅ **hreflang Tags**: Mehrsprachige SEO-Optimierung
- ✅ **Performance**: Kompression, Image-Optimierung, Security Headers

📖 Siehe `SEO_IMPLEMENTATION.md` für Details und nächste Schritte.

## 🚢 Deployment

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Nach dem Deployment:
1. Setze `NEXT_PUBLIC_BASE_URL` auf deine echte Domain
2. Reiche die Sitemap bei Google Search Console ein
3. Teste mit Google PageSpeed Insights

### Vercel

```bash
npm install -g vercel
vercel
```

Vercel setzt automatisch die richtige BASE_URL.

## 🤝 Beitragen

Contributions sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

## 📝 Lizenz

MIT License - siehe LICENSE-Datei für Details.

## 👨‍💻 Autor

Entwickelt mit ❤️ für die WoW-Community

## 🔗 Links

- [World of Warcraft](https://worldofwarcraft.com/)
- [Next.js Dokumentation](https://nextjs.org/docs)
- [Firebase Dokumentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Hinweis**: Dies ist ein Community-Projekt und steht in keiner Verbindung zu Blizzard Entertainment.
