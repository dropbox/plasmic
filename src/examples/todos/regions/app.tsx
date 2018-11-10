import * as React from "react";
import { todos, Todo, TodosScope } from "../types";
import { Input } from "./input";
import { List } from "./list";
import { Filter } from "./filters";
import { FilterLayer } from "../logic/filter";
import { ListLayer } from "../logic/list";
import { IdLayer } from "../logic/id";
import { containerRegion, ContainerOptions } from "../../../core";
import { Layer } from "../../../core/layer";
import {
  LoggingScope,
  CounterObserverLayer,
  CounterActionLayer,
  LogButton,
  LogStatusLayer,
  ConsoleLogLayer
} from "../../counter/app";

export type TodoAppScope = LoggingScope & TodosScope;

export interface TodoApp extends Layer<TodoAppScope> {}

@containerRegion
export class TodoApp extends React.Component
  implements ContainerOptions<TodoAppScope> {
  defaultStatus = {
    todos: {
      allTodos: [],
      filteredTodos: [],
      currentFilter: false,
      nextId: 0
    },
    logging: {
      isOn: true
    }
  };

  layers = [
    new FilterLayer(),
    new ListLayer(),
    new IdLayer(),
    new LogStatusLayer(),
    new ConsoleLogLayer(),
    new CounterActionLayer(),
    new CounterObserverLayer()
  ];

  @todos.provide.renderTodo
  renderTodo(todo: Todo) {
    return todo.label;
  }

  render() {
    return (
      <React.Fragment>
        <Input />
        <List />
        <Filter />
        <LogButton />
      </React.Fragment>
    );
  }
}
