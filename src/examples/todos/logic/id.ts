import { todos, TodosScope } from "../types";
import { Layer } from "../../../core";

export type IdLayerScope<Data> = TodosScope<Data>;

export class IdLayer<Data = {}> extends Layer<IdLayerScope<Data>> {
  @todos.on.addTodo.update.nextId
  updateOnAddTodo(nextId: number) {
    return nextId + 1;
  }
}
