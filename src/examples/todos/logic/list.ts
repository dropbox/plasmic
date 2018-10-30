import { LogicLayer } from "../../../core/logic_layer";
import {
  TodoScope,
  todos,
  Todo,
  Label,
  Id,
  TodoFeature,
  Completed
} from "../types";

export class ListLayer extends LogicLayer<TodoScope> {
  @todos.observeOn.addTodo.update.allTodos()
  updateOnAdd(allTodos: Todo[], label: Label) {
    return [
      ...allTodos,
      {
        label,
        id: this.status.todos.nextId,
        completed: false
      }
    ];
  }

  @todos.observeOn.deleteTodo.update.allTodos()
  updateOnDelete(allTodos: Todo[], id: Id) {
    return allTodos.filter(todo => todo.id !== id);
  }

  @todos.observeOn.refilter.update.filteredTodos()
  updateFilteredOnChange() {
    const filter = this.status.todos.currentFilter;
    return this.filterTodos(filter);
  }

  @todos.observeOn.toggleCompleted.update.allTodos()
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
  triggerRefilter(previous: TodoFeature["state"]) {
    if (
      previous.allTodos !== this.status.todos.allTodos ||
      previous.currentFilter !== this.status.todos.currentFilter
    ) {
      this.triggers.todos.refilter();
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
