import * as React from "react";
import { ReactLayer } from "../../../core";
import { Completed, Id, TodoFeature } from "../types";

export type CheckboxScope = {
  todos: TodoFeature;
};

export type CheckboxProps = { id: Id; completed: Completed };

export class Checkbox extends ReactLayer<CheckboxScope, CheckboxProps> {
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
