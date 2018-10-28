import {
  Scope,
  Logic,
  Reducers,
  ActionListeners,
  FeatureListeners,
  Value,
  ScopeStrings,
  PartialLogic,
  Reducer,
  ActionListener,
  FeatureListener,
  State
} from "./types";

export class CompleteLogic<S extends Scope> implements Logic<S> {
  reducers: Reducers<S>;
  actions: ActionListeners<S>;
  features: FeatureListeners<S>;

  static noop() {}

  static noopReducer(value: Value) {
    return value;
  }

  constructor(private strings: ScopeStrings<S>, partials: PartialLogic<S>[]) {
    this.completeReducers(partials);
    this.completeActions(partials);
    this.completeFeatures(partials);
  }

  private completeReducers(partials: PartialLogic<S>[]) {
    this.reducers = Object.keys(this.strings).reduce(
      (acc, feature) => ({
        ...(acc as any),
        [feature]: this.strings[feature].actions.reduce(
          (acc, action) => ({
            ...(acc as any),
            [action]: this.strings[feature].state.reduce(
              (acc, state) => ({
                ...(acc as any),
                [state]: partials
                  .filter(partial => {
                    try {
                      return !!partial.reducers[feature][action][state];
                    } catch {
                      return false;
                    }
                  })
                  .reduce<Reducer>((acc, partial) => {
                    return (v: Value, a: Value) => {
                      let next = acc(v, a);

                      if (next === undefined) {
                        next = v;
                      }

                      return (partial.reducers![feature]![action]![
                        state
                      ]! as any)(next, a);
                    };
                  }, CompleteLogic.noopReducer)
              }),
              {}
            )
          }),
          {}
        )
      }),
      {} as Reducers<S>
    );
  }

  private completeActions(partials: PartialLogic<S>[]) {
    this.actions = Object.keys(this.strings).reduce(
      (acc, feature) => ({
        ...(acc as any),
        [feature]: this.strings[feature].actions.reduce((acc, action) => {
          return {
            ...(acc as any),
            [action]: partials
              .filter(partial => {
                try {
                  return !!partial.actions[feature][action];
                } catch {
                  return false;
                }
              })
              .reduce<ActionListener>((acc, partial) => {
                return (a: Value) => {
                  acc(a);
                  partial.actions![feature]![action]!(a);
                };
              }, CompleteLogic.noop)
          };
        }, {})
      }),
      {} as ActionListeners<S>
    );
  }

  private completeFeatures(partials: PartialLogic<S>[]) {
    this.features = Object.keys(this.strings).reduce(
      (acc, feature) => ({
        ...(acc as any),
        [feature]: partials
          .filter(partial => {
            try {
              return !!partial.features[feature];
            } catch {
              return false;
            }
          })
          .reduce<FeatureListener>((acc, partial) => {
            return (s: State) => {
              acc(s);
              partial.features![feature]!(s);
            };
          }, CompleteLogic.noop)
      }),
      {} as FeatureListeners<S>
    );
  }
}
