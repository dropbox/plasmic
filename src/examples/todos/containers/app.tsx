import * as React from "react";
import { todosStrings, todos, Todo, TodosFeature } from "../types";
import { Input } from "../display/input";
import { List } from "../display/list";
import { Filter } from "../display/filters";
import { FilterLayer } from "../logic/filter";
import { ListLayer } from "../logic/list";
import { IdLayer } from "../logic/id";
import { reactContainerLayer } from "../../../core";
import { Layer } from "../../../core/layer";

export type TodoAppScope = {
  todos: TodosFeature;
};

export interface TodoApp extends Layer<TodoAppScope> {}

@reactContainerLayer
export class TodoApp extends React.Component {
  defaultStatus = {
    todos: {
      allTodos: [],
      filteredTodos: [],
      currentFilter: false,
      nextId: 0
    }
  };

  layers = [new FilterLayer(), new ListLayer(), new IdLayer()];

  @todos.provide.renderTodo
  renderTodo(todo: Todo) {
    return todo.label;
  }

  display() {
    return (
      <React.Fragment>
        <Input />
        <List />
        <Filter />
      </React.Fragment>
    );
  }
}
