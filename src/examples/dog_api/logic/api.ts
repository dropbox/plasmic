import { LogicLayer } from "../../../core/logic_layer";
import { DogApiScope, api, ApiFeature, Dog, DogResponse } from "../types";

export class ApiLayer extends LogicLayer<DogApiScope> {
  @api.on.getDog.observe()
  async getDog(previous: ApiFeature["state"], dogType: string) {
    const url = `https://dog.ceo/api/breed/${dogType}/images/random`;

    try {
      const httpResponse = await fetch(url);
      const dogResponse: DogResponse = await httpResponse.json();

      if (httpResponse.ok) {
        this.actions.dog.updateDog({
          dogType,
          url: dogResponse.message
        } as Dog);
      } else {
        this.actions.api.setError(dogResponse.message);
      }
    } catch (e) {
      this.actions.api.setError(e.toString());
    }
  }

  @api.on.setError.update.error()
  setError(previous: ApiFeature["state"], error: string) {
    return error;
  }
}
