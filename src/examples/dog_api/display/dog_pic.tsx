import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { DogApiScope } from "../types";

export class DogPic extends DisplayLayer<DogApiScope> {
  render() {
    const { currentDog } = this.status.dog;

    if (currentDog !== null) {
      return <img src={currentDog.url} />;
    }

    return null;
  }
}
