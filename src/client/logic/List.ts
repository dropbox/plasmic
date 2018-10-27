import { LogicLayer } from "../core/logic_layer";
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
  @todos.on.addTodo.update.allTodos()
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

  @todos()
  triggerRefilter(previous: TodoFeature["state"]) {
    if (
      previous.allTodos !== this.status.todos.allTodos ||
      previous.currentFilter !== this.status.todos.currentFilter
    ) {
      this.triggers.todos.refilter(null);
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
