import * as React from "react";
import { Layer, reactLayer } from "../../../core";
import { TodosFeature } from "../types";

export type InputScope = {
  todos: TodosFeature;
};

export interface Input extends Layer<InputScope> {}

@reactLayer
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
