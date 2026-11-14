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

# Todo-Anwendung (Client und REST-API)

Eine Todo-Verwaltung mit Express-Server (Node.js, TypeScript) und Browser-Client.
Ein Server liefert die Oberfläche unter `/` und die API unter `/api/todos`.

## Voraussetzungen

- Node.js (empfohlen: aktuelle LTS-Version) und npm
- Git

## Installieren, bauen und starten

```bash
git clone <URL-des-Repositories>
cd ToDoApp-Client
git checkout HUE1
npm install
npm start
```

`npm start` übersetzt Server und Client (TypeScript nach JavaScript) und startet den Server.

Danach im Browser öffnen: **http://localhost:8080**

## Einzelne Befehle

| Befehl | Wirkung |
|---|---|
| `npm run build` | Server und Client übersetzen |
| `npm run build:api` | nur Server übersetzen |
| `npm run build:app` | nur Client übersetzen |
| `npm start` | übersetzen und Server starten |

## Projektstruktur

| Ordner | Inhalt |
|---|---|
| `todo_api/src` | Server (Store, Validierung, Routen, Fehlerbehandlung) |
| `todo_app/src` | Client (`todoApp.ts`, `api.ts`) |
| `todo_app/public` | HTML und kompiliertes JavaScript des Clients |
| `shared` | gemeinsame Typen |
| `tests` | HTTP-Tests (`todo-api.http`) |

## REST-API

| Methode | Pfad | Erfolg | Fehler |
|---|---|---|---|
| GET | `/api/todos` | 200, Array (leer: `[]`) | |
| GET | `/api/todos/:id` | 200, Objekt | 404 |
| POST | `/api/todos` | 201 + `Location`-Header | 400 |
| PUT | `/api/todos/:id` | 200, Objekt | 400, 404 |
| PATCH | `/api/todos/:id` | 200, Objekt | 400, 404 |
| DELETE | `/api/todos/:id` | 204 | 404 |

Fehlerformat: `{ "error": "Ungültige Eingabe.", "details": ["title fehlt."] }`

## Hinweise

- Die Daten liegen im Arbeitsspeicher des Servers. Sie bleiben beim Neuladen der Seite erhalten und gehen beim Neustart des Servers verloren.
- Für Fehler außerhalb des Dialogs gibt es zusätzlich den Fehlerbereich `#page-error`, weil `#error-msg` nur im geöffneten Dialog sichtbar ist.

## Tests

Die Datei `tests/todo-api.http` kann in WebStorm ausgeführt werden (Server vorher starten).

## Vert.x Echo-Service

Das Vert.x-Projekt liegt im Unterordner `echo-service`. Es ist eine eigenständige Anwendung mit eigener Gradle-Konfiguration und läuft unabhängig von der Todo-Anwendung.

**Voraussetzung:** JDK 17 oder höher (entwickelt mit JDK 25).

**Starten:** Den Ordner `echo-service` in IntelliJ IDEA öffnen und die Klasse `Start` ausführen (grüner Pfeil neben der `main`-Methode). Im Terminal erscheint `HTTP server started on port 8888`.

Der Server läuft auf `http://localhost:8888`.

| Route | Methode | Beschreibung |
|---|---|---|
| `/echo?message=...` | GET | 200 mit `Echo: <message>`, ohne Parameter 400 |
| `/echoUser` | POST | JSON `{"email": "...", "password": "..."}`, Antwort 200 mit `{"id": "...", "email": "..."}` (ohne Passwort), bei ungültigem JSON 400 |

**Testen:** Beispielanfragen stehen in `echo-service/echo.http` (IntelliJ HTTP-Client). Alternativ mit curl:

```bash
curl.exe -i "http://localhost:8888/echo?message=PI2"
