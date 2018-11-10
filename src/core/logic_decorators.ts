import {
  Scope,
  PartialLogic,
  LogicDecorators,
  ScopeStrings,
  FeatureStrings
} from "./types";
import { Layer } from "./layer";

function createLogicDecorator<S extends Scope>(
  feature: keyof S,
  featureStrings: FeatureStrings<S[keyof S]>,
  update: (method: any, base: PartialLogic<S>) => PartialLogic<S>
) {
  return function(target: any, methodName: string) {
    const lastLogic = target.extractLogic;
    const lastStrings = target.extractStrings;

    target.extractLogic = function(seed: Layer<S>) {
      const thisArg = Object.create(this);

      Object.defineProperties(thisArg, {
        seed: {
          get: () => seed
        }
      });

      const base = lastLogic ? lastLogic.call(this, seed) : {};

      return update(target[methodName].bind(thisArg), base);
    };

    target.extractStrings = function() {
      const base = lastStrings ? lastStrings.call(this) : {};
      return {
        ...base,
        [feature]: featureStrings
      };
    };
  };
}

function createFeatureScaffold(strings, feature) {
  return {
    observe: createLogicDecorator(feature, strings[feature], (method, base) => {
      base.observers = base.observers || {};

      return {
        ...base,
        observers: {
          ...base.observers,
          [feature]: method
        }
      };
    }),
    on: strings[feature].actions.reduce(
      (acc, action) => ({
        ...acc,
        [action]: createActionScaffold(strings, feature, action)
      }),
      {}
    ),
    provide: strings[feature].utilities.reduce(
      (acc, utility) => ({
        ...acc,
        [utility]: createUtilityScaffold(strings, feature, utility)
      }),
      {}
    )
  };
}

function createActionScaffold(strings, feature, action) {
  return {
    observe: createLogicDecorator(feature, strings[feature], (method, base) => {
      base.actions = base.actions || {};
      base.actions[feature] = base.actions[feature] || {};

      return {
        ...base,
        actions: {
          ...base.actions,
          [feature]: {
            ...base.actions[feature],
            [action]: method
          }
        }
      };
    }),
    update: Object.assign(
      createLogicDecorator(feature, strings[feature], (method, base) => {
        base.statusReducers = base.statusReducers || {};
        base.statusReducers[feature] = base.statusReducers[feature] || {};

        return {
          ...base,
          statusReducers: {
            ...base.statusReducers,
            [feature]: {
              ...base.statusReducers[feature],
              [action]: method
            }
          }
        };
      }),
      strings[feature].status.reduce(
        (acc, state) => ({
          ...(acc as any),
          [state]: createReducerScaffold(strings, feature, action, state)
        }),
        {}
      )
    )
  };
}

function createUtilityScaffold(strings, feature, utility) {
  return createLogicDecorator(feature, strings[feature], (method, base) => {
    base.utilities = base.utilities || {};
    base.utilities[feature] = base.utilities[feature] || {};

    return {
      ...(base as any),
      utilities: {
        ...(base.utilities as any),
        [feature]: {
          ...(base.utilities[feature] as any),
          [utility]: method
        }
      }
    };
  });
}

function createReducerScaffold(strings, feature, action, state) {
  return createLogicDecorator(feature, strings[feature], (method, base) => {
    base.valueReducers = base.valueReducers || {};
    base.valueReducers[feature] = base.valueReducers[feature] || {};
    (base.valueReducers[feature] as any)[action] =
      (base.valueReducers[feature] as any)[action] || {};

    return {
      ...(base as any),
      valueReducers: {
        [feature]: {
          ...(base.valueReducers[feature] as any),
          [action]: {
            ...((base.valueReducers[feature] as any)[action] as any),
            [state]: method
          }
        }
      }
    };
  });
}

export function createLogicDecorators<S extends Scope>(
  strings: ScopeStrings<S>
): LogicDecorators<S> {
  return Object.keys(strings).reduce(
    (acc, feature) => ({
      ...(acc as any),
      [feature]: createFeatureScaffold(strings, feature)
    }),
    {} as LogicDecorators<S>
  );
}

export function extractLogic<S extends Scope>(
  layers: Layer<S>[],
  seed: Layer<S>
): PartialLogic<S>[] {
  return layers.map(layer => layer.extractLogic(seed));
}

export function extractStrings<S extends Scope>(
  layers: Layer<S>[]
): ScopeStrings<S>[] {
  return layers.reduce(
    (strings, layer) => ({
      ...(strings as any),
      ...(layer.extractStrings() as any)
    }),
    {}
  );
}
