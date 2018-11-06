import * as React from "react";
import { Dog } from "../types";

export type DogPicProps = {
  dog: Dog | null;
};

export function DogPic({ dog }: DogPicProps) {
  if (dog !== null) {
    return <img alt={dog.dogType} src={dog.url} />;
  }
  return null;
}
