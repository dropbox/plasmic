import {
  DogFeature,
  AutocompleteFeature,
  dog,
  autocomplete,
  ApiFeature
} from "../types";
import { Layer } from "../../../core/layer";

export type DogApiAutocompleteLayerScope = {
  dog: DogFeature;
  autocomplete: AutocompleteFeature;
  api: ApiFeature;
};

export interface DogApiAutocompleteLayer
  extends Layer<DogApiAutocompleteLayerScope> {}
export class DogApiAutocompleteLayer {
  @dog.observe
  triggerRefilterFromDog(previous: DogFeature["status"]) {
    if (previous.dogTypes !== this.status.dog.dogTypes) {
      this.actions.autocomplete.refilter();
    }
  }

  @autocomplete.observe
  triggerRefilterFromAutocomplete(previous: AutocompleteFeature["status"]) {
    if (
      previous.value !== this.status.autocomplete.value &&
      this.status.dog.dogTypes.indexOf(this.status.autocomplete.value) !== -1
    ) {
      this.actions.api.getDog(this.status.autocomplete.value);
    }
  }

  @autocomplete.on.fetchOptions.observe
  triggerGetDogList() {
    this.actions.api.getDogList();
  }

  @autocomplete.provide.getOptions
  getOptions() {
    return this.status.dog.dogTypes;
  }
}
