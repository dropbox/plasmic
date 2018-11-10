import { Layer } from "../../../core";
import { todos, Todo, Label, Id, TodosScope } from "../types";

export type ListLayerScope<Data> = TodosScope<Data>;

export class ListLayer<Data = {}> extends Layer<ListLayerScope<Data>> {
  @todos.on.addTodo.update.allTodos
  updateOnAdd(allTodos: Todo[], label: Label, data?: Data) {
    return [
      ...allTodos,
      {
        label,
        id: this.status.todos.nextId,
        priority: 0,
        completed: false,
        data: data || {}
      }
    ];
  }

  @todos.on.deleteTodo.update.allTodos
  updateOnDelete(allTodos: Todo[], id: Id) {
    return allTodos.filter(todo => todo.id !== id);
  }

  @todos.on.prioritize.update.allTodos
  updateOnPrioritize(allTodos: Todo[], id: Id, priority: number) {
    return allTodos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    );
  }

  @todos.on.toggleCompleted.update.allTodos
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
}
