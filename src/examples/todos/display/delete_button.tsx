import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { TodoScope, Id } from "../types";

export class DeleteButton extends DisplayLayer<TodoScope, { id: Id }> {
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
