import { LogicLayer } from "../../../core/logic_layer";
import { TodoScope, todos } from "../types";

export class IdLayer extends LogicLayer<TodoScope> {
  @todos.on.addTodo.update.nextId()
  updateOnAddTodo(nextId: number) {
    return nextId + 1;
  }
}
