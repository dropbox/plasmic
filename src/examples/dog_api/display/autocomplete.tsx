import * as React from "react";
import { autocomplete, DogApiScope } from "../types";
import { DisplayLayer } from "../../../core/display_layer";
import { DogPic } from "./dog_pic";

export class Autocomplete extends DisplayLayer<DogApiScope> {
  componentDidMount() {
    this.actions.api.getDogList();
  }
  render() {
    const searchRegexp = new RegExp(
      this.status.autocomplete.value.toLowerCase()
    );
    const filteredOptions = this.status.dog.dogTypes.filter(
      option => !!option.match(searchRegexp)
    );
    if (this.status.autocomplete.focused) {
      return (
        <React.Fragment>
          <input
            list="autocomplete-list"
            onBlur={this.actions.autocomplete.blur}
            onChange={event => {
              this.actions.autocomplete.change(event.target.value);
            }}
            value={this.status.autocomplete.value}
          />
          <datalist id="autocomplete-list">
            {filteredOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </datalist>
          <DogPic dog={this.status.dog.currentDog} />
        </React.Fragment>
      );
    } else {
      return (
        <input
          value={this.status.autocomplete.value}
          onFocus={this.actions.autocomplete.focus}
        />
      );
    }
  }
}
