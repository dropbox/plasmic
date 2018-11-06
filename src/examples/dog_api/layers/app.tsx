import * as React from "react";
import { composeContainerLayer } from "../../../core/react_container_layer";
import { DogFeature, ApiFeature } from "../types";
import { DogApiAutocomplete } from "./dog_api_autocomplete";
import { CurrentDogPic } from "./current_dog_pic";
import { DogLayer } from "../logic/dog";
import { ApiLayer } from "../logic/api";
import { Status } from "../../../core/types";
import { ApiErrorMessage } from "./api_error_message";
import { LoadingIndicator } from "../components/loading_indicator";
import { ApiLoadingIndicator } from "./api_loading_indicator";

export type DogApiAppScope = {
  dog: DogFeature;
  api: ApiFeature;
};

export const defaultStatus: Status<DogApiAppScope> = {
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

export const DogApiApp = composeContainerLayer<DogApiAppScope>(
  () => (
    <React.Fragment>
      <ApiErrorMessage />
      <DogApiAutocomplete />
      <CurrentDogPic />
      <ApiLoadingIndicator />
    </React.Fragment>
  ),
  [new DogLayer(), new ApiLayer()],
  defaultStatus
);
