import * as React from "react";
import { ReactLayer } from "../../../core";
import { TodoFeature } from "../types";

export type InputScope = {
  todos: TodoFeature;
};

export class Input extends ReactLayer<InputScope> {
  onSubmit = e => {
    this.actions.todos.addTodo(e.target.todoLabel.value);
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
