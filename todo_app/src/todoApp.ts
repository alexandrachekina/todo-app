
type TodoPriority = "hoch" | "mittel" | "niedrig";
type TodoStatus = "offen" | "erledigt" | "in Bearbeitung";


interface Todo {
  id: string;
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  createdAt: Date;
  dueDate?: Date;
}

function formatDate(date?: Date): string {
  return date
    ? date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "Ohne Fälligkeitsdatum";
}

class TodoItem implements Todo {
  id: string;
  createdAt: Date;
  status: TodoStatus;
  title: string;
  description: string;
  priority: TodoPriority;
  dueDate?: Date;

  constructor(title: string, description: string, priority: TodoPriority, dueDate?: Date) {
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
    this.status = "offen";
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
  }
}

class TodoManager {
  private todos: Todo[] = [];

  async loadTodos() {
    const response = await fetch("http://localhost:8081/api/todos");
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Todos");
    }
    const data = await response.json();

    this.todos = data.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
    }));
  }


  add(title: string, description: string, priority: TodoPriority, dueDate?: Date): Todo {
    const todo = new TodoItem(title, description, priority, dueDate);
    this.todos.push(todo);
    return todo;
  }

  find(id: string): Todo | undefined {
    for (const todo of this.todos) {
      if (todo.id === id) {
        return todo;
      }
    }
    return undefined;
  }


  update(id: string, title: string, description: string, priority: TodoPriority,
         status: TodoStatus, dueDate?: Date): void {
    const todo = this.find(id);
    if (todo) {
      todo.title = title;
      todo.description = description;
      todo.priority = priority;
      todo.status = status;
      todo.dueDate = dueDate;
    }
  }

 remove(id: string): void {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos.splice(i, 1);
        return;
      }
    }
  }

  setStatus(id: string, status: TodoStatus): void {
    const todo = this.find(id);
    if (todo) {
      todo.status = status;
    }
  }

  private getStats(): string[] {
    let open = 0;
    let inProgress = 0;
    let done = 0;
    let withoutDueDate = 0;

    for (const todo of this.todos) {
      if (todo.status === "offen") {
        open++;
      } else if (todo.status === "in Bearbeitung") {
        inProgress++;
      } else if (todo.status === "erledigt") {
        done++;
      }
      if (!todo.dueDate) {
        withoutDueDate++;
      }
    }

    return [
      `Gesamt: ${this.todos.length}`,
      `offen: ${open} | in Bearbeitung: ${inProgress} | erledigt: ${done}`,
      `Ohne Fälligkeitsdatum: ${withoutDueDate}`,
    ];
  }

  render(): void {
    const list = document.querySelector<HTMLDivElement>("#todo-list");
    const stats = document.querySelector<HTMLDivElement>("#stats");
    if (!list || !stats) {
      throw new Error("Die Container #todo-list und #stats fehlen.");
    }
    // Geöffnete Details merken, bevor die Liste neu aufgebaut wird.
    const expandedIds: string[] = [];
    const openDetails = list.querySelectorAll<HTMLDetailsElement>("details[open]");
    for (const details of openDetails) {
      const id = details.dataset.todoId;
      if (id !== undefined) {
        expandedIds.push(id);
      }
    }
    list.replaceChildren();

    if (this.todos.length === 0) {
      const message = document.createElement("p");
      message.className = "text-body-secondary";
      message.textContent = "Noch keine Todos vorhanden.";
      list.appendChild(message);
    }

    for (const todo of this.todos) {
      const card = document.createElement("div");
      card.className = "todo-card card p-3 mb-3";
      card.setAttribute("data-id", todo.id);

      const row = document.createElement("div");
      row.className = "d-flex flex-wrap align-items-center gap-3";
      card.appendChild(row);

      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.className = "todo-checkbox form-check-input m-0";
      checkbox.setAttribute("aria-label", `${todo.title} als erledigt markieren`);
      checkbox.checked = todo.status === "erledigt";
      /* checkbox.addEventListener("change", () => {
        this.setStatus(todo.id, checkbox.checked ? "erledigt" : "offen");
        this.render();
        // Auch den Tastaturfokus nach dem Ersetzen der Checkbox wiederherstellen.
        focusTodoButton(todo.id, ".todo-checkbox");
      }); */
      row.appendChild(checkbox);



      checkbox.addEventListener("change", async () => {
        try {
          const response = await fetch(
              `http://localhost:8081/api/todos/${todo.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  status: checkbox.checked ? "erledigt" : "offen"
                })
              }
          );

          if (!response.ok) {
            throw new Error("Status konnte nicht aktualisiert werden");
          }

          // Aktuelle Daten vom Server laden
          await this.loadTodos();

          // Oberfläche aktualisieren
          this.render();

          // Fokus wiederherstellen
          focusTodoButton(todo.id, ".todo-checkbox");

        } catch (error) {
          console.error("Fehler beim Aktualisieren:", error);

          // Checkbox auf den vorherigen Zustand zurücksetzen
          checkbox.checked = !checkbox.checked;
        }
      });




      const title = document.createElement("span");
      title.className = "todo-title fw-bold text-break";
      title.textContent = todo.title;
      title.classList.toggle("text-decoration-line-through", todo.status === "erledigt");
      row.appendChild(title);

      const priority = document.createElement("span");
      priority.className = "todo-priority";
      priority.textContent = todo.priority;
      row.appendChild(priority);

      const deadline = document.createElement("span");
      deadline.className = "todo-deadline text-body-secondary";
      deadline.textContent = formatDate(todo.dueDate);
      row.appendChild(deadline);

      const details = document.createElement("details");
      details.dataset.todoId = todo.id;
      for (const id of expandedIds) {
        if (id === todo.id) {
          details.open = true;
          break;
        }
      }
      details.className = "todo-details border-top mt-2 pt-2";
      const summary = document.createElement("summary");
      summary.textContent = "Details anzeigen";
      details.appendChild(summary);
      const description = document.createElement("p");
      description.className = "mt-2 mb-2 text-break";
      // Zeilenumbrüche ohne eigenes CSS erhalten.
      const lines = todo.description.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
          description.appendChild(document.createElement("br"));
        }
        description.appendChild(document.createTextNode(lines[i]));
      }
      details.appendChild(description);
      const metadata = document.createElement("p");
      metadata.textContent = `Status: ${todo.status} | Priorität: ${todo.priority} | Erstellt: ${formatDate(todo.createdAt)} | Deadline: ${formatDate(todo.dueDate)}`;
      details.appendChild(metadata);
      card.appendChild(details);

      const actions = document.createElement("div");
      actions.className = "d-flex gap-2 mt-2";
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn btn-outline-primary btn-sm";
      editButton.textContent = "Bearbeiten";
      editButton.addEventListener("click", () => startEditing(todo.id));
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-outline-danger btn-sm";
      deleteButton.textContent = "Löschen";
      /*deleteButton.addEventListener("click", () => {
        this.remove(todo.id);
        this.render();
        // Nach dem Löschen verschwindet der auslösende Button.
        newButton.focus();
      });*/

      deleteButton.addEventListener("click", async () => {
        try {
          await deleteTodo(todo.id);
          await this.loadTodos();
          this.render();
          newButton.focus();
        } catch (error) {
          console.error("Fehler beim Löschen:", error);
        }
      });



      actions.append(editButton, deleteButton);
      card.appendChild(actions);

      list.appendChild(card);
    }

    stats.replaceChildren();
    for (const line of this.getStats()) {
      const paragraph = document.createElement("p");
      paragraph.className = "mb-1";
      paragraph.textContent = line;
      stats.appendChild(paragraph);
    }
  }
}

const manager = new TodoManager();
const form = document.querySelector<HTMLFormElement>("#todo-form")!;
const titleInput = document.querySelector<HTMLInputElement>("#todo-title")!;
const descriptionInput = document.querySelector<HTMLTextAreaElement>("#todo-description")!;
const priorityInput = document.querySelector<HTMLSelectElement>("#todo-priority")!;
const dueDateInput = document.querySelector<HTMLInputElement>("#todo-due-date")!;
const errorMsg = document.querySelector<HTMLDivElement>("#error-msg")!;

const statusInput = document.querySelector<HTMLSelectElement>("#todo-status")!;
const formHeading = document.querySelector<HTMLHeadingElement>("#form-heading")!;
const submitButton = document.querySelector<HTMLButtonElement>("#submit-todo")!;
const cancelButton = document.querySelector<HTMLButtonElement>("#cancel-edit")!;
const dialog = document.querySelector<HTMLDialogElement>("#todo-dialog")!;
const newButton = document.querySelector<HTMLButtonElement>("#new-todo")!;
let editingId: string | undefined;

// Nach render() sind die bisherigen DOM-Elemente ersetzt worden.
function focusTodoButton(id: string, selector: string): void {
  const cards = document.querySelectorAll<HTMLElement>(".todo-card");
  for (const card of cards) {
    if (card.dataset.id === id) {
      const button = card.querySelector<HTMLElement>(selector);
      if (button) {
        button.focus();
      }
      return;
    }
  }
}

function resetForm(): void {
  editingId = undefined;
  form.reset();
  formHeading.textContent = "Neues Todo";
  submitButton.textContent = "Todo hinzufügen";
  errorMsg.textContent = "";
  errorMsg.classList.add("d-none");
}

function startEditing(id: string): void {
  const todo = manager.find(id);
  if (!todo) return;
  resetForm();
  editingId = id;
  titleInput.value = todo.title;
  descriptionInput.value = todo.description;
  priorityInput.value = todo.priority;
  statusInput.value = todo.status;
  // Lokales Kalenderdatum verwenden, ohne UTC-Verschiebung durch toISOString().
  const date = todo.dueDate;
  dueDateInput.value = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";
  formHeading.textContent = "Todo bearbeiten";
  submitButton.textContent = "Änderungen speichern";
  dialog.showModal();
  titleInput.focus();
}

newButton.addEventListener("click", () => {
  resetForm();
  dialog.showModal();
  titleInput.focus();
});
cancelButton.addEventListener("click", () => dialog.close());
// Gilt sowohl für Abbrechen als auch für Escape und erfolgreiches Speichern.
dialog.addEventListener("close", resetForm);

/*form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDateValue = dueDateInput.value;
  const dueDate = dueDateValue ? new Date(`${dueDateValue}T00:00:00`) : undefined;
  const priority = priorityInput.value as TodoPriority;
  const status = statusInput.value as TodoStatus;

  if (!title || !description || !dueDateInput.validity.valid || (dueDate && Number.isNaN(dueDate.getTime()))) {
    errorMsg.textContent = "Bitte Titel und Beschreibung sowie ein gültiges Fälligkeitsdatum ausfüllen oder das Datum leer lassen.";
    errorMsg.classList.remove("d-none");
    return;
  }

  if (editingId !== undefined) {
    manager.update(editingId, title, description, priority, status, dueDate);
  } else {
    const todo = manager.add(title, description, priority, dueDate);
    manager.setStatus(todo.id, status);
  }
  const savedId = editingId;
  dialog.close();
  manager.render();
  // close() stellt den Fokus zunächst auf den alten Auslöser zurück.
  // render() ersetzt diesen; deshalb den neuen Button gezielt fokussieren.
  if (savedId !== undefined) {
    focusTodoButton(savedId, "button");
  } else {
    newButton.focus();
  }
});*/



form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDateValue = dueDateInput.value;

  const dueDate = dueDateValue || undefined;

  const priority = priorityInput.value as TodoPriority;
  const status = statusInput.value as TodoStatus;

  if (!title || !description) {
    errorMsg.textContent = "Bitte Titel und Beschreibung ausfüllen.";
    errorMsg.classList.remove("d-none");
    return;
  }

  try {
    if (editingId !== undefined) {

      // Bestehendes Todo aktualisieren (PUT)
      const response = await fetch(
          `http://localhost:8081/api/todos/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title,
              description,
              priority,
              status,
              dueDate
            })
          }
      );

      if (!response.ok) {
        throw new Error("Aktualisierung fehlgeschlagen");
      }

    } else {

      // Neues Todo erstellen (POST)
      await createTodos({
        title,
        description,
        priority,

        dueDate
      });
    }

    // Daten erneut vom Server abrufen
    await manager.loadTodos();

    // Oberfläche aktualisieren
    manager.render();

    dialog.close();

  } catch (error) {
    console.error("Fehler beim Speichern:", error);

    errorMsg.textContent = "Speichern fehlgeschlagen.";
    errorMsg.classList.remove("d-none");
  }
});




