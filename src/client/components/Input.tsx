import * as React from "react";
import { RenderLayer } from "../core";
import { TodoScope } from "../types";

export class TodoInput extends RenderLayer<TodoScope> {
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
