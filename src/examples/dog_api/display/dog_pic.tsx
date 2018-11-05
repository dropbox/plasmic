import * as React from "react";
import { Dog } from "../types";

export type DogPicProps = {
  dog: Dog | null;
};
export class DogPic extends React.Component<DogPicProps> {
  render() {
    const { dog } = this.props;

    if (dog !== null) {
      return <img alt={dog.dogType} src={dog.url} />;
    }

    return null;
  }
}
