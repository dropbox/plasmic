import * as React from "react";
import { RenderLayer } from "../core/render_layer";
import { TodoScope } from "../types";
import { Checkbox } from "./checkbox";
import { DeleteButton } from "./delete_button";

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
