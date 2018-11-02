import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { DogApiScope } from "../types";
import { Autocomplete } from "./autocomplete";

export class DogSelector extends DisplayLayer<DogApiScope> {
  componentWillMount() {
    this.actions.api.getDogList();
  }
  onSubmit = event => {
    const target = event.target as HTMLFormElement;
    this.actions.api.getDog(target["selector"].value);
    event.preventDefault();
  };
  render() {
    const dogList = this.status.dog.dogList;

    if (dogList === null) {
      return null;
    }

    return (
      <form onSubmit={this.onSubmit}>
        <Autocomplete options={this.status.dogOptions} />
        <button type="submit">Get Doggy Picture</button>
      </form>
    );
  }
}
