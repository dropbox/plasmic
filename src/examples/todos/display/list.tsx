import * as React from "react";
import { ReactLayer } from "../../../core";
import { Todo, TodosFeature } from "../types";
import { Checkbox } from "./checkbox";
import { DeleteButton } from "./delete_button";

export type ListScope = {
  todos: TodosFeature;
};

export class List extends ReactLayer<ListScope> {
  render() {
    return (
      <ul>
        {this.status.todos.filteredTodos.map(todo => (
          <li>
            <Checkbox id={todo.id} completed={todo.completed} />
            {this.utilities.todos.renderTodo(todo)}
            <DeleteButton id={todo.id} />
          </li>
        ))}
      </ul>
    );
  }
}
