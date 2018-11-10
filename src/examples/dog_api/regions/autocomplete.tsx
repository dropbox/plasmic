import * as React from "react";
import { AutocompleteScope } from "../types";
import { Layer, containerRegion } from "../../../core";
import { AutocompleteLayer } from "../logic/autocomplete";

export type AutocompleteScope = AutocompleteScope;

export interface Autocomplete extends Layer<AutocompleteScope> {}

@containerRegion
export class Autocomplete extends React.Component {
  defaultStatus = {
    autocomplete: {
      value: "",
      focused: false,
      filteredOptions: []
    }
  };

  layers = [new AutocompleteLayer()];

  componentWillMount() {
    this.actions.autocomplete.fetchOptions();
  }

  render() {
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
          onChange={() => {}}
          onFocus={() => {
            focus();
          }}
        />
      );
    }
  }
}
