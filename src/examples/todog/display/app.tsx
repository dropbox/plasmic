import * as React from "react";
import { ContainerLayer } from "../../../core/container_layer";
import {
  DogApiScope,
  dogapiStrings,
  Dog,
  api,
  DogFeature,
  ApiFeature
} from "../../dog_api/types";
import { DogLayer } from "../../dog_api/logic/dog";
import { ApiLayer } from "../../dog_api/logic/api";
import { FilterLayer } from "../../todos/logic/filter";
import { ListLayer } from "../../todos/logic/list";
import { IdLayer } from "../../todos/logic/id";
import { AutocompleteLayer } from "../../dog_api/logic/autocomplete";
import {
  TodoScope,
  todoStrings,
  Todo,
  todos,
  TodoFeature
} from "../../todos/types";
import { List } from "../../todos/display/list";
import { Filter } from "../../todos/display/filters";
import { TodogInput } from "./todog_input";
import { DogPic } from "../../dog_api/display/dog_pic";
import { Layer } from "../../../core/layer";

export type TodogAppScope = {
  todos: TodoFeature<Dog>;
  dog: DogFeature;
  api: ApiFeature;
};

export class TodogApp extends ContainerLayer<TodogAppScope> {
  readonly strings = {
    ...dogapiStrings,
    ...todoStrings
  };

  readonly defaultStatus = {
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

  readonly logic = [
    new DogLayer(),
    new ApiLayer(),
    new FilterLayer(),
    new ListLayer(),
    new IdLayer()
  ] as Layer<Partial<TodogAppScope>>[];

  componentDidMount() {
    this.actions.api.getDogList();
  }

  @todos.provides.renderTodo()
  renderTodo(todo: Todo<Dog>) {
    return (
      <React.Fragment>
        <DogPic dog={todo.data} />
        {todo.label}
      </React.Fragment>
    );
  }

  display() {
    return (
      <React.Fragment>
        <TodogInput />
        <List />
        <Filter />
      </React.Fragment>
    );
  }
}
