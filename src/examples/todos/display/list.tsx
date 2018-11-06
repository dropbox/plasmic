import * as React from "react";
import { reactLayer, Layer } from "../../../core";
import { TodosFeature } from "../types";
import { Checkbox } from "./checkbox";
import { DeleteButton } from "./delete_button";

export type ListScope = {
  todos: TodosFeature;
};

export interface List extends Layer<ListScope> {}

@reactLayer
export class List extends React.Component {
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
