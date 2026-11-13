"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = __importStar(require("node:path"));
const cors_1 = __importDefault(require("cors"));
const todoValidation_1 = require("./todoValidation");
const todoStore_1 = require("./todoStore");
const todoStore_2 = require("./todoStore");
/*import {

    pruefeDatentypen,
    pruefeLeereEingaben,
    pruefePrioritaet
} from "./todoStore";

 */
(0, todoStore_1.createTodo)({ title: "Mathe lernen", description: "intensiv arbeiten", priority: "mittel" });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = 8081;
app.use("/node_modules", express_1.default.static(path.join(__dirname, "../../node_modules")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../todo_app/public/todo.html"));
});
app.use(express_1.default.static(path.join(__dirname, "../../todo_app/public")));
app.get("/api/todos", (_req, res) => {
    res.status(200).json((0, todoStore_1.getAllTodos)());
});
app.get("/api/todos/:id", (req, res) => {
    const id = req.params.id; //hole den Wert des Parameters Id Aus der URL der HTTP-Anfrage
    const todo = (0, todoStore_2.findNachID)(id);
    if (!todo) {
        return res.status(404).json({
            error: "Todo nicht gefunden"
        });
    }
    return res.status(200).json(todo);
});
app.post("/api/todos", (req, res) => {
    const todo = req.body;
    if (!(0, todoValidation_1.pruefeDatentypen)(todo)) {
        return res.status(400).json({
            error: "Titel, Beschreibung und Priorität müssen Zeichenketten sein."
        });
    }
    if (!(0, todoValidation_1.pruefeLeereEingaben)(todo)) {
        return res.status(400).json({
            error: "Titel und Beschreibung dürfen nicht leer sein."
        });
    }
    if (!(0, todoValidation_1.pruefePrioritaet)(todo)) {
        return res.status(400).json({
            error: "Ungültige Priorität. Erlaubt sind hoch, mittel und niedrig."
        });
    }
    const neuesTodo = (0, todoStore_1.createTodo)(todo);
    res.location(`/api/todos/${neuesTodo.id}`);
    return res.status(201).json(neuesTodo);
});
app.put("/api/todos/:id", (req, res) => {
    const id = req.params.id;
    const todo = req.body;
    // 1. Prüfen, ob das Todo existiert
    const altesTodo = (0, todoStore_2.findNachID)(id);
    if (!altesTodo) {
        return res.status(404).json({
            error: "Todo nicht gefunden."
        });
    }
    // 2. Prüfen, ob der Body ein JSON-Objekt ist
    if (!(0, todoValidation_1.pruefeJsonObjekt)(todo)) {
        return res.status(400).json({
            error: "Der Body muss ein gültiges JSON-Objekt sein."
        });
    }
    // 3. Datentypen prüfen
    if (!(0, todoValidation_1.pruefeDatentypen)(todo)) {
        return res.status(400).json({
            error: "Titel, Beschreibung, Priorität und Status müssen Zeichenketten sein."
        });
    }
    // 4. Leere Eingaben prüfen
    if (!(0, todoValidation_1.pruefeLeereEingaben)(todo)) {
        return res.status(400).json({
            error: "Titel und Beschreibung dürfen nicht leer sein."
        });
    }
    // 5. Priorität prüfen
    if (!(0, todoValidation_1.pruefePrioritaet)(todo)) {
        return res.status(400).json({
            error: "Ungültige Priorität. Erlaubt sind hoch, mittel und niedrig."
        });
    }
    // 6. Status prüfen
    if (!(0, todoValidation_1.pruefeStatus)(todo)) {
        return res.status(400).json({
            error: "Ungültiger Status."
        });
    }
    // 7. Fälligkeitsdatum prüfen
    if (!(0, todoValidation_1.pruefeFaelligkeitsdatum)(todo)) {
        return res.status(400).json({
            error: "Ungültiges Fälligkeitsdatum."
        });
    }
    // 8. Todo aktualisieren
    const neuesTodo = (0, todoStore_2.updateTodo)(id, todo);
    return res.status(200).json(neuesTodo);
});
app.patch("/api/todos/:id", (req, res) => {
    const id = req.params.id;
    const todo = req.body;
    if (!(0, todoValidation_1.pruefePatchEigenschaften)(todo)) {
        return res.status(400).json({
            error: "Mindestens eine Eigenschaft muss angegeben werden."
        });
    }
    // 2. Prüfen, ob der Body ein JSON-Objekt ist
    if (!(0, todoValidation_1.pruefeJsonObjekt)(todo)) {
        return res.status(400).json({
            error: "Der Body muss ein gültiges JSON-Objekt sein."
        });
    }
    // 3. Mindestens eine Eigenschaft muss angegeben werden
    if (!(0, todoValidation_1.pruefePatchEigenschaften)(todo)) {
        return res.status(400).json({
            error: "Mindestens eine Eigenschaft muss angegeben werden."
        });
    }
    // 4. Titel und Beschreibung prüfen, falls vorhanden
    if (("title" in todo &&
        (typeof todo.title !== "string" || todo.title.trim().length === 0)) ||
        ("description" in todo &&
            (typeof todo.description !== "string" || todo.description.trim().length === 0))) {
        return res.status(400).json({
            error: "Titel und Beschreibung müssen gültige, nicht leere Zeichenketten sein."
        });
    }
    // 5. Priorität prüfen, falls vorhanden
    if ("priority" in todo && !(0, todoValidation_1.pruefePrioritaet)(todo)) {
        return res.status(400).json({
            error: "Ungültige Priorität."
        });
    }
    // 6. Status prüfen, falls vorhanden
    if ("status" in todo && !(0, todoValidation_1.pruefeStatus)(todo)) {
        return res.status(400).json({
            error: "Ungültiger Status."
        });
    }
    // 7. Fälligkeitsdatum prüfen, falls vorhanden
    if ("dueDate" in todo &&
        todo.dueDate !== null &&
        !(0, todoValidation_1.pruefeFaelligkeitsdatum)(todo)) {
        return res.status(400).json({
            error: "Ungültiges Fälligkeitsdatum."
        });
    }
    const neuesTodo = (0, todoStore_2.patchTodo)(id, todo);
    if (!neuesTodo) {
        return res.status(404).json({});
    }
    return res.status(200).json(neuesTodo);
});
app.delete("/api/todos/:id", (req, res) => {
    const id = req.params.id;
    const geloescht = (0, todoStore_2.deleteTodo)(id);
    if (!geloescht) {
        return res.status(404).json({
            error: "Todo nicht gefunden."
        });
    }
    return res.status(204).send();
});
app.listen(port, () => {
    console.log("Server started: http://localhost:" + port);
});
