import * as React from "react";
import { RenderLayer } from "../core";
import { TodoScope } from "../types";
import { Checkbox } from "./Checkbox";
import { DeleteButton } from "./DeleteButton";

export class List extends RenderLayer<TodoScope> {
  render() {
    return (
      <ul>
        {this.status.todos.filteredTodos.map(todo => (
          <li>
            <Checkbox id={todo.id} completed={todo.completed} />
            {todo.label}
            <DeleteButton id={todo.id} />
          </li>
        ))}
      </ul>
    );
  }
}
