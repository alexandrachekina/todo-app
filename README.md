# Todo-Verwaltung

Eine kleine TypeScript-Anwendung zum Anlegen, Anzeigen, Bearbeiten und Löschen
von Todos. Die Daten werden im Arbeitsspeicher gehalten und beim Neuladen
zurückgesetzt. Eine REST-API wird später ergänzt.

## Team
* Mitglied1
* Alexandra Chekina Tetinou

## Starten

Voraussetzungen: Node.js mit npm.
Alle Befehle im Projektstamm ausführen:

```bash
npm ci
npm run build
```

Anschließend `todo_app/public/todo.html` direkt im Browser öffnen,
zum Beispiel per Doppelklick. Ein Webserver ist nicht erforderlich.

## Entwicklung

`npm run watch` kompiliert TypeScript bei Änderungen automatisch neu.
Die Seite nach Änderungen im Browser neu laden.

## Struktur

- `todo_app/src/`: TypeScript-Quellcode
- `todo_app/public/`: HTML und generiertes JavaScript
- `todo_api/`: Platz für die zu entwickelnde REST-API

Bootstrap wird lokal aus `node_modules/` geladen. Generierte JavaScript-Dateien
und Abhängigkeiten werden nicht versioniert.

## Voraussetzungen und lokaler Start

### Voraussetzungen

- Node.js und npm müssen installiert sein
- Git wird benötigt, um das Projekt zu klonen

### Projekt einrichten

Im Projektordner die Abhängigkeiten installieren:

npm ci

### TypeScript kompilieren

npm run build

Der Build kompiliert den TypeScript-Code anhand der konfiguration todo_app/tsconfig.json.

### Client öffnen

Die Datei todo_app/public/todo.html im Browser öffnen.
