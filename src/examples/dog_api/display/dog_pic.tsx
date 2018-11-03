import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { DogApiScope, Dog } from "../types";

export type DogPicProps = {
  style?: React.CSSProperties;
  dog: Dog;
};
export class DogPic extends DisplayLayer<DogApiScope, DogPicProps> {
  render() {
    const { dog, style } = this.props;
    if (dog !== null) {
      return <img alt={dog.dogType} style={style} src={dog.url} />;
    }

    return null;
  }
}
