import * as React from "react";
import { ComponentLayer } from "../../../core/component_layer";
import { TodoScope, Id } from "../types";

export class DeleteButton extends ComponentLayer<TodoScope, { id: Id }> {
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
