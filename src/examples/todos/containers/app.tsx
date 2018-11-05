import * as React from "react";
import { todoStrings, TodoScope, todos, Todo } from "../types";
import { Input } from "../display/input";
import { List } from "../display/list";
import { Filter } from "../display/filters";
import { FilterLayer } from "../logic/filter";
import { ListLayer } from "../logic/list";
import { IdLayer } from "../logic/id";
import { ReactContainerLayer } from "../../../core";

export class TodoApp extends ReactContainerLayer<TodoScope> {
  strings = todoStrings;

  defaultStatus = {
    todos: {
      allTodos: [],
      filteredTodos: [],
      currentFilter: false,
      nextId: 0
    }
  };

  logic = [new FilterLayer(), new ListLayer(), new IdLayer()];

  @todos.provides.renderTodo()
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
