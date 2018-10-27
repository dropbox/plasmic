import * as React from "react";
import { RenderLayer } from "../core";
import { TodoScope, Id } from "../types";

export class DeleteButton extends RenderLayer<TodoScope, { id: Id }> {
  onClick = () => {
    this.triggers.todos.deleteTodo(this.props.id);
  };
  render() {
    return (
      <button type="button" onClick={this.onClick}>
        Delete
      </button>
    );
  }
}
