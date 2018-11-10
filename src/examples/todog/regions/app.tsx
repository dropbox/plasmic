import * as React from "react";
import { containerRegion, Layer, ContainerOptions } from "../../../core";
import { Dog, ApiScope, DogScope } from "../../dog_api/types";
import { DogLayer } from "../../dog_api/logic/dog";
import { ApiLayer } from "../../dog_api/logic/api";
import { FilterLayer } from "../../todos/logic/filter";
import { ListLayer } from "../../todos/logic/list";
import { IdLayer } from "../../todos/logic/id";
import { Todo, todos, TodosScope } from "../../todos/types";
import { List } from "../../todos/regions/list";
import { Filter } from "../../todos/regions/filters";
import { CurrentDogPic } from "../../dog_api/regions/current_dog_pic";
import { ApiLoadingIndicator } from "../../dog_api/regions/api_loading_indicator";
import { ApiErrorMessage } from "../../dog_api/regions/api_error_message";
import { DogApiAutocomplete } from "../../dog_api/regions/dog_api_autocomplete";
import { DogPic } from "../../dog_api/components/dog_pic";
import {
  LoggingScope,
  CounterActionLayer,
  CounterObserverLayer,
  LogButton,
  LogStatusLayer,
  ConsoleLogLayer
} from "../../counter/app";

export type TodogAppScope = LoggingScope &
  ApiScope &
  DogScope &
  TodosScope<Dog>;

export interface TodogApp extends Layer<TodogAppScope> {}

@containerRegion
export class TodogApp extends React.Component
  implements ContainerOptions<TodogAppScope> {
  defaultStatus = {
    todos: {
      allTodos: [],
      filteredTodos: [],
      currentFilter: false,
      nextId: 0
    },
    dog: {
      currentDog: null,
      dogList: null,
      dogTypes: []
    },
    api: {
      error: null,
      loading: false
    },
    logging: {
      isOn: true
    }
  };

  layers = [
    new DogLayer(),
    new ApiLayer(),
    new FilterLayer<Dog>(),
    new ListLayer<Dog>(),
    new IdLayer<Dog>(),
    new LogStatusLayer(),
    new ConsoleLogLayer(),
    new CounterActionLayer(),
    new CounterObserverLayer()
  ];

  onSubmit = e => {
    const { currentDog } = this.status.dog;
    if (currentDog !== null) {
      this.actions.todos.addTodo(currentDog.dogType, currentDog);
    }
    e.preventDefault();
  };

  @todos.provide.renderTodo
  renderTodo(todo: Todo<Dog>) {
    return (
      <React.Fragment>
        <DogPic dog={todo.data} />
        {todo.label}
      </React.Fragment>
    );
  }

  render() {
    const { currentDog } = this.status.dog;
    return (
      <React.Fragment>
        <ApiErrorMessage />
        <form onSubmit={this.onSubmit}>
          <DogApiAutocomplete />
          <button disabled={!currentDog} type="submit">
            Add
          </button>
          <CurrentDogPic />
          <ApiLoadingIndicator />
        </form>

        <List />
        <Filter />
        <LogButton />
      </React.Fragment>
    );
  }
}