// Beispieldaten demonstrieren alle Statuswerte sowie ein Todo ohne Termin.
const tomorrow = new Date();
tomorrow.setHours(0, 0, 0, 0);
tomorrow.setDate(tomorrow.getDate() + 1);
//manager.add("Hausübung vorbereiten", "Aufgabenstellung lesen und offene Fragen notieren.", "hoch", tomorrow);
//const exampleInProgress = manager.add("TypeScript wiederholen", "Interfaces, Klassen und DOM-Ereignisse anhand der Todo-App nachvollziehen.", "mittel");
//manager.setStatus(exampleInProgress.id, "in Bearbeitung");
//const exampleDone = manager.add("Projekt starten", "Abhängigkeiten installieren, TypeScript kompilieren und die Anwendung öffnen.", "niedrig");
//manager.setStatus(exampleDone.id, "erledigt");




document.addEventListener("DOMContentLoaded", async () => {
  await manager.loadTodos();
  manager.render();
});
interface TodoInput{

  title: string;
  description: string;

  priority: TodoPriority;

  dueDate?: string;
}

async function createTodos(todo: TodoInput) {
  try {
    const response = await fetch("http://localhost:8081/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo)
    });

    if (!response.ok) {
      throw new Error("Fehler beim Erstellen des Todos");
    }

    const createdTodo = await response.json();
    console.log("Erstellt:", createdTodo);

  } catch (error) {
    console.error("Fehler:", error);
  }
}

