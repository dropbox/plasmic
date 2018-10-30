import { Scope, PartialLogic, LogicScaffold, ScopeStrings } from "./types";
import { Layer } from "./layer";

export class LogicLayer<S extends Scope> extends Layer<S> {
  extractLogic: (seed: Layer<S>) => PartialLogic<S>;
}

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
        triggers: {
          get: () => seed.triggers
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
      base.features = base.features || {};

      return {
        ...base,
        features: {
          ...(base.features as any),
          [feature]: method
        }
      };
    }),
    observeOn: strings[feature].actions.reduce(
      (acc, action) => ({
        ...(acc as any),
        [action]: createActionScaffold(strings, feature, action)
      }),
      {}
    )
  };
}

function createActionScaffold(strings, feature, action) {
  return Object.assign(
    createExtractLogicDecorator((method, base) => {
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
    {
      update: strings[feature].state.reduce(
        (acc, state) => ({
          ...(acc as any),
          [state]: createReducerScaffold(strings, feature, action, state)
        }),
        {}
      )
    }
  );
}

function createReducerScaffold(strings, feature, action, state) {
  return createExtractLogicDecorator((method, base) => {
    base.reducers = base.reducers || {};
    base.reducers[feature] = base.reducers[feature] || {};
    (base.reducers[feature] as any)[action] =
      (base.reducers[feature] as any)[action] || {};

    return {
      ...(base.reducers as any),
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

export function createLogicScaffold<S extends Scope>(
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
  layers: LogicLayer<S>[],
  seed: Layer<S>
): PartialLogic<S>[] {
  return layers.map(layer => layer.extractLogic(seed));
}
