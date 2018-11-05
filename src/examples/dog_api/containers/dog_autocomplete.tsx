import * as React from "react";
import {
  AutocompleteFeature,
  DogFeature,
  autocompleteStrings,
  dogStrings,
  ApiFeature
} from "../types";
import { ReactContainerLayer } from "../../../core";
import { DogAutocompleteLayer } from "../logic/dog_autocomplete";
import { Autocomplete } from "./autocomplete";

export type DogAutocompleteScope = {
  autocomplete: AutocompleteFeature;
  dog: DogFeature;
  api: ApiFeature;
};

export type DogAutocompleteInnerScope = {
  autocomplete: AutocompleteFeature;
  dog: DogFeature;
};

export class DogAutocomplete extends ReactContainerLayer<
  DogAutocompleteScope,
  DogAutocompleteInnerScope
> {
  strings = {
    dog: dogStrings,
    autocomplete: autocompleteStrings
  };

  logic = [new DogAutocompleteLayer()];

  display() {
    return <Autocomplete />;
  }
}
