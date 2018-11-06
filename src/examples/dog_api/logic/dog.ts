import { dog, Dog, DogList, DogFeature } from "../types";
import { Layer } from "../../../core/layer";

export type DogLayerScope = {
  dog: DogFeature;
};

export interface DogLayer extends Layer<DogLayerScope> {}

export class DogLayer {
  @dog.on.updateDog.update.currentDog
  updateDog(currentDog: Dog, newDog: Dog) {
    return newDog;
  }

  @dog.on.updateDogList.update.dogList
  updateDogList(currentList: DogList, newList: DogList) {
    return newList;
  }

  @dog.on.updateDogList.update.dogTypes
  updateDogTypes(currentDogTypes: string[], value: DogList) {
    return Object.keys(value).reduce((acc, dogType) => {
      const list = value[dogType];

      if (list.length) {
        return [...acc, ...list.map(subType => `${dogType}/${subType}`)];
      }

      return [...acc, dogType];
    }, []);
  }
}
