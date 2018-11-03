import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { DogApiScope } from "../types";

export class DogPic extends DisplayLayer<DogApiScope> {
  render() {
    const { currentDog } = this.status.dog;

    if (currentDog !== null) {
      return (
        <div>
          <img src={currentDog.url} />
        </div>
      );
    }

    return null;
  }
}
