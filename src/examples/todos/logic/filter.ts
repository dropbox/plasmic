import { LogicLayer } from "../../../core/logic_layer";
import { TodoScope, todos, Completed } from "../types";

export class FilterLayer extends LogicLayer<TodoScope> {
  @todos.observeOn.updateFilter.update.currentFilter()
  updateOnUpdateFilter(current: Completed | null, next: Completed | null) {
    if (current !== next) {
      return next;
    }
  }
}
