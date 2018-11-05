import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { TodoScope } from "../../todos/types";
import { DogApiScope, Dog } from "../../dog_api/types";
import { DogAutocomplete } from "../../dog_api/containers/dog_autocomplete";
import { DogPic } from "../../dog_api/display/dog_pic";

export class TodogInput extends DisplayLayer<TodoScope<Dog> & DogApiScope> {
  onSubmit = e => {
    const { currentDog } = this.status.dog;
    if (currentDog !== null) {
      this.actions.todos.addTodo(currentDog.dogType, currentDog);
    }
    e.preventDefault();
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <DogAutocomplete />
        <button type="submit">Add</button>
        <DogPic dog={this.status.dog.currentDog} />
      </form>
    );
  }
}
