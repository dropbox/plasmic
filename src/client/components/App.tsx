import * as React from "react";
import { TodoScope, TodoStrings } from "../types";
import { Input } from "./input";
import { List } from "./list";
import { Filter } from "./filters";
import { FilterLayer } from "../logic/filter";
import { ListLayer } from "../logic/list";
import { IdLayer } from "../logic/id";
import { Layer } from "../core/layer";
import { StatusContainer } from "../core/status_container";
import { Logic } from "../core/types";
import { CompleteLogic } from "../core/complete_logic";
import { extractLogic } from "../core/logic_layer";
import { LayerContext } from "../core/render_layer";

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

    this.container = new StatusContainer<TodoScope>(TodoStrings, {
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

    this.logic = new CompleteLogic<TodoScope>(
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
