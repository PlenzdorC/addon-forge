# 👤 Username-Feature

## Übersicht

Benutzer können jetzt beim ersten Anmelden einen eigenen Benutzernamen wählen, der anstelle ihres Google-Namens angezeigt wird.

## Wie es funktioniert

### 1. Erste Anmeldung

Wenn sich ein Benutzer zum ersten Mal anmeldet:

1. **Google Sign-In**: Benutzer meldet sich mit Google an
2. **Username-Prompt**: Ein Formular erscheint, wo der Benutzer einen Username eingeben kann
3. **Validierung**: 
   - Mindestens 3 Zeichen
   - Maximal 20 Zeichen
   - Darf nicht leer sein
4. **Speicherung**: Der Username wird in Firestore unter `users/[uid]/displayName` gespeichert

### 2. Username wird überall verwendet

Der gewählte Username wird angezeigt bei:
- ✅ Header (oben rechts)
- ✅ Anfragen (Ersteller-Name)
- ✅ Kommentaren
- ✅ Profil-Seite
- ✅ Admin-Panel

### 3. Username ändern

Benutzer können ihren Username jederzeit ändern:

1. Gehe zu **Einstellungen** (im Header-Menü)
2. Ändere den Benutzernamen
3. Klicke auf "Änderungen speichern"

**Wichtig**: Der neue Username wird bei **neuen** Anfragen und Kommentaren verwendet. Alte Anfragen/Kommentare behalten den alten Namen (da sie als Snapshot gespeichert sind).

## Technische Details

### Datenstruktur

**Firestore Collection: `users`**
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  displayName: "CustomUsername",  // Der gewählte Username
  photoURL: "https://...",
  isAdmin: false,
  createdAt: Timestamp
}
```

### Username-Abruf

Beim Erstellen von Anfragen/Kommentaren wird der Username aus Firestore geladen:

```typescript
// Get user's display name from Firestore
const userDoc = await getDoc(doc(db, 'users', user.uid));
const userName = userDoc.exists() 
  ? userDoc.data()?.displayName || user.displayName || 'Anonymous'
  : user.displayName || 'Anonymous';
```

### Fallback-Logik

1. **Erster Check**: Firestore `users/[uid]/displayName`
2. **Zweiter Check**: Google `user.displayName`
3. **Fallback**: "Anonymous"

## Benutzer-Flow

### Neue Benutzer

```
1. Klick auf "Anmelden"
   ↓
2. Google Sign-In
   ↓
3. Username-Formular erscheint
   ↓
4. Username eingeben (3-20 Zeichen)
   ↓
5. "Profil erstellen" klicken
   ↓
6. Weiterleitung zur Hauptseite
```

### Bestehende Benutzer

```
1. Klick auf "Anmelden"
   ↓
2. Google Sign-In
   ↓
3. Direkte Weiterleitung zur Hauptseite
   (kein Username-Prompt)
```

## Einstellungen-Seite

**Route**: `/settings`

Features:
- Profilbild anzeigen
- E-Mail anzeigen
- Mitglied seit Datum
- **Username bearbeiten**
- Account-Informationen

## Migration bestehender Benutzer

Wenn du bereits Benutzer hast, die sich vor diesem Feature angemeldet haben:

1. Sie haben noch kein Dokument in der `users` Collection
2. Beim nächsten Login wird automatisch ein Dokument erstellt
3. Der Google-Name wird als Standard-Username verwendet
4. Sie können ihren Username in den Einstellungen ändern

## Admin-Setup

Wenn du einen Admin manuell erstellen willst:

```javascript
// In Firebase Console → Firestore
{
  uid: "admin-user-id",
  email: "admin@example.com",
  displayName: "AdminName",  // Gewünschter Username
  photoURL: null,
  isAdmin: true,  // WICHTIG für Admin-Rechte
  createdAt: Timestamp
}
```

## Validierungsregeln

### Client-Side (JavaScript)

- Mindestens 3 Zeichen
- Maximal 20 Zeichen
- Nicht leer
- Wird getrimmt (Leerzeichen am Anfang/Ende entfernt)

### Firestore-Regeln

In `firestore.rules`:

```javascript
match /users/{userId} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

## Bekannte Einschränkungen

1. **Alte Anfragen/Kommentare**: Werden nicht automatisch aktualisiert wenn Username geändert wird
   - Lösung: Snapshot-basiert (zeigt den Namen zum Zeitpunkt der Erstellung)
   
2. **Username-Eindeutigkeit**: Aktuell nicht erzwungen
   - Mehrere Benutzer können den gleichen Username haben
   - Zukünftige Verbesserung: Eindeutigkeits-Check

3. **Sonderzeichen**: Aktuell erlaubt
   - Zukünftige Verbesserung: Nur Buchstaben, Zahlen, Unterstriche

## Zukünftige Verbesserungen

Mögliche Features:
- ✨ Username-Eindeutigkeit erzwingen
- ✨ Sonderzeichen-Filter
- ✨ Username-History
- ✨ @-Mentions in Kommentaren
- ✨ Username-Suche
- ✨ Profil-Bio
- ✨ Avatar-Upload (statt Google-Bild)

## Fehlerbehebung

### Username wird nicht angezeigt

1. Prüfe ob Firestore-Dokument existiert: `users/[uid]`
2. Prüfe ob `displayName` Feld vorhanden ist
3. Lösche Browser-Cache und melde dich neu an

### Username-Änderung funktioniert nicht

1. Prüfe Firestore-Regeln
2. Prüfe Browser-Konsole auf Fehler
3. Stelle sicher, dass du angemeldet bist

### "Anonymous" wird angezeigt

- Firestore-Dokument fehlt → Melde dich ab und wieder an
- `displayName` Feld ist leer → Gehe zu Einstellungen und setze einen Namen

## Support

Bei Fragen oder Problemen:
1. Prüfe die Browser-Konsole (F12)
2. Prüfe Firestore Console → `users` Collection
3. Prüfe ob Benutzer angemeldet ist

Viel Spaß mit personalisierten Usernames! 👤

