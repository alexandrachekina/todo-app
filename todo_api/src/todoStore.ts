import { randomUUID } from "node:crypto";
import { Todo, TodoInput, TodoUpdateInput } from "./todo";

const todos: Todo[] = [];

export function createTodo(input: TodoInput): Todo {

    const todo: Todo = {
        id: randomUUID(),
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: "offen",
        createdAt: new Date().toISOString(),
        dueDate: input.dueDate
    };

    todos.push(todo);
    return todo;
}
export function getAllTodos(): Todo[] {
    return [...todos];
}

export function findNachID(id: string): Todo | undefined{

    for(const todo of todos) {
        if(todo.id === id){
            return todo;
        }
    }

}


export function updateTodo(id: string, todo: Todo): Todo | undefined {
    const altesTodo = findNachID(id);

    if (!altesTodo) {
        return undefined;
    }

    altesTodo.title = todo.title;
    altesTodo.description = todo.description;
    altesTodo.priority = todo.priority;
    altesTodo.status = todo.status;

    if (todo.dueDate !== undefined) {
        altesTodo.dueDate = todo.dueDate;
    } else {
        delete altesTodo.dueDate;
    }

    return altesTodo;
}



export function patchTodo(
    id: string,
    input: TodoUpdateInput
    ): Todo | undefined {

    const todo = findNachID(id);

    if (!todo) {
        return undefined;
    }

    if (input.title !== undefined) {
        todo.title = input.title;
    }

    if (input.description !== undefined) {
        todo.description = input.description;
    }

    if (input.priority !== undefined) {
        todo.priority = input.priority;
    }

    if (input.status !== undefined) {
        todo.status = input.status;
    }

    if (input.dueDate === null) {
        delete todo.dueDate;
    } else if (input.dueDate !== undefined) {
        todo.dueDate = input.dueDate;
    }

    return todo;
}

export function deleteTodo(id: string): boolean {
    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
        return false;
    }

    todos.splice(index, 1);

    return true;
}

