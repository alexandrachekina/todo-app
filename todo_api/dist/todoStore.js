"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodo = createTodo;
exports.getAllTodos = getAllTodos;
exports.findNachID = findNachID;
exports.updateTodo = updateTodo;
exports.patchTodo = patchTodo;
exports.deleteTodo = deleteTodo;
const node_crypto_1 = require("node:crypto");
const todos = [];
function createTodo(input) {
    const todo = {
        id: (0, node_crypto_1.randomUUID)(),
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
function getAllTodos() {
    return [...todos];
}
function findNachID(id) {
    for (const todo of todos) {
        if (todo.id === id) {
            return todo;
        }
    }
}
function updateTodo(id, todo) {
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
    }
    else {
        delete altesTodo.dueDate;
    }
    return altesTodo;
}
function patchTodo(id, input) {
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
    }
    else if (input.dueDate !== undefined) {
        todo.dueDate = input.dueDate;
    }
    return todo;
}
function deleteTodo(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
        return false;
    }
    todos.splice(index, 1);
    return true;
}
