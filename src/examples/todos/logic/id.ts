import { TodoScope, todos } from "../types";
import { Layer } from "../../../core/layer";

export class IdLayer<Data = {}> extends Layer<TodoScope<Data>> {
  @todos.on.addTodo.update.nextId()
  updateOnAddTodo(nextId: number) {
    return nextId + 1;
  }
}
