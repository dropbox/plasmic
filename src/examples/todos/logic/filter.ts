import { LogicLayer } from "../../../core/logic_layer";
import { TodoScope, todos, Completed, Todo } from "../types";
import { PartialReducers } from "../../../core/types";

export class FilterLayer extends LogicLayer<TodoScope> {
  @todos.on.updateFilter.update.currentFilter()
  updateOnUpdateFilter(current: Completed | null, next: Completed | null) {
    if (current !== next) {
      return next;
    }
  }
}
