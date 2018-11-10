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

export type DogScope = {
  dog: {
    actions: {
      updateDog: (newDog: Dog) => void;
      updateDogList: (list: DogList) => void;
    };
    status: {
      currentDog: Dog | null;
      dogList: DogList | null;
      dogTypes: string[];
    };
    utilities: {};
  };
};

export type ApiScope = {
  api: {
    actions: {
      getDog: (dogType: string) => void;
      getDogList: () => void;
      setError: (error: string) => void;
      setLoading: (loading: boolean) => void;
    };
    status: {
      error: string | null;
      loading: boolean;
    };
    utilities: {};
  };
};

export type AutocompleteScope = {
  autocomplete: {
    actions: {
      focus: () => void;
      blur: () => void;
      change: (value: string) => void;
      refilter: () => void;
      fetchOptions: () => void;
    };
    status: {
      value: string;
      focused: boolean;
      filteredOptions: string[];
    };
    utilities: {
      getOptions: () => string[];
    };
  };
};

export const { dog, api, autocomplete } = createLogicDecorators<
  DogScope & ApiScope & AutocompleteScope
>({
  dog: {
    actions: ["updateDog", "updateDogList"],
    status: ["currentDog", "dogList", "dogTypes"],
    utilities: [] as never[]
  },
  api: {
    actions: ["getDog", "getDogList", "setError", "setLoading"],
    status: ["error", "loading"],
    utilities: [] as never[]
  },
  autocomplete: {
    actions: ["focus", "blur", "change", "refilter", "fetchOptions"],
    status: ["focused", "value", "filteredOptions"],
    utilities: ["getOptions"]
  }
});
