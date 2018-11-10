import * as React from "react";
import { composeRegion } from "../../../core";
import { DogScope } from "../types";
import { DogPic } from "../components/dog_pic";

export type CurrentDogPicScope = DogScope;

export const CurrentDogPic = composeRegion<CurrentDogPicScope>(({ status }) => {
  const { currentDog } = status.dog;

  if (currentDog !== null) {
    return <DogPic dog={status.dog.currentDog} />;
  }

  return null;
});
