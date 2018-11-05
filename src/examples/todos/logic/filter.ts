import { TodoScope, todos, Completed, Todo } from "../types";
import { Layer } from "../../../core";

export class FilterLayer<Data = {}> extends Layer<TodoScope<Data>> {
  @todos.on.updateFilter.update.currentFilter()
  updateOnUpdateFilter(current: Completed | null, next: Completed | null) {
    if (current !== next) {
      return next;
    }
  }
}
