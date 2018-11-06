import * as React from "react";
import { reactContainerLayer, Layer } from "../../../core";
import { Dog, DogFeature, ApiFeature } from "../../dog_api/types";
import { DogLayer } from "../../dog_api/logic/dog";
import { ApiLayer } from "../../dog_api/logic/api";
import { FilterLayer } from "../../todos/logic/filter";
import { ListLayer } from "../../todos/logic/list";
import { IdLayer } from "../../todos/logic/id";
import { Todo, todos, TodosFeature } from "../../todos/types";
import { List } from "../../todos/display/list";
import { Filter } from "../../todos/display/filters";
import { CurrentDogPic } from "../../dog_api/layers/current_dog_pic";
import { ApiLoadingIndicator } from "../../dog_api/layers/api_loading_indicator";
import { DogApiAutocomplete } from "../../dog_api/layers/dog_api_autocomplete";
import { DogPic } from "../../dog_api/components/dog_pic";

export type TodogAppScope = {
  todos: TodosFeature<Dog>;
  dog: DogFeature;
  api: ApiFeature;
};

export interface TodogApp extends Layer<TodogAppScope> {}

@reactContainerLayer
export class TodogApp extends React.Component {
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
    }
  };

  layers = [
    new DogLayer(),
    new ApiLayer(),
    new FilterLayer(),
    new ListLayer(),
    new IdLayer()
  ] as Layer<Partial<TodogAppScope>>[];

  componentDidMount() {
    this.actions.api.getDogList();
  }

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
    return (
      <React.Fragment>
        <form onSubmit={this.onSubmit}>
          <DogApiAutocomplete />
          <button type="submit">Add</button>
          <CurrentDogPic />
          <ApiLoadingIndicator />
        </form>

        <List />
        <Filter />
      </React.Fragment>
    );
  }
}
