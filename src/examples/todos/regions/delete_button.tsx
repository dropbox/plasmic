import * as React from "react";
import { Layer, region } from "../../../core";
import { Id, TodosScope } from "../types";

export type DeleteButtonScope = TodosScope;

export type DeleteButtonProps = { id: Id };

export interface DeleteButton extends Layer<DeleteButtonScope> {}

@region
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
