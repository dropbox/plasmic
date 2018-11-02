import { LogicLayer } from "../../../core/logic_layer";
import { DogApiScope, dog, Dog, DogList } from "../types";

export class DogLayer extends LogicLayer<DogApiScope> {
  @dog.on.updateDog.update.currentDog()
  updateDog(currentDog: Dog, newDog: Dog) {
    return newDog;
  }

  @dog.on.updateDogList.update.dogList()
  updateDogList(currentList: DogList, newList: DogList) {
    return newList;
  }
}
