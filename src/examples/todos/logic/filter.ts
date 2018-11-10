import { todos, Filter, Completed, TodosScope } from "../types";
import { Layer } from "../../../core";

export type FilterLayerScope<Data> = TodosScope<Data>;

export class FilterLayer<Data = {}> extends Layer<FilterLayerScope<Data>> {
  @todos.on.updateFilter.update.currentFilter
  updateOnUpdateFilter(current: Filter, next: Filter) {
    if (current !== next) {
      return next;
    }
  }

  @todos.observe
  triggerRefilter(previous: TodosScope["todos"]["status"]) {
    if (
      previous.allTodos !== this.status.todos.allTodos ||
      previous.currentFilter !== this.status.todos.currentFilter
    ) {
      this.actions.todos.refilter();
    }
  }

  @todos.on.refilter.update.filteredTodos
  updateFilteredOnChange() {
    const filter = this.status.todos.currentFilter;
    return this.filterTodos(filter);
  }

  filterTodos(filter: Completed | null) {
    let filtered = this.status.todos.allTodos;

    if (filter !== null) {
      filtered = filtered.filter(todo => todo.completed === filter);
    }

    return filtered.sort((a, b) => b.priority - a.priority);
  }
}
