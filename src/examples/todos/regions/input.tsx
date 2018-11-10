import * as React from "react";
import { Layer, region } from "../../../core";
import { TodosScope } from "../types";

export type InputScope = TodosScope;

export interface Input extends Layer<InputScope> {}

@region
export class Input extends React.Component {
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