async function aktualisiereTodo(
    id: string,
    todoData: TodoInput
): Promise<void> {
  try {
    const response = await fetch(
        `http://localhost:8081/api/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(todoData)
        }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren des Todos");
    }

    console.log("Todo erfolgreich aktualisiert!");

    await manager.loadTodos();
    manager.render();

  } catch (error) {
    console.error("Fehler:", error);
    throw error;
  }
}


async function patchTodo(
    id: string,
    changes: Partial<TodoInput>
): Promise<void> {
  try {
    const response = await fetch(
        `http://localhost:8081/api/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(changes)
        }
    );

    if (!response.ok) {
      throw new Error("Fehler beim PATCH");
    }

    console.log("Todo teilweise aktualisiert");

    await manager.loadTodos();
    manager.render();

  } catch (error) {
    console.error("Fehler:", error);
    throw error;
  }
}


async function deleteTodo(id: string): Promise<void> {

  const response = await fetch(
      "http://localhost:8081/api/todos/" + id,
      {
        method: "DELETE"
      }
  );

  if (!response.ok) {
    throw new Error("Fehler beim Löschen des Todos");
  }

  console.log("Todo erfolgreich gelöscht!");
}

async function init(){
  await manager.loadTodos();

// Oberfläche aktualisieren
  manager.render();
}

init()

