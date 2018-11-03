import { LogicLayer } from "../../../core/logic_layer";
import { DogApiScope, dog, Dog, DogList, DogFeature } from "../types";

export class DogLayer extends LogicLayer<DogApiScope> {
  @dog.on.updateDog.update.currentDog()
  updateDog(currentDog: Dog, newDog: Dog) {
    return newDog;
  }

  @dog.on.updateDogList.update.dogList()
  updateDogList(currentList: DogList, newList: DogList) {
    return newList;
  }

  @dog.on.updateDogList.update.dogTypes()
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
