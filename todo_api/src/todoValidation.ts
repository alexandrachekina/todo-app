
import { TodoPriority, TodoStatus } from "./todo";

// 1. Prüfen, ob der Body ein gültiges JSON-Objekt ist
export function pruefeJsonObjekt(body: unknown): boolean {
    return (
        typeof body === "object" &&
        body !== null &&
        !Array.isArray(body)
    );
}

// Hilfsfunktion für die weitere Typprüfung
function istObjekt(body: unknown): body is Record<string, unknown> {
    return pruefeJsonObjekt(body);
}

// 2. Datentypen prüfen
export function pruefeDatentypen(todo: unknown): boolean {
    if (!istObjekt(todo)) {
        return false;
    }

    return (
        typeof todo.title === "string" &&
        typeof todo.description === "string" &&
        typeof todo.priority === "string"
    );
}

// 3. Leere Eingaben prüfen
export function pruefeLeereEingaben(todo: any): boolean {
    return (
        todo.title.trim() !== "" &&
        todo.description.trim() !== ""
    );
}

// 4. Priorität prüfen
export function pruefePrioritaet(todo: unknown): boolean {
    if (!istObjekt(todo)) {
        return false;
    }

    const erlaubtePrioritaeten: TodoPriority[] = [
        "hoch",
        "mittel",
        "niedrig"
    ];

    return erlaubtePrioritaeten.includes(
        todo.priority as TodoPriority
    );
}

// 5. Status prüfen
export function pruefeStatus(todo: unknown): boolean {
    if (!istObjekt(todo)) {
        return false;
    }

    const erlaubteStatus: TodoStatus[] = [
        "offen",
        "erledigt",
        "in Bearbeitung"
    ];

    return erlaubteStatus.includes(
        todo.status as TodoStatus
    );
}

// 6. Fälligkeitsdatum prüfen
export function pruefeFaelligkeitsdatum(todo: unknown): boolean {
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

export function pruefePatchEigenschaften(todo: unknown): boolean {
    if (!istObjekt(todo)) {
        return false;
    }

    return (
        "title" in todo ||
        "description" in todo ||
        "priority" in todo ||
        "status" in todo ||
        "dueDate" in todo
    );
}
