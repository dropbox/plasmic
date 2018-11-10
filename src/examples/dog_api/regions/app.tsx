import * as React from "react";
import { composeContainerRegion } from "../../../core";
import { DogScope, ApiScope } from "../types";
import { DogApiAutocomplete } from "./dog_api_autocomplete";
import { CurrentDogPic } from "./current_dog_pic";
import { DogLayer } from "../logic/dog";
import { ApiLayer } from "../logic/api";
import { Status } from "../../../core/types";
import { ApiErrorMessage } from "./api_error_message";
import { ApiLoadingIndicator } from "./api_loading_indicator";

export type DogApiAppScope = DogScope & ApiScope;

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

export const DogApiApp = composeContainerRegion({
  display: () => (
    <React.Fragment>
      <ApiErrorMessage />
      <DogApiAutocomplete />
      <CurrentDogPic />
      <ApiLoadingIndicator />
    </React.Fragment>
  ),
  layers: [new DogLayer(), new ApiLayer()],
  defaultStatus
});
