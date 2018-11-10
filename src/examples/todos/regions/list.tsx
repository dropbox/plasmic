import * as React from "react";
import { region, Layer } from "../../../core";
import { TodosScope } from "../types";
import { Checkbox } from "./checkbox";
import { DeleteButton } from "./delete_button";
import { PriorityCounter } from "./priority_counter";

export type ListScope = TodosScope;

export interface List extends Layer<ListScope> {}

@region
export class List extends React.Component {
  render() {
    return (
      <ul>
        {this.status.todos.filteredTodos.map(todo => (
          <li key={todo.id}>
            <Checkbox id={todo.id} completed={todo.completed} />
            <PriorityCounter id={todo.id} step={1} priority={todo.priority} />
            {this.utilities.todos.renderTodo(todo)}
            <DeleteButton id={todo.id} />
          </li>
        ))}
      </ul>
    );
  }
}
