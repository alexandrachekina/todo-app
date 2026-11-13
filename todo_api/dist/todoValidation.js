"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruefeJsonObjekt = pruefeJsonObjekt;
exports.pruefeDatentypen = pruefeDatentypen;
exports.pruefeLeereEingaben = pruefeLeereEingaben;
exports.pruefePrioritaet = pruefePrioritaet;
exports.pruefeStatus = pruefeStatus;
exports.pruefeFaelligkeitsdatum = pruefeFaelligkeitsdatum;
exports.pruefePatchEigenschaften = pruefePatchEigenschaften;
// 1. Prüfen, ob der Body ein gültiges JSON-Objekt ist
function pruefeJsonObjekt(body) {
    return (typeof body === "object" &&
        body !== null &&
        !Array.isArray(body));
}
// Hilfsfunktion für die weitere Typprüfung
function istObjekt(body) {
    return pruefeJsonObjekt(body);
}
// 2. Datentypen prüfen
function pruefeDatentypen(todo) {
    if (!istObjekt(todo)) {
        return false;
    }
    return (typeof todo.title === "string" &&
        typeof todo.description === "string" &&
        typeof todo.priority === "string");
}
// 3. Leere Eingaben prüfen
function pruefeLeereEingaben(todo) {
    return (todo.title.trim() !== "" &&
        todo.description.trim() !== "");
}
// 4. Priorität prüfen
function pruefePrioritaet(todo) {
    if (!istObjekt(todo)) {
        return false;
    }
    const erlaubtePrioritaeten = [
        "hoch",
        "mittel",
        "niedrig"
    ];
    return erlaubtePrioritaeten.includes(todo.priority);
}
// 5. Status prüfen
function pruefeStatus(todo) {
    if (!istObjekt(todo)) {
        return false;
    }
    const erlaubteStatus = [
        "offen",
        "erledigt",
        "in Bearbeitung"
    ];
    return erlaubteStatus.includes(todo.status);
}
// 6. Fälligkeitsdatum prüfen
function pruefeFaelligkeitsdatum(todo) {
    if (!istObjekt(todo)) {
        return false;
    }
    // dueDate ist optional
    if (todo.dueDate === undefined) {
        return true;
    }
    if (typeof todo.dueDate !== "string") {
        return false;
    }
    // Format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(todo.dueDate)) {
        return false;
    }
    const datum = new Date(todo.dueDate);
    return !isNaN(datum.getTime()) &&
        datum.toISOString().slice(0, 10) === todo.dueDate;
}
function pruefePatchEigenschaften(todo) {
    if (!istObjekt(todo)) {
        return false;
    }
    return ("title" in todo ||
        "description" in todo ||
        "priority" in todo ||
        "status" in todo ||
        "dueDate" in todo);
}
