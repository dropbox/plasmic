import * as React from "react";
import { composeContainerLayer } from "../../../core/react_container_layer";
import { ApiFeature, DogFeature, AutocompleteFeature } from "../types";
import { Autocomplete } from "./autocomplete";
import { DogApiAutocompleteLayer } from "../logic/dog_autocomplete";

export type DogApiAutocompleteScope = {
  api: ApiFeature;
  dog: DogFeature;
  autocomplete: AutocompleteFeature;
};

export const DogApiAutocomplete = composeContainerLayer<
  DogApiAutocompleteScope
>(() => <Autocomplete />, [new DogApiAutocompleteLayer()]);
