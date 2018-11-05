import * as React from "react";
import { ReactLayer } from "../../../core";
import { TodoScope, Id } from "../types";

export class DeleteButton extends ReactLayer<TodoScope, { id: Id }> {
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
