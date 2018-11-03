import { LogicLayer } from "../../../core/logic_layer";
import { DogApiScope, autocomplete, AutocompleteFeature } from "../types";

export class AutocompleteLayer extends LogicLayer<DogApiScope> {
  @autocomplete.on.focus.update.focused()
  onFocusUpdateFocused() {
    return true;
  }

  @autocomplete.on.blur.update.focused()
  onBlurUpdateFocused() {
    return false;
  }

  @autocomplete.on.change.update.value()
  onChangeUpdateValue(currentValue: string, newValue: string) {
    return newValue;
  }

  @autocomplete.observe()
  triggerGetDog(previous: AutocompleteFeature["state"]) {
    if (
      previous.value !== this.status.autocomplete.value &&
      this.status.dog.dogTypes.indexOf(this.status.autocomplete.value) !== -1
    ) {
      this.actions.api.getDog(this.status.autocomplete.value);
    }
  }
}
