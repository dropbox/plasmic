import { DogApiScope, Dog, dog } from "../../dog_api/types";
import { TodoScope, todos } from "../../todos/types";
import { LogicLayer } from "../../../core/logic_layer";

export class TodogLayer extends LogicLayer<DogApiScope & TodoScope<Dog>> {
  @dog.on.updateDog.observe()
  onUpdateDog() {
    const { currentDog } = this.status.dog;
    this.actions.todos.addTodo(currentDog.dogType, currentDog);
  }
}
