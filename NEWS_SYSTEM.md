# 📰 News-System Dokumentation

## Übersicht

Das News-System ermöglicht es Admins, Artikel zu erstellen und zu verwalten. Die News-Seite zeigt diese Artikel im Hauptbereich und fertiggestellte AddOns in einer Sidebar.

## Features

### Für Admins
- ✅ **Artikel erstellen**: Vollständiger Editor mit Titel, Excerpt, Content, Cover Image
- ✅ **Draft/Published**: Artikel können als Entwurf gespeichert und später veröffentlicht werden
- ✅ **Tags**: Kategorisierung mit Tags
- ✅ **Live-Bearbeitung**: Artikel können jederzeit bearbeitet oder gelöscht werden
- ✅ **Schnelle Veröffentlichung**: Toggle-Button zum schnellen Veröffentlichen/Verstecken

### Für Benutzer
- ✅ **2-Spalten-Layout**: Artikel links, neue AddOns rechts
- ✅ **Responsive**: Funktioniert auf Desktop und Mobile
- ✅ **Sidebar**: Zeigt die 5 neuesten fertiggestellten AddOns mit Download-Links

## Struktur

### Firestore Collection: `news`

```typescript
{
  id: string;
  title: string;
  content: string;          // Vollständiger Artikelinhalt
  excerpt: string;          // Kurzbeschreibung für die Übersicht
  coverImage?: string;      // URL zum Titelbild
  author: string;
  authorId: string;
  published: boolean;       // Sichtbar auf der News-Seite
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tags?: string[];
}
```

## Seiten

### `/news` - News-Seite
- **Hauptbereich**: Zeigt veröffentlichte News-Artikel
- **Sidebar**: Zeigt die 5 neuesten fertiggestellten AddOns

### `/admin/news` - Admin-Verwaltung
- **Artikel-Liste**: Alle Artikel (auch Entwürfe)
- **Editor**: Vollständiger Editor zum Erstellen/Bearbeiten
- **Status-Toggle**: Schnelles Veröffentlichen/Verstecken

## Verwendung

### Als Admin einen Artikel erstellen:

1. Gehe zu `/admin/news`
2. Klicke auf "Neuer Artikel"
3. Fülle alle Felder aus:
   - **Titel**: Überschrift (max. 200 Zeichen)
   - **Kurzbeschreibung**: Wird in der Übersicht angezeigt (max. 300 Zeichen)
   - **Inhalt**: Vollständiger Artikeltext
   - **Titelbild**: URL zu einem Bild (optional)
   - **Tags**: Kommagetrennte Tags (optional)
   - **Veröffentlicht**: Checkbox aktivieren für sofortige Veröffentlichung
4. Klicke auf "Artikel speichern"

### Artikel bearbeiten:

1. Gehe zu `/admin/news`
2. Klicke auf das Bearbeiten-Icon (Stift)
3. Ändere die gewünschten Felder
4. Speichern

### Artikel veröffentlichen/verstecken:

- Klicke auf das Auge-Icon neben dem Artikel
- 👁️ (grün) = Veröffentlicht
- 👁️‍🗨️ (grau) = Entwurf

## Firestore Indexes

Der Index für die News-Collection ist bereits in `firestore.indexes.json` definiert:

```json
{
  "collectionGroup": "news",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "published",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "createdAt",
      "order": "DESCENDING"
    }
  ]
}
```

Nach dem Deployment deployen:
```bash
firebase deploy --only firestore:indexes
```

## Sicherheit

### Firestore Rules

Füge diese Regeln zu `firestore.rules` hinzu:

```javascript
match /news/{newsId} {
  // Jeder kann veröffentlichte Artikel lesen
  allow read: if resource.data.published == true;
  
  // Nur Admins können alle Artikel lesen (auch Entwürfe)
  allow read: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
  
  // Nur Admins können Artikel erstellen, bearbeiten, löschen
  allow create, update, delete: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}
```

## Zukünftige Erweiterungen

Mögliche Features für die Zukunft:

- [ ] **Detail-Seite**: `/news/[id]` für vollständige Artikel
- [ ] **Markdown-Support**: Rich Text Editor mit Markdown
- [ ] **Kommentare**: Kommentarfunktion für News-Artikel
- [ ] **Kategorien**: Eigene Kategorien zusätzlich zu Tags
- [ ] **Bilder-Upload**: Direkter Upload statt URL-Eingabe
- [ ] **Scheduling**: Artikel zu einem bestimmten Zeitpunkt veröffentlichen
- [ ] **Analytics**: Views und Engagement tracken
- [ ] **Related AddOns**: Verknüpfung mit spezifischen AddOn-Anfragen

## Navigation

- **Header**: "News" Link ist im Hauptmenü
- **Admin-Dashboard**: "📰 News verwalten" Button in Quick Actions

## Mehrsprachigkeit

Das System unterstützt DE/EN über next-intl:
- Alle UI-Texte sind übersetzt
- Artikel-Inhalte sind derzeit einsprachig
- Zukünftig: Mehrsprachige Artikel mit separaten Feldern für DE/EN

---

**Erstellt:** 26. Dezember 2024
**Status:** ✅ Vollständig implementiert

