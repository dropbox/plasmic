import * as React from "react";
import { ReactLayer } from "../../../core";
import { TodoScope, Completed, Id } from "../types";

export class Checkbox extends ReactLayer<
  TodoScope,
  { id: Id; completed: Completed }
> {
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
