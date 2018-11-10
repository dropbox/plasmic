import { autocomplete, AutocompleteScope } from "../types";
import { Layer } from "../../../core/layer";

export type AutocompleteLayerScope = AutocompleteScope;

export class AutocompleteLayer extends Layer<AutocompleteLayerScope> {
  @autocomplete.on.focus.update.focused
  onFocusUpdateFocused() {
    return true;
  }

  @autocomplete.on.blur.update.focused
  onBlurUpdateFocused() {
    return false;
  }

  @autocomplete.on.change.update.value
  onChangeUpdateValue(currentValue: string, newValue: string) {
    return newValue;
  }

  @autocomplete.on.refilter.update.filteredOptions
  refilter() {
    const searchRegexp = new RegExp(
      this.status.autocomplete.value.toLowerCase()
    );
    return this.utilities.autocomplete
      .getOptions()
      .filter(option => !!option.match(searchRegexp));
  }

  @autocomplete.observe
  triggerRefilter(previous: AutocompleteScope["autocomplete"]["status"]) {
    if (previous.value !== this.status.autocomplete.value) {
      this.actions.autocomplete.refilter();
    }
  }
}
