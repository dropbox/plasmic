import { Feature, ScopeStrings } from "../../core/types";
import { createLogicDecorators } from "../../core/decorators";

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
    dogTypes: string[];
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

export type AutocompleteFeature = Feature<
  {
    focus: () => void;
    blur: () => void;
    change: (value: string) => void;
    refilter: () => void;
  },
  {
    value: string;
    focused: boolean;
    filteredOptions: string[];
  },
  {
    getOptions: () => string[];
  }
>;

export type DogApiScope = {
  dog: DogFeature;
  api: ApiFeature;
  autocomplete: AutocompleteFeature;
};

export const dogapiStrings: ScopeStrings<DogApiScope> = {
  dog: {
    actions: ["updateDog", "updateDogList"],
    state: ["currentDog", "dogList", "dogTypes"],
    utilities: []
  },
  api: {
    actions: ["getDog", "getDogList", "setError", "setLoading"],
    state: ["error", "loading"],
    utilities: []
  },
  autocomplete: {
    actions: ["focus", "blur", "change", "refilter"],
    state: ["focused", "value", "filteredOptions"],
    utilities: ["getOptions"]
  }
};

export const { dog, api, autocomplete } = createLogicDecorators(dogapiStrings);
