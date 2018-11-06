import { todos, TodosFeature } from "../types";
import { Layer } from "../../../core";

export type IdLayerScope<Data> = {
  todos: TodosFeature<Data>;
};

export interface IdLayer<Data = {}> extends Layer<IdLayerScope<Data>> {}
export class IdLayer<Data = {}> {
  @todos.on.addTodo.update.nextId
  updateOnAddTodo(nextId: number) {
    return nextId + 1;
  }
}
