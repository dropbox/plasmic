import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { TodoScope, Todo } from "../types";
import { Checkbox } from "./checkbox";
import { DeleteButton } from "./delete_button";

export type ListProps = {
  renderTodo?: (todo: Todo) => JSX.Element | string;
};

export class List extends DisplayLayer<TodoScope, ListProps> {
  render() {
    const { renderTodo = (todo: Todo) => todo.label } = this.props;
    return (
      <ul>
        {this.status.todos.filteredTodos.map(todo => (
          <li>
            <Checkbox id={todo.id} completed={todo.completed} />
            {renderTodo(todo)}
            <DeleteButton id={todo.id} />
          </li>
        ))}
      </ul>
    );
  }
}
