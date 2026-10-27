# Todo-Verwaltung

Eine kleine TypeScript-Anwendung zum Anlegen, Anzeigen, Bearbeiten und Löschen
von Todos. Die Daten werden im Arbeitsspeicher gehalten und beim Neuladen
zurückgesetzt. Eine REST-API wird später ergänzt.

## Team
* Rose Mary 
### Repository
Clone-URL:git@git.thm.de:pi2-ws2627-do3e/todoapp-client.git

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
