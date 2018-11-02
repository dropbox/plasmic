import * as React from "react";
import { ContainerLayer } from "../../../core/container_layer";
import { Status } from "../../../core/types";
import { LogicLayer } from "../../../core/logic_layer";
import { DogApiScope, dogapiStrings } from "../types";
import { DogLayer } from "../logic/dog";
import { ApiLayer } from "../logic/api";
import { DogPic } from "./dog_pic";
import { DogSelector } from "./dog_selector";

const status: Status<DogApiScope> = {
  dog: {
    currentDog: null,
    dogList: null
  },
  api: {
    error: null,
    loading: false
  }
};

const logicLayers: LogicLayer<DogApiScope>[] = [new DogLayer(), new ApiLayer()];

export class App extends React.Component {
  render() {
    return (
      <ContainerLayer
        status={status}
        logicLayers={logicLayers}
        scopeStrings={dogapiStrings}
      >
        <DogSelector />
        <DogPic />
      </ContainerLayer>
    );
  }
}
