import * as React from "react";
import { TodoStrings, TodoScope } from "../types";
import { Input } from "./input";
import { List } from "./list";
import { Filter } from "./filters";
import { FilterLayer } from "../logic/filter";
import { ListLayer } from "../logic/list";
import { IdLayer } from "../logic/id";
import { ContainerLayer } from "../../../core/container_layer";
import { Status } from "../../../core/types";
import { LogicLayer } from "../../../core/logic_layer";

const status: Status<TodoScope> = {
  todos: {
    allTodos: [],
    filteredTodos: [],
    currentFilter: false,
    nextId: 0
  }
};

const logicLayers: LogicLayer<TodoScope>[] = [
  new FilterLayer(),
  new ListLayer(),
  new IdLayer()
];

export class App extends React.Component {
  render() {
    return (
      <ContainerLayer
        status={status}
        logicLayers={logicLayers}
        scopeStrings={TodoStrings}
      >
        <Input />
        <List />
        <Filter />
      </ContainerLayer>
    );
  }
}
