import * as React from "react";
import { ReactLayer } from "../../../core";
import { Id, TodoFeature } from "../types";

export type DeleteButtonScope = {
  todos: TodoFeature;
};

export type DeleteButtonProps = { id: Id };

export class DeleteButton extends ReactLayer<
  DeleteButtonScope,
  DeleteButtonProps
> {
  onClick = () => {
    this.actions.todos.deleteTodo(this.props.id);
  };
  render() {
    return (
      <button type="button" onClick={this.onClick}>
        Delete
      </button>
    );
  }
}
