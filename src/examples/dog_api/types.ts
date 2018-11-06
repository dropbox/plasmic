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

export const dogStrings: FeatureStrings<DogFeature> = {
  actions: ["updateDog", "updateDogList"],
  status: ["currentDog", "dogList", "dogTypes"],
  utilities: []
};

export const apiStrings: FeatureStrings<ApiFeature> = {
  actions: ["getDog", "getDogList", "setError", "setLoading"],
  status: ["error", "loading"],
  utilities: []
};
export const autocompleteStrings: FeatureStrings<AutocompleteFeature> = {
  actions: ["focus", "blur", "change", "refilter", "fetchOptions"],
  status: ["focused", "value", "filteredOptions"],
  utilities: ["getOptions"]
};

export const { dog, api, autocomplete } = createLogicDecorators<{
  dog: DogFeature;
  api: ApiFeature;
  autocomplete: AutocompleteFeature;
}>({
  dog: dogStrings,
  api: apiStrings,
  autocomplete: autocompleteStrings
});
