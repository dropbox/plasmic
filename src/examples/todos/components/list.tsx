import * as React from "react";
import { ComponentLayer } from "../../../core/component_layer";
import { TodoScope } from "../types";
import { Checkbox } from "./checkbox";
import { DeleteButton } from "./delete_button";

export class List extends ComponentLayer<TodoScope> {
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
