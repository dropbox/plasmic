import { Feature, ScopeStrings } from "../../core/types";
import { createLogicScaffold } from "../../core/logic_layer";

export type Dog = {
  dogType: string;
  url: string;
};

export type DogList = {
  [key: string]: string[];
};

export type DogResponse = {
  message: string | DogList;
};

export type DogFeature = Feature<
  {
    updateDog: (newDog: Dog) => void;
    updateDogList: (list: DogList) => void;
  },
  {
    currentDog: Dog | null;
    dogList: DogList | null;
  }
>;

export type ApiFeature = Feature<
  {
    getDog: (dogType: string) => void;
    getDogList: () => void;
    setError: (error: string) => void;
    setLoading: (loading: boolean) => void;
  },
  {
    error: string | null;
    loading: boolean;
  }
>;

export type DogApiScope = {
  dog: DogFeature;
  api: ApiFeature;
};

export const dogapiStrings: ScopeStrings<DogApiScope> = {
  dog: {
    actions: ["updateDog", "updateDogList"],
    state: ["currentDog", "dogList"]
  },
  api: {
    actions: ["getDog", "getDogList", "setError", "setLoading"],
    state: ["error", "loading"]
  }
};

export const { dog, api } = createLogicScaffold(dogapiStrings);
