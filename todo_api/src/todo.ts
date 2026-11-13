
export type TodoPriority = "hoch" | "mittel" | "niedrig";
export type TodoStatus = "offen" | "erledigt" | "in Bearbeitung";


export interface Todo {
    id: string;
    title: string;
    description: string;
    priority: TodoPriority;
    status: TodoStatus;
    createdAt: string;
    dueDate?: string;
}

export interface TodoInput{

    title: string;
    description: string;

    priority: TodoPriority;

    dueDate?: string;
}

export interface Todoupdate {
    title: string;
    description: string;
    status: TodoStatus;
    priority: TodoPriority;
    dueDate?: string;
}

export type TodoUpdateInput = {
    title?: string | undefined;
    description?: string | undefined;
    priority?: TodoPriority | undefined;
    status?: TodoStatus | undefined;
    dueDate?: string | undefined;
}





