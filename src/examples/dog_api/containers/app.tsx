import * as React from "react";
import { ReactContainerLayer } from "../../../core";
import { DogFeature, ApiFeature, dogStrings, apiStrings } from "../types";
import { DogLayer } from "../logic/dog";
import { ApiLayer } from "../logic/api";
import { DogPic } from "../display/dog_pic";
import { DogAutocomplete } from "./dog_autocomplete";
import { LoadingIndicator } from "../display/loading_indicator";

export type DogApiAppScope = {
  dog: DogFeature;
  api: ApiFeature;
};

export class DogApiApp extends ReactContainerLayer<DogApiAppScope> {
  strings = {
    dog: dogStrings,
    api: apiStrings
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
    const { loading } = this.status.api;

    return (
      <React.Fragment>
        <DogAutocomplete />
        <div>
          {loading ? <LoadingIndicator /> : <DogPic dog={currentDog} />}
        </div>
      </React.Fragment>
    );
  }
}
