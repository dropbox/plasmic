import * as React from "react";
import { RenderLayer } from "../core";
import { TodoScope } from "../types";
import { TodoCheckbox } from "./Checkbox";
import { TodoDeleteButton } from "./DeleteButton";

export class TodoList extends RenderLayer<TodoScope> {
  render() {
    return (
      <ul>
        {this.status.todos.filteredTodos.map(todo => (
          <li>
            <TodoCheckbox id={todo.id} completed={todo.completed} />
            {todo.label}
            <TodoDeleteButton id={todo.id} />
          </li>
        ))}
      </ul>
    );
  }
}
