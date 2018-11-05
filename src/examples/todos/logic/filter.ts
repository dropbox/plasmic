import { todos, Completed, Todo, TodoFeature } from "../types";
import { Layer } from "../../../core";

export type FilterLayerScope<Data> = {
  todos: TodoFeature<Data>;
};
export class FilterLayer<Data = {}> extends Layer<FilterLayerScope<Data>> {
  @todos.on.updateFilter.update.currentFilter()
  updateOnUpdateFilter(current: Completed | null, next: Completed | null) {
    if (current !== next) {
      return next;
    }
  }
}
