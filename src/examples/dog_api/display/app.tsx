import * as React from "react";
import { ContainerLayer } from "../../../core/container_layer";
import { Status } from "../../../core/types";
import { LogicLayer } from "../../../core/logic_layer";
import { DogApiScope, dogapiStrings, Dog } from "../types";
import { DogLayer } from "../logic/dog";
import { ApiLayer } from "../logic/api";
import { AutocompleteLayer } from "../logic/autocomplete";
import { Autocomplete } from "./autocomplete";

const status: Status<DogApiScope> = {
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

const logicLayers: LogicLayer<DogApiScope>[] = [
  new DogLayer(),
  new ApiLayer(),
  new AutocompleteLayer()
];

export class App extends React.Component {
  render() {
    return (
      <ContainerLayer
        status={status}
        logicLayers={logicLayers}
        scopeStrings={dogapiStrings}
      >
        <Autocomplete />
      </ContainerLayer>
    );
  }
}
