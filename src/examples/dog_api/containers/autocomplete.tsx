import * as React from "react";
import { dogapiStrings, AutocompleteFeature } from "../types";
import { ContainerLayer } from "../../../core/container_layer";
import { AutocompleteLayer } from "../logic/autocomplete";

export type AutocompleteScope = {
  autocomplete: AutocompleteFeature;
};

export class Autocomplete extends ContainerLayer<AutocompleteScope> {
  strings = {
    autocomplete: dogapiStrings.autocomplete
  };

  defaultStatus = {
    autocomplete: {
      value: "",
      focused: false,
      filteredOptions: []
    }
  };

  logic = [new AutocompleteLayer()];

  display() {
    const { blur, focus, change } = this.actions.autocomplete;
    const { value, filteredOptions, focused } = this.status.autocomplete;

    if (focused) {
      return (
        <React.Fragment>
          <input
            list="autocomplete-list"
            onBlur={() => {
              blur();
            }}
            onChange={event => {
              change(event.target.value);
            }}
            value={value}
          />
          <datalist id="autocomplete-list">
            {filteredOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </datalist>
        </React.Fragment>
      );
    } else {
      return (
        <input
          value={value}
          onFocus={() => {
            focus();
          }}
        />
      );
    }
  }
}
