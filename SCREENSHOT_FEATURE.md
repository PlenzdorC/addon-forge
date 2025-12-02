# 📸 Screenshot-Upload Feature

## Übersicht

Benutzer können jetzt beim Erstellen einer AddOn-Anfrage Screenshots hochladen, um ihre Idee besser zu visualisieren.

## Features

### ✨ Upload-Funktionen

- **Bis zu 5 Screenshots** pro Anfrage
- **Unterstützte Formate**: PNG, JPG, JPEG, WebP, GIF
- **Max. Dateigröße**: 5MB pro Screenshot
- **Drag & Drop**: Einfaches Hochladen
- **Vorschau**: Sofortige Vorschau vor dem Hochladen
- **Entfernen**: Screenshots vor dem Absenden entfernen

### 🎨 Anzeige

- **Anfrage-Detailseite**: Screenshots in Grid-Layout
- **Lightbox**: Klick zum Vergrößern (öffnet in neuem Tab)
- **Hover-Effekt**: Zoom-Animation
- **Responsive**: Funktioniert auf allen Geräten

## Technische Details

### Firebase Storage

Screenshots werden in Firebase Storage gespeichert:

```
/screenshots/
  /{requestId}/
    /{requestId}_0_timestamp.png
    /{requestId}_1_timestamp.jpg
    ...
```

### Dateistruktur

```typescript
interface AddonRequest {
  // ... andere Felder
  screenshots?: string[];  // Array von Download-URLs
}
```

### Upload-Prozess

1. **Benutzer wählt Dateien** → Validierung (Typ, Größe)
2. **Vorschau erstellen** → FileReader API
3. **Anfrage erstellen** → Firestore Document
4. **Screenshots hochladen** → Firebase Storage (parallel)
5. **URLs speichern** → Firestore Update
6. **Weiterleitung** → Success-Seite

### Code-Beispiel

```typescript
// Upload Screenshots
const uploadScreenshots = async (requestId: string): Promise<string[]> => {
  const uploadPromises = screenshots.map(async (file, index) => {
    const fileName = `${requestId}_${index}_${Date.now()}.${ext}`;
    const storageRef = ref(storage, `screenshots/${requestId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  });

  return await Promise.all(uploadPromises);
};
```

## Firebase Storage Setup

### 1. Storage aktivieren

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Wähle dein Projekt
3. Gehe zu **Storage**
4. Klicke auf "Erste Schritte"
5. Wähle einen Standort (z.B. europe-west3)
6. Klicke auf "Fertig"

### 2. Storage Rules einrichten

Die `storage.rules` Datei ist bereits erstellt. Deploye sie:

```bash
firebase deploy --only storage
```

**Oder manuell in Firebase Console:**

1. Gehe zu Storage → Rules
2. Kopiere den Inhalt aus `storage.rules`
3. Klicke auf "Veröffentlichen"

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /screenshots/{requestId}/{fileName} {
      allow read: if true;  // Jeder kann Screenshots sehen
      allow write: if request.auth != null;  // Nur angemeldete Benutzer
    }
  }
}
```

## Validierung

### Client-Side

