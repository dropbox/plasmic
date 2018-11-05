import * as React from "react";
import { ContainerLayer } from "../../../core/container_layer";
import { DogApiScope, dogapiStrings, DogFeature, ApiFeature } from "../types";
import { DogLayer } from "../logic/dog";
import { ApiLayer } from "../logic/api";
import { DogPic } from "../display/dog_pic";
import { DogAutocomplete } from "./dog_autocomplete";

export type DogApiAppScope = {
  dog: DogFeature;
  api: ApiFeature;
};

export class DogApiApp extends ContainerLayer<DogApiAppScope> {
  strings = {
    dog: dogapiStrings.dog,
    api: dogapiStrings.api
  };

  defaultStatus = {
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

  logic = [new DogLayer(), new ApiLayer()];

  componentDidMount() {
    this.actions.api.getDogList();
  }

  display() {
    const { currentDog } = this.status.dog;

    return (
      <React.Fragment>
        <DogAutocomplete />
        <div>
          <DogPic dog={currentDog} />
        </div>
      </React.Fragment>
    );
  }
}
