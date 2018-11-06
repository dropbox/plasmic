import * as React from "react";
import { Dog } from "../types";

export type DogPicProps = {
  dog: Dog;
};

export function DogPic({ dog }: DogPicProps) {
  return <img alt={dog.dogType} src={dog.url} />;
}
