# 🛡️ Admin-Panel Setup

## Admin-Benutzer einrichten

Das Admin-Panel ist jetzt fertig! Um es zu nutzen, musst du dich selbst als Admin markieren.

### Schritt 1: Erstelle ein Firebase-Projekt und melde dich an

1. Richte Firebase ein (siehe `QUICKSTART.md`)
2. Starte die Website: `npm run dev`
3. Melde dich mit Google an

### Schritt 2: Finde deine User-ID

**Option A: In der Browser-Konsole**
1. Öffne die Website (http://localhost:3000)
2. Melde dich an
3. Öffne die Browser-Konsole (F12)
4. Gib ein: `firebase.auth().currentUser.uid`
5. Kopiere die User-ID

**Option B: In Firebase Console**
1. Gehe zu https://console.firebase.google.com/
2. Wähle dein Projekt
3. Gehe zu "Authentication"
4. Finde deinen Benutzer in der Liste
5. Kopiere die User-ID

### Schritt 3: Erstelle Admin-Benutzer in Firestore

1. Gehe zu Firebase Console → Firestore Database
2. Klicke auf "Dokument hinzufügen" in der Root
3. Collection-ID: `users`
4. Dokument-ID: **Deine User-ID** (die du gerade kopiert hast)
5. Füge folgende Felder hinzu:

```
Feld-Name       | Typ       | Wert
----------------|-----------|------------------
uid             | string    | deine-user-id
email           | string    | deine@email.com
displayName     | string    | Dein Name
photoURL        | string    | (optional) URL zu deinem Bild
isAdmin         | boolean   | true
createdAt       | timestamp | (aktuelles Datum/Zeit)
```

**WICHTIG**: Das Feld `isAdmin` muss auf `true` gesetzt werden!

### Schritt 4: Seite neu laden

1. Lade die Website neu (F5)
2. Du solltest jetzt einen "Admin" Link im Header sehen
3. Klicke darauf → Du bist im Admin-Panel! 🎉

## Admin-Panel Features

### 📊 Dashboard (`/admin`)
- Übersicht über alle Statistiken
- Anzahl Anfragen nach Status
- Neueste und beliebteste Anfragen
- Schnellzugriff zu wichtigen Bereichen

### 📝 Anfragen verwalten (`/admin/requests`)
- Alle Anfragen in einer Tabelle
- Filtern nach Status
- Suchen nach Titel/Beschreibung
- Sortieren nach Datum oder Beliebtheit
- Direkt zur Bearbeitung springen

### ✏️ Anfrage bearbeiten (`/admin/requests/[id]`)
- **Status ändern**: requested → in-progress → completed
- **Priorität setzen**: low, medium, high
- **GitHub-Repo hinzufügen**: Link zum Source Code
- **Download-Link hinzufügen**: Link zum fertigen AddOn
- **Anfrage löschen**: Komplette Entfernung

## Workflow: Anfrage bearbeiten

### 1. Neue Anfrage annehmen

```
Status: requested → in-progress
```

1. Gehe zu `/admin/requests`
2. Finde die Anfrage
3. Klicke auf "Bearbeiten"
4. Ändere Status auf "In Bearbeitung"
5. Klicke "Änderungen speichern"
6. Optional: Schreibe einen Kommentar auf der öffentlichen Seite

### 2. Während der Entwicklung

- Schreibe Updates als Admin-Kommentare
- Füge GitHub-Repo Link hinzu (sobald verfügbar)
- Halte die Community auf dem Laufenden

### 3. Fertigstellung

```
Status: in-progress → completed
```

1. Gehe zur Anfrage-Bearbeitung
2. Ändere Status auf "Fertiggestellt"
3. Füge Download-Link hinzu (z.B. CurseForge, GitHub Release)
4. Füge GitHub-Repo Link hinzu (falls noch nicht vorhanden)
5. Speichern!

### 4. Anfrage ablehnen

```
Status: requested → rejected
```

1. Ändere Status auf "Abgelehnt"
2. Schreibe einen Kommentar mit Begründung
3. Speichern

## Sicherheit

### Firestore-Regeln

Die `firestore.rules` Datei enthält bereits die richtigen Regeln:

```javascript
// Nur Admins können Status, Links etc. ändern
allow update: if isAuthenticated() &&
              (resource.data.userId == request.auth.uid || isAdmin());
```

### Admin-Check

Der Admin-Check erfolgt auf mehreren Ebenen:
1. **Client-Side**: Header zeigt Admin-Link nur für Admins
2. **Route-Protection**: `AdminRoute` Komponente prüft Admin-Status
3. **Firestore-Regeln**: Server-seitige Validierung

## Weitere Admins hinzufügen

Um weitere Admins hinzuzufügen:

1. Lass die Person sich anmelden
2. Finde ihre User-ID in Firebase Authentication
3. Erstelle ein Dokument in `users` Collection (wie oben)
4. Setze `isAdmin: true`

## Tipps & Tricks

### Massenbearbeitung

Aktuell gibt es keine Massenbearbeitung. Für viele Anfragen:
- Nutze Firebase Console direkt
- Oder erstelle ein Script (siehe unten)

### Benachrichtigungen

Aktuell gibt es keine automatischen Benachrichtigungen. Du kannst:
- Manuell Kommentare schreiben
- Später Discord-Integration hinzufügen
- Später E-Mail-Benachrichtigungen implementieren

### Backup

Sichere regelmäßig deine Firestore-Daten:
```bash
firebase firestore:export gs://your-bucket/backups
```

## Fehlerbehebung

### "Zugriff verweigert" trotz Admin-Status

1. Überprüfe in Firestore: `users/[deine-user-id]/isAdmin` = `true`
2. Lösche Browser-Cache und Cookies
3. Melde dich ab und wieder an
4. Prüfe Browser-Konsole auf Fehler

### Admin-Link erscheint nicht

1. Melde dich ab und wieder an
2. Überprüfe Firestore-Dokument
3. Prüfe Browser-Konsole: `await isUserAdmin(auth.currentUser)`

### Änderungen werden nicht gespeichert

1. Prüfe Firestore-Regeln
2. Prüfe Browser-Konsole auf Fehler
3. Stelle sicher, dass du als Admin eingeloggt bist

## Zukünftige Erweiterungen

Mögliche Features für später:
- 📧 E-Mail-Benachrichtigungen
- 💬 Discord-Integration
- 📊 Erweiterte Statistiken
- 👥 Benutzer-Verwaltung
- 🏷️ Tag-Verwaltung
- 📸 Screenshot-Upload
- 🔍 Erweiterte Suche
- 📱 Mobile Admin-App

## Support

Bei Fragen oder Problemen:
1. Prüfe die Browser-Konsole
2. Prüfe Firebase Console → Firestore → Regeln
3. Prüfe `firestore.rules` Datei

Viel Erfolg als Admin! 🛡️

