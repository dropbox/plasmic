import * as React from "react";
import { ComponentLayer } from "../../../core/component_layer";
import { TodoScope } from "../types";

export class Input extends ComponentLayer<TodoScope> {
  onSubmit = e => {
    this.triggers.todos.addTodo(e.target.todoLabel.value);
    e.preventDefault();
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input name="todoLabel" type="text" />
        <button type="submit">Add</button>
      </form>
    );
  }
}
