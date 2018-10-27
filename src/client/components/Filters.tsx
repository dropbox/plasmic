import * as React from "react";
import { RenderLayer } from "../core";
import { TodoScope } from "../types";

export class Filter extends RenderLayer<TodoScope> {
  onSubmit = e => {
    e.preventDefault();
  };
  onChange = e => {
    const trigger = this.triggers.todos.updateFilter;

    switch (e.target.value) {
      case "off":
        trigger(null);
        break;
      case "completed":
        trigger(true);
        break;
      case "incomplete":
        trigger(false);
        break;
    }
  };
  render() {
    const filter = this.status.todos.currentFilter;
    return (
      <form onSubmit={this.onSubmit} onChange={this.onChange}>
        <label>Incomplete</label>
        <input
          type="radio"
          name="filterInput"
          value="incomplete"
          checked={filter === false}
        />
        <label>Completed</label>
        <input
          type="radio"
          name="filterInput"
          value="completed"
          checked={filter === true}
        />
        <label>Off</label>
        <input
          type="radio"
          name="filterInput"
          value="off"
          checked={filter === null}
        />
      </form>
    );
  }
}
