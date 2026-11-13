import express,{Express} from "express";
import * as path from "node:path";
import cors from "cors";


import {
    pruefeJsonObjekt,
    pruefeDatentypen,
    pruefeLeereEingaben,
    pruefePrioritaet,
    pruefeStatus,
    pruefeFaelligkeitsdatum,
    pruefePatchEigenschaften
} from "./todoValidation";


import { getAllTodos, createTodo } from "./todoStore";
import {findNachID, updateTodo, patchTodo, deleteTodo} from "./todoStore";

/*import {

    pruefeDatentypen,
    pruefeLeereEingaben,
    pruefePrioritaet
} from "./todoStore";

 */

createTodo({ title: "Mathe lernen", description: "intensiv arbeiten", priority: "mittel" });



const app: Express = express();
app.use(cors());

app.use(express.json());

const port: number = 8081;

app.use(
    "/node_modules",
    express.static(path.join(__dirname, "../../node_modules"))
);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../todo_app/public/todo.html"));
});
app.use(express.static(path.join(__dirname, "../../todo_app/public")));



app.get("/api/todos", (_req, res) => {
    res.status(200).json(getAllTodos());
});




app.get("/api/todos/:id", (req, res) => {

    const id = req.params.id; //hole den Wert des Parameters Id Aus der URL der HTTP-Anfrage

    const todo = findNachID(id);

    if (!todo) {
        return res.status(404).json({
            error: "Todo nicht gefunden"
        });
    }

    return res.status(200).json(todo);
});



app.post("/api/todos", (req, res) => {
    const todo = req.body;
    if (!pruefeDatentypen(todo)) {
        return res.status(400).json({
            error: "Titel, Beschreibung und Priorität müssen Zeichenketten sein."
        });
    }

    if (!pruefeLeereEingaben(todo)) {
        return res.status(400).json({
            error: "Titel und Beschreibung dürfen nicht leer sein."
        });
    }

    if (!pruefePrioritaet(todo)) {
        return res.status(400).json({
            error: "Ungültige Priorität. Erlaubt sind hoch, mittel und niedrig."
        });
    }
    const neuesTodo = createTodo(todo );
    res.location(`/api/todos/${neuesTodo.id}`);
    return res.status(201).json(neuesTodo);
});


app.put("/api/todos/:id", (req, res) => {

    const id = req.params.id;
    const todo = req.body;

    // 1. Prüfen, ob das Todo existiert
    const altesTodo = findNachID(id);

    if (!altesTodo) {
        return res.status(404).json({
            error: "Todo nicht gefunden."
        });
    }

    // 2. Prüfen, ob der Body ein JSON-Objekt ist
    if (!pruefeJsonObjekt(todo)) {
        return res.status(400).json({
            error: "Der Body muss ein gültiges JSON-Objekt sein."
        });
    }

    // 3. Datentypen prüfen
    if (!pruefeDatentypen(todo)) {
        return res.status(400).json({
            error: "Titel, Beschreibung, Priorität und Status müssen Zeichenketten sein."
        });
    }

    // 4. Leere Eingaben prüfen
    if (!pruefeLeereEingaben(todo)) {
        return res.status(400).json({
            error: "Titel und Beschreibung dürfen nicht leer sein."
        });
    }

    // 5. Priorität prüfen
    if (!pruefePrioritaet(todo)) {
        return res.status(400).json({
            error: "Ungültige Priorität. Erlaubt sind hoch, mittel und niedrig."
        });
    }

    // 6. Status prüfen
    if (!pruefeStatus(todo)) {
        return res.status(400).json({
            error: "Ungültiger Status."
        });
    }

    // 7. Fälligkeitsdatum prüfen
    if (!pruefeFaelligkeitsdatum(todo)) {
        return res.status(400).json({
            error: "Ungültiges Fälligkeitsdatum."
        });
    }

    // 8. Todo aktualisieren
    const neuesTodo = updateTodo(id, todo);

    return res.status(200).json(neuesTodo);
});


app.patch("/api/todos/:id", (req, res) => {
    const id = req.params.id;
    const todo = req.body;

    if (!pruefePatchEigenschaften(todo)) {
        return res.status(400).json({
            error: "Mindestens eine Eigenschaft muss angegeben werden."
        });
    }

    // 2. Prüfen, ob der Body ein JSON-Objekt ist
    if (!pruefeJsonObjekt(todo)) {
        return res.status(400).json({
            error: "Der Body muss ein gültiges JSON-Objekt sein."
        });
    }

    // 3. Mindestens eine Eigenschaft muss angegeben werden
    if (!pruefePatchEigenschaften(todo)) {
        return res.status(400).json({
            error: "Mindestens eine Eigenschaft muss angegeben werden."
        });
    }

    // 4. Titel und Beschreibung prüfen, falls vorhanden
    if (
        ("title" in todo &&
            (typeof todo.title !== "string" || todo.title.trim().length === 0)) ||
        ("description" in todo &&
            (typeof todo.description !== "string" || todo.description.trim().length === 0))
    ) {
        return res.status(400).json({
            error: "Titel und Beschreibung müssen gültige, nicht leere Zeichenketten sein."
        });
    }

    // 5. Priorität prüfen, falls vorhanden
    if ("priority" in todo && !pruefePrioritaet(todo)) {
        return res.status(400).json({
            error: "Ungültige Priorität."
        });
    }

    // 6. Status prüfen, falls vorhanden
    if ("status" in todo && !pruefeStatus(todo)) {
        return res.status(400).json({
            error: "Ungültiger Status."
        });
    }

    // 7. Fälligkeitsdatum prüfen, falls vorhanden
    if (
        "dueDate" in todo &&
        todo.dueDate !== null &&
        !pruefeFaelligkeitsdatum(todo)
    ) {
        return res.status(400).json({
            error: "Ungültiges Fälligkeitsdatum."
        });
    }


    const neuesTodo = patchTodo(id,todo);
    if (!neuesTodo) {
        return res.status(404).json({})
    }
    return res.status(200).json(neuesTodo);

});

app.delete("/api/todos/:id", (req, res) => {
    const id = req.params.id;

    const geloescht = deleteTodo(id);

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


