import { Feature, FeatureStrings } from "../../core/types";
import { createLogicDecorators } from "../../core";

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
    fetchOptions: () => void;
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

export const { dog, api, autocomplete } = createLogicDecorators<{
  dog: DogFeature;
  api: ApiFeature;
  autocomplete: AutocompleteFeature;
}>({
  dog: {
    actions: ["updateDog", "updateDogList"],
    status: ["currentDog", "dogList", "dogTypes"],
    utilities: []
  },
  api: {
    actions: ["getDog", "getDogList", "setError", "setLoading"],
    status: ["error", "loading"],
    utilities: []
  },
  autocomplete: {
    actions: ["focus", "blur", "change", "refilter", "fetchOptions"],
    status: ["focused", "value", "filteredOptions"],
    utilities: ["getOptions"]
  }
});
