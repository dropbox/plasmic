import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { TodoScope, Completed, Id } from "../types";

export class Checkbox extends DisplayLayer<
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
