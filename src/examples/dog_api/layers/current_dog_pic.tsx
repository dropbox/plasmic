import * as React from "react";
import { composeReactLayer } from "../../../core";
import { DogFeature } from "../types";
import { DogPic } from "../components/dog_pic";

export type CurrentDogPicScope = {
  dog: DogFeature;
};

export const CurrentDogPic = composeReactLayer<CurrentDogPicScope>(
  ({ status }) => <DogPic dog={status.dog.currentDog} />
);