- ✅ Dateityp: Nur Bilder (image/*)
- ✅ Dateigröße: Max. 5MB
- ✅ Anzahl: Max. 5 Screenshots
- ✅ Dateiname: Automatisch generiert

### Server-Side

- ✅ Firebase Storage Rules: Nur authentifizierte Benutzer
- ✅ Firestore Rules: Nur Ersteller kann Anfrage bearbeiten

## Benutzer-Flow

### Anfrage erstellen mit Screenshots

```
1. Formular ausfüllen
   ↓
2. "Screenshots hochladen" klicken
   ↓
3. Dateien auswählen (bis zu 5)
   ↓
4. Vorschau wird angezeigt
   ↓
5. Optional: Screenshots entfernen (X-Button)
   ↓
6. "Anfrage erstellen" klicken
   ↓
7. Screenshots werden hochgeladen
   ↓
8. Success-Seite (mit A/B Test)
```

### Screenshots ansehen

```
1. Anfrage öffnen
   ↓
2. Scrolle zu "Screenshots"
   ↓
3. Klicke auf Screenshot
   ↓
4. Öffnet in neuem Tab (Vollbild)
```

## UI/UX Features

### Upload-Bereich

- **Drag & Drop Zone**: Gestrichelte Border, hover-Effekt
- **Upload-Icon**: Visueller Hinweis
- **Fortschrittsanzeige**: "Screenshots werden hochgeladen..."
- **Fehleranzeige**: Klare Fehlermeldungen

### Vorschau-Grid

- **2-3 Spalten**: Responsive Layout
- **Thumbnails**: 128px Höhe
- **Hover-Effekt**: Zeigt Dateinamen
- **Entfernen-Button**: Erscheint beim Hover
- **Gruppiert**: Übersichtliche Darstellung

### Detailansicht

- **Grid-Layout**: 1-3 Spalten je nach Bildschirmgröße
- **Hover-Zoom**: Leichte Vergrößerung
- **Border-Highlight**: Amber beim Hover
- **"Vergrößern"-Text**: Erscheint beim Hover

## Fehlermeldungen

- "Maximal 5 Screenshots erlaubt"
- "[Dateiname] ist keine Bilddatei"
- "[Dateiname] ist größer als 5MB"
- "Fehler beim Hochladen der Screenshots"

## Performance

### Optimierungen

- **Paralleles Upload**: Alle Screenshots gleichzeitig
- **Lazy Loading**: Bilder laden nur wenn sichtbar
- **Thumbnails**: Könnte später implementiert werden
- **Komprimierung**: Könnte client-side hinzugefügt werden

### Kosten

Firebase Storage ist kostenlos bis:
- **5GB Speicher**
- **1GB Download/Tag**

Für Screenshots sollte das lange reichen!

## Zukünftige Erweiterungen

Mögliche Features:
- 📸 Drag & Drop direkt
- 🖼️ Bildbearbeitung (Crop, Resize)
- 🗜️ Automatische Komprimierung
- 🔍 Lightbox-Galerie
- 📊 Bild-Metadaten (Auflösung, Größe)
- 🎨 Screenshot-Annotationen
- 📱 Mobile Upload verbessern

## Troubleshooting

### Screenshots werden nicht hochgeladen

1. Prüfe Firebase Storage in der Console
2. Prüfe Storage Rules
3. Prüfe Browser-Konsole auf Fehler
4. Stelle sicher, dass Storage aktiviert ist

### "Permission denied"

- Storage Rules nicht korrekt → Prüfe `storage.rules`
- Benutzer nicht angemeldet → Login erforderlich
- Storage nicht aktiviert → In Firebase Console aktivieren

### Bilder werden nicht angezeigt

- URL falsch → Prüfe Firestore `screenshots` Array
- Storage Rules → Prüfe `allow read: if true`
- CORS-Problem → Sollte mit Firebase nicht auftreten

## Testing

### Testfälle

1. ✅ Screenshot hochladen (PNG, JPG)
2. ✅ Mehrere Screenshots (2-5)
3. ✅ Screenshot entfernen
4. ✅ Zu große Datei (>5MB)
5. ✅ Falscher Dateityp (PDF, etc.)
6. ✅ Mehr als 5 Screenshots
7. ✅ Screenshots in Detailansicht
8. ✅ Screenshot vergrößern

### Beispiel-Screenshots

Gute Beispiele für WoW-AddOn Screenshots:
- UI-Mockups
- WeakAuras-Beispiele
- Interface-Konzepte
- Gameplay-Situationen
- Vergleiche (Vorher/Nachher)

## Support

Bei Problemen mit Screenshots:
1. Prüfe Firebase Console → Storage
2. Prüfe Browser-Konsole (F12)
3. Prüfe Dateiformat und -größe
4. Kontaktiere Support

Viel Spaß mit visuellen Anfragen! 📸

