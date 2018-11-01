import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { DogApiScope } from "../types";

export class DogSelector extends DisplayLayer<DogApiScope> {
  onClick = () => {
    this.actions.api.getDog("bullterrier/staffordshire");
  };
  render() {
    return (
      <button type="button" onClick={this.onClick}>
        Get Doggy Picture
      </button>
    );
  }
}
