import {
  DogFeature,
  AutocompleteFeature,
  dog,
  autocomplete,
  ApiFeature
} from "../types";
import { Layer } from "../../../core/layer";

export type DogAutocompleteLayerScope = {
  dog: DogFeature;
  autocomplete: AutocompleteFeature;
  api: ApiFeature;
};

export class DogAutocompleteLayer extends Layer<DogAutocompleteLayerScope> {
  @dog.observe()
  triggerRefilterFromDog(previous: DogFeature["status"]) {
    if (previous.dogTypes !== this.status.dog.dogTypes) {
      this.actions.autocomplete.refilter();
    }
  }

  @autocomplete.observe()
  triggerRefilterFromAutocomplete(previous: AutocompleteFeature["status"]) {
    if (
      previous.value !== this.status.autocomplete.value &&
      this.status.dog.dogTypes.indexOf(this.status.autocomplete.value) !== -1
    ) {
      this.actions.api.getDog(this.status.autocomplete.value);
    }
  }

  @autocomplete.provides.getOptions()
  getOptions() {
    return this.status.dog.dogTypes;
  }
}
