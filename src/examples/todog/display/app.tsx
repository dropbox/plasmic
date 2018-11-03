import * as React from "react";
import { ContainerLayer } from "../../../core/container_layer";
import { Status } from "../../../core/types";
import { LogicLayer } from "../../../core/logic_layer";
import { DogApiScope, dogapiStrings, Dog } from "../../dog_api/types";
import { DogLayer } from "../../dog_api/logic/dog";
import { ApiLayer } from "../../dog_api/logic/api";
import { FilterLayer } from "../../todos/logic/filter";
import { ListLayer } from "../../todos/logic/list";
import { IdLayer } from "../../todos/logic/id";
import { DogPic } from "../../dog_api/display/dog_pic";
import { AutocompleteLayer } from "../../dog_api/logic/autocomplete";
import { Autocomplete } from "../../dog_api/display/autocomplete";
import { TodoScope, todoStrings } from "../../todos/types";
import { TodogLayer } from "../logic/todog";
import { List } from "../../todos/display/list";
import { Filter } from "../../todos/display/filters";

const status: Status<DogApiScope & TodoScope<Dog>> = {
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
  autocomplete: {
    value: "",
    focused: false
  }
};

const logicLayers: LogicLayer<DogApiScope | TodoScope<Dog>>[] = [
  new DogLayer(),
  new ApiLayer(),
  new AutocompleteLayer(),
  new FilterLayer(),
  new ListLayer(),
  new IdLayer(),
  new TodogLayer()
];

export class App extends React.Component {
  render() {
    return (
      <ContainerLayer
        status={status}
        logicLayers={logicLayers}
        scopeStrings={{
          ...dogapiStrings,
          ...todoStrings
        }}
      >
        <Autocomplete />
        <DogPic />
        <List />
        <Filter />
      </ContainerLayer>
    );
  }
}
