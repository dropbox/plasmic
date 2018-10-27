import * as React from "react";
import { RenderLayer } from "../core";
import { TodoScope, Completed, Id } from "../types";

export class TodoCheckbox extends RenderLayer<
  TodoScope,
  { id: Id; completed: Completed }
> {
  onChange = () => {
    this.triggers.todos.toggleCompleted(this.props.id);
  };
  render() {
    const { completed } = this.props;
    return (
      <input type="checkbox" checked={completed} onChange={this.onChange} />
    );
  }
}
