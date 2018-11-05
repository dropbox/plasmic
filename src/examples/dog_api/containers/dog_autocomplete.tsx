import * as React from "react";
import {
  DogApiScope,
  dogapiStrings,
  AutocompleteFeature,
  DogFeature
} from "../types";
import { ContainerLayer } from "../../../core/container_layer";
import { DogAutocompleteLayer } from "../logic/dog_autocomplete";
import { Autocomplete } from "./autocomplete";

export type DogAutocompleteScope = {
  autocomplete: AutocompleteFeature;
  dog: DogFeature;
};

export class DogAutocomplete extends ContainerLayer<
  DogApiScope,
  DogAutocompleteScope
> {
  strings = {
    dog: dogapiStrings.dog,
    autocomplete: dogapiStrings.autocomplete
  };

  logic = [new DogAutocompleteLayer()];

  display() {
    return <Autocomplete />;
  }
}
