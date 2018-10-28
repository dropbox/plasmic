import * as React from "react";
import {
  StatusContainer,
  Logic,
  CompleteLogic,
  extractLogic,
  LayerContext,
  Layer
} from "../core";
import { TodoScope, TodoStrings } from "../types";
import { Input } from "./Input";
import { List } from "./List";
import { Filter } from "./Filters";
import { FilterLayer } from "../logic/Filter";
import { ListLayer } from "../logic/List";
import { IdLayer } from "../logic/Id";

export class App extends React.Component implements Layer<TodoScope> {
  private container: StatusContainer<TodoScope>;
  private logic: Logic<TodoScope>;

  get status() {
    return this.container.getStatus();
  }

  get triggers() {
    return this.container.getTriggers(this.logic);
  }

  constructor(props) {
    super(props);

    this.container = new StatusContainer(TodoStrings, {
      todos: {
        allTodos: [],
        filteredTodos: [],
        currentFilter: false,
        nextId: 0
      }
    });

    this.container.subscribe(() => {
      this.forceUpdate();
    });

    this.logic = new CompleteLogic(
      TodoStrings,
      extractLogic([new FilterLayer(), new ListLayer(), new IdLayer()], this)
    );
  }

  render() {
    return (
      <LayerContext.Provider
        value={{
          container: this.container,
          logic: this.logic
        }}
      >
        <Input />
        <List />
        <Filter />
      </LayerContext.Provider>
    );
  }
}
