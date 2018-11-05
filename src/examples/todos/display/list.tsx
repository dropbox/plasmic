import * as React from "react";
import { ReactLayer } from "../../../core";
import { TodoScope, Todo } from "../types";
import { Checkbox } from "./checkbox";
import { DeleteButton } from "./delete_button";

export class List extends ReactLayer<TodoScope> {
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
