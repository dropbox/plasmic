import { Feature, ScopeStrings } from "../../core/types";
import { createLogicScaffold } from "../../core/logic_layer";

export type Dog = {
  dogType: string;
  url: string;
};

export type DogResponse = {
  message: string;
};

export type DogFeature = Feature<
  {
    updateDog: (newDog: Dog) => void;
  },
  {
    currentDog: Dog | null;
  }
>;

export type ApiFeature = Feature<
  {
    getDog: (dogType: string) => void;
    setError: (error: string) => void;
  },
  {
    error: string | null;
  }
>;

export type DogApiScope = {
  dog: DogFeature;
  api: ApiFeature;
};

export const dogapiStrings: ScopeStrings<DogApiScope> = {
  dog: {
    actions: ["updateDog"],
    state: ["currentDog"],
    utilities: []
  },
  api: {
    actions: ["getDog", "setError"],
    state: ["error"],
    utilities: []
  }
};

export const { dog, api } = createLogicScaffold(dogapiStrings);
