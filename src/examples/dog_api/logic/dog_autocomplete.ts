import {
  DogScope,
  AutocompleteScope,
  dog,
  autocomplete,
  ApiScope
} from "../types";
import { Layer } from "../../../core/layer";

export type DogApiAutocompleteLayerScope = ApiScope &
  DogScope &
  AutocompleteScope;

export class DogApiAutocompleteLayer extends Layer<
  DogApiAutocompleteLayerScope
> {
  @dog.observe
  triggerRefilterFromDog(previous: DogScope["dog"]["status"]) {
    if (previous.dogTypes !== this.status.dog.dogTypes) {
      this.actions.autocomplete.refilter();
    }
  }

  @autocomplete.observe
  triggerRefilterFromAutocomplete(
    previous: AutocompleteScope["autocomplete"]["status"]
  ) {
    if (previous.value !== this.status.autocomplete.value) {
      if (
        this.status.dog.dogTypes.indexOf(this.status.autocomplete.value) !== -1
      ) {
        this.actions.api.getDog(this.status.autocomplete.value);
      } else {
        this.actions.dog.updateDog(null);
      }
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
