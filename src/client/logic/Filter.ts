import { LogicLayer } from "../core";
import { TodoScope, todos, Completed } from "../types";

export class FilterLayer extends LogicLayer<TodoScope> {
  @todos.on.updateFilter.update.currentFilter()
  updateOnUpdateFilter(current: Completed | null, next: Completed | null) {
    if (current !== next) {
      return next;
    }
  }
}
