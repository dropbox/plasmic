import * as React from "react";
import { Layer, reactLayer } from "../../../core";
import { Id, TodosFeature } from "../types";

export type DeleteButtonScope = {
  todos: TodosFeature;
};

export type DeleteButtonProps = { id: Id };

export interface DeleteButton extends Layer<DeleteButtonScope> {}

@reactLayer
export class DeleteButton extends React.Component<DeleteButtonProps> {
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
