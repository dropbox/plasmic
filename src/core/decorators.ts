import { Scope, PartialLogic, LogicScaffold, ScopeStrings } from "./types";
import { Layer } from "./layer";

function createExtractLogicDecorator<S extends Scope>(
  update: (method: any, base: PartialLogic<S>) => PartialLogic<S>
) {
  return () => (target: any, methodName: string) => {
    const last = target.extractLogic;

    target.extractLogic = function(seed: Layer<S>) {
      const thisArg = Object.create(this);

      Object.defineProperties(thisArg, {
        status: {
          get: () => seed.status
        },
        actions: {
          get: () => seed.actions
        },
        utilities: {
          get: () => seed.utilities
        }
      });

      const base = (last && last.call(this, seed)) || {};

      return update(target[methodName].bind(thisArg), base);
    };
  };
}

function createFeatureScaffold(strings, feature) {
  return {
    observe: createExtractLogicDecorator((method, base) => {
      base.observers = base.observers || {};

      return {
        ...base,
        observers: {
          ...(base.observers as any),
          [feature]: method
        }
      };
    }),
    on: strings[feature].actions.reduce(
      (acc, action) => ({
        ...(acc as any),
        [action]: createActionScaffold(strings, feature, action)
      }),
      {}
    ),
    provides: strings[feature].utilities.reduce(
      (acc, utility) => ({
        ...(acc as any),
        [utility]: createUtilityScaffold(strings, feature, utility)
      }),
      {}
    )
  };
}

function createActionScaffold(strings, feature, action) {
  return {
    observe: createExtractLogicDecorator((method, base) => {
      base.actions = base.actions || {};
      base.actions[feature] = base.actions[feature] || {};

      return {
        ...(base as any),
        actions: {
          ...(base.actions as any),
          [feature]: {
            ...(base.actions[feature] as any),
            [action]: method
          }
        }
      };
    }),
    update: strings[feature].status.reduce(
      (acc, state) => ({
        ...(acc as any),
        [state]: createReducerScaffold(strings, feature, action, state)
      }),
      {}
    )
  };
}

function createUtilityScaffold(strings, feature, utility) {
  return createExtractLogicDecorator((method, base) => {
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
  return createExtractLogicDecorator((method, base) => {
    base.reducers = base.reducers || {};
    base.reducers[feature] = base.reducers[feature] || {};
    (base.reducers[feature] as any)[action] =
      (base.reducers[feature] as any)[action] || {};

    return {
      ...(base as any),
      reducers: {
        [feature]: {
          ...(base.reducers[feature] as any),
          [action]: {
            ...((base.reducers[feature] as any)[action] as any),
            [state]: method
          }
        }
      }
    };
  });
}

export function createLogicDecorators<S extends Scope>(
  strings: ScopeStrings<S>
): LogicScaffold<S> {
  return Object.keys(strings).reduce(
    (acc, feature) => ({
      ...(acc as any),
      [feature]: createFeatureScaffold(strings, feature)
    }),
    {} as LogicScaffold<S>
  );
}

export function extractLogic<S extends Scope>(
  layers: Layer<S>[],
  seed: Layer<S>
): PartialLogic<S>[] {
  return layers.map(layer => layer.extractLogic(seed));
}
