import * as React from "react";
import { composeReactLayer } from "../../../core";
import { DogFeature } from "../types";
import { DogPic } from "../components/dog_pic";

export type CurrentDogPicScope = {
  dog: DogFeature;
};

export const CurrentDogPic = composeReactLayer<CurrentDogPicScope>(
  ({ status }) => {
    const { currentDog } = status.dog;

    if (currentDog !== null) {
      return <DogPic dog={status.dog.currentDog} />;
    }

    return null;
  }
);
