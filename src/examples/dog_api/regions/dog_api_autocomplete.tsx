import * as React from "react";
import { composeContainerRegion } from "../../../core";
import { Autocomplete } from "./autocomplete";
import { DogApiAutocompleteLayer } from "../logic/dog_autocomplete";

export type DogApiAutocompleteScope = {};

export const DogApiAutocomplete = composeContainerRegion<
  DogApiAutocompleteScope
>({
  display: () => <Autocomplete />,
  layers: [new DogApiAutocompleteLayer()],
  defaultStatus: {}
});
