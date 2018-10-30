import * as React from "react";
import { ComponentLayer } from "../../../core/component_layer";
import { TodoScope, Completed, Id } from "../types";

export class Checkbox extends ComponentLayer<
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
