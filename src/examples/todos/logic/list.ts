import { Layer } from "../../../core";
import { todos, Todo, Label, Id, TodosFeature, Completed } from "../types";

export type ListLayerScope<Data> = {
  todos: TodosFeature<Data>;
};

export class ListLayer<Data = {}> extends Layer<ListLayerScope<Data>> {
  @todos.on.addTodo.update.allTodos()
  updateOnAdd(allTodos: Todo[], label: Label, data?: Data) {
    return [
      ...allTodos,
      {
        label,
        id: this.status.todos.nextId,
        completed: false,
        data: data || {}
      }
    ];
  }

  @todos.on.deleteTodo.update.allTodos()
  updateOnDelete(allTodos: Todo[], id: Id) {
    return allTodos.filter(todo => todo.id !== id);
  }

  @todos.on.refilter.update.filteredTodos()
  updateFilteredOnChange() {
    const filter = this.status.todos.currentFilter;
    return this.filterTodos(filter);
  }

  @todos.on.toggleCompleted.update.allTodos()
  toggleCompleted(allTodos: Todo[], id: Id) {
    return allTodos.map(todo => {
      if (todo.id !== id) {
        return todo;
      } else {
        return {
          ...todo,
          completed: !todo.completed
        };
      }
    });
  }

  @todos.observe()
  triggerRefilter(previous: TodosFeature["status"]) {
    if (
      previous.allTodos !== this.status.todos.allTodos ||
      previous.currentFilter !== this.status.todos.currentFilter
    ) {
      this.actions.todos.refilter();
    }
  }

  filterTodos(filter: Completed | null) {
    if (filter === null) {
      return this.status.todos.allTodos;
    } else {
      return this.status.todos.allTodos.filter(
        todo => todo.completed === filter
      );
    }
  }
}
