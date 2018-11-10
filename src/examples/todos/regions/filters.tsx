import * as React from "react";
import { Layer, region } from "../../../core";
import { TodosScope } from "../types";

export type FilterScope = TodosScope;

export interface Filter extends Layer<FilterScope> {}

@region
export class Filter extends React.Component {
  static statuses = {
    OFF: "Off",
    COMPLETE: "Complete",
    INCOMPLETE: "Incomplete"
  };

  onSubmit = e => {
    e.preventDefault();
  };

  onChange = e => {
    const trigger = this.actions.todos.updateFilter;

    switch (e.target.value) {
      case Filter.statuses.INCOMPLETE:
        trigger(false);
        break;
      case Filter.statuses.COMPLETE:
        trigger(true);
        break;
      case Filter.statuses.OFF:
        trigger(null);
        break;
    }
  };

  makeInput(value, checked) {
    return (
      <React.Fragment>
        <label>{value}</label>
        <input
          type="radio"
          name="filterInput"
          value={value}
          checked={checked}
          onChange={() => {}}
        />
      </React.Fragment>
    );
  }

  render() {
    const filter = this.status.todos.currentFilter;

    return (
      <form onSubmit={this.onSubmit} onChange={this.onChange}>
        {this.makeInput(Filter.statuses.INCOMPLETE, filter === false)}
        {this.makeInput(Filter.statuses.COMPLETE, filter === true)}
        {this.makeInput(Filter.statuses.OFF, filter === null)}
        <span>
          {`(Showing ${this.status.todos.filteredTodos.length}
          /
          ${this.status.todos.allTodos.length})`}
        </span>
      </form>
    );
  }
}
