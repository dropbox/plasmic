import * as React from "react";
import { ReactContainerLayer } from "../../../core";
import {
  Dog,
  DogFeature,
  ApiFeature,
  dogStrings,
  apiStrings
} from "../../dog_api/types";
import { DogLayer } from "../../dog_api/logic/dog";
import { ApiLayer } from "../../dog_api/logic/api";
import { FilterLayer } from "../../todos/logic/filter";
import { ListLayer } from "../../todos/logic/list";
import { IdLayer } from "../../todos/logic/id";
import { todosStrings, Todo, todos, TodosFeature } from "../../todos/types";
import { List } from "../../todos/display/list";
import { Filter } from "../../todos/display/filters";
import { TodogInput } from "../display/todog_input";
import { DogPic } from "../../dog_api/display/dog_pic";
import { LoadingIndicator } from "../../dog_api/display/loading_indicator";
import { Layer } from "../../../core/layer";

export type TodogAppScope = {
  todos: TodosFeature<Dog>;
  dog: DogFeature;
  api: ApiFeature;
};

export class TodogApp extends ReactContainerLayer<TodogAppScope> {
  readonly strings = {
    dog: dogStrings,
    api: apiStrings,
    todos: todosStrings
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
    const { currentDog } = this.status.dog;
    const { loading } = this.status.api;

    return (
      <React.Fragment>
        <TodogInput />
        {loading ? <LoadingIndicator /> : <DogPic dog={currentDog} />}
        <List />
        <Filter />
      </React.Fragment>
    );
  }
}
