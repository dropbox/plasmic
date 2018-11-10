import { api, DogResponse, DogList, ApiScope, DogScope } from "../types";
import { Layer } from "../../../core/layer";

export type ApiLayerScope = ApiScope & DogScope;

export class ApiLayer extends Layer<ApiLayerScope> {
  @api.on.getDog.observe
  async getDog(previous: ApiScope["api"]["status"], dogType: string) {
    const url = `https://dog.ceo/api/breed/${dogType}/images/random`;
    const dogResponse: DogResponse | null = await this.doAjax(url);

    if (dogResponse !== null && typeof dogResponse.message === "string") {
      this.actions.dog.updateDog({
        dogType,
        url: dogResponse.message
      });
    }
  }

  @api.on.getDogList.observe
  async getDogList() {
    const url = "https://dog.ceo/api/breeds/list/all";
    const dogResponse: DogResponse | null = await this.doAjax(url);

    if (dogResponse !== null && typeof dogResponse.message !== "string") {
      this.actions.dog.updateDogList(dogResponse.message as DogList);
    }
  }

  @api.on.setError.update.error
  setError(currentError: string, error: string) {
    return error;
  }

  @api.on.setLoading.update.loading
  setLoading(currentLoading: boolean, loading: boolean) {
    return loading;
  }

  async doAjax(url) {
    this.actions.api.setLoading(true);

    let dogResponse: DogResponse = null;

    try {
      const httpResponse = await fetch(url);

      if (httpResponse.ok) {
        dogResponse = await httpResponse.json();
        this.actions.api.setError(null);
      } else {
        const errorResponse: DogResponse = await httpResponse.json();
        this.actions.api.setError(errorResponse.message.toString());
      }
    } catch (e) {
      this.actions.api.setError(e.toString());
    }

    this.actions.api.setLoading(false);

    return dogResponse;
  }
}
