import {
  Scope,
  Logic,
  Reducers,
  Actions,
  Observers,
  Value,
  ScopeStrings,
  PartialLogic,
  Reducer,
  Action,
  Observer,
  StateShape
} from "./types";

export class CompleteLogic<S extends Scope> implements Logic<S> {
  reducers: Reducers<S>;
  actions: Actions<S>;
  observers: Observers<S>;

  static noop() {}

  static noopReducer(value: Value) {
    return value;
  }

  constructor(private strings: ScopeStrings<S>, partials: PartialLogic<S>[]) {
    this.completeReducers(partials);
    this.completeActions(partials);
    this.completeObservers(partials);
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
                    return (v: Value, ...a: Value[]) => {
                      let next = acc(v, ...a);

                      if (next === undefined) {
                        next = v;
                      }

                      return (partial.reducers![feature]![action]![
                        state
                      ]! as any)(next, ...a);
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
              .reduce<Action>((acc, partial) => {
                return (...values: Value[]) => {
                  acc(...values);
                  partial.actions![feature]![action]!(...values);
                };
              }, CompleteLogic.noop)
          };
        }, {})
      }),
      {} as Actions<S>
    );
  }

  private completeObservers(partials: PartialLogic<S>[]) {
    this.observers = Object.keys(this.strings).reduce(
      (acc, feature) => ({
        ...(acc as any),
        [feature]: partials
          .filter(partial => {
            try {
              return !!partial.observers[feature];
            } catch {
              return false;
            }
          })
          .reduce<Observer>((acc, partial) => {
            return (s: StateShape) => {
              acc(s);
              partial.observers![feature]!(s);
            };
          }, CompleteLogic.noop)
      }),
      {} as Observers<S>
    );
  }
}
