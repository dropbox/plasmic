import * as React from "react";
import { ReactLayer } from "../../../core";
import { TodosFeature } from "../types";

export type InputScope = {
  todos: TodosFeature;
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
