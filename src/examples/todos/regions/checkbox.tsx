import * as React from "react";
import { Layer, region } from "../../../core";
import { Completed, Id, TodosScope } from "../types";

export type CheckboxScope = TodosScope;

export type CheckboxProps = { id: Id; completed: Completed };

export interface Checkbox extends Layer<CheckboxScope> {}

@region
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
