import * as React from "react";
import { Layer, reactLayer } from "../../../core";
import { Completed, Id, TodosFeature } from "../types";

export type CheckboxScope = {
  todos: TodosFeature;
};

export type CheckboxProps = { id: Id; completed: Completed };

export interface Checkbox extends Layer<CheckboxScope> {}

@reactLayer
export class Checkbox extends React.Component<CheckboxProps> {
  onChange = () => {
    this.actions.todos.toggleCompleted(this.props.id);
  };
  render() {
    const { completed } = this.props;
    return (
      <input type="checkbox" checked={completed} onChange={this.onChange} />
    );
  }
}
