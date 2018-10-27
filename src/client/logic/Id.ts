import { LogicLayer } from "../core";
import { TodoScope, todos } from "../types";

export class IdLayer extends LogicLayer<TodoScope> {
  @todos.on.addTodo.update.nextId()
  updateOnAddTodo(nextId: number) {
    return nextId + 1;
  }
}
