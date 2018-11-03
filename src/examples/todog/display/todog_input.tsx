import * as React from "react";
import { DisplayLayer } from "../../../core/display_layer";
import { TodoScope } from "../../todos/types";
import { DogApiScope, Dog } from "../../dog_api/types";
import { Autocomplete } from "../../dog_api/display/autocomplete";
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
        <Autocomplete />
        <button type="submit">Add</button>
        <DogPic dog={this.status.dog.currentDog} style={{ height: 50 }} />
      </form>
    );
  }
}
