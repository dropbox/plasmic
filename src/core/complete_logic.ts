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
  StatusShape,
  Utilities,
  Utility
} from "./types";

export class CompleteLogic<S extends Scope> implements Logic<S> {
  reducers: Reducers<S>;
  actions: Actions<S>;
  observers: Observers<S>;
  utilities: Utilities<S>;

  static noop() {}

  static noopReducer(value: Value) {
    return value;
  }

  static utilityMessage(feature: string, utility: string) {
    return `Utility ${utility} for feature ${feature} not implemented in scope`;
  }

  static createThrowsUtility(message: string) {
    return () => {
      throw new ReferenceError(message);
    };
  }

  constructor(private strings: ScopeStrings<S>, partials: PartialLogic<S>[]) {
    this.completeReducers(partials);
    this.completeActions(partials);
    this.completeObservers(partials);
    this.completeUtilities(partials);
  }

  private completeReducers(partials: PartialLogic<S>[]) {
    this.reducers = Object.keys(this.strings).reduce(
      (acc, feature) => ({
        ...(acc as any),
        [feature]: this.strings[feature].actions.reduce(
          (acc, action) => ({
            ...(acc as any),
            [action]: this.strings[feature].status.reduce(
              (acc, status) => ({
                ...(acc as any),
                [status]: partials
                  .filter(partial => {
                    try {
                      return !!partial.reducers[feature][action][status];
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
                        status
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
            return (s: StatusShape) => {
              acc(s);
              partial.observers![feature]!(s);
            };
          }, CompleteLogic.noop)
      }),
      {} as Observers<S>
    );
  }

  completeUtilities(partials: PartialLogic<S>[]): any {
    this.utilities = Object.keys(this.strings).reduce(
      (acc, feature) => {
        const utilityPartials = partials.filter(partial => {
          try {
            return !!partial.utilities[feature];
          } catch {
            return false;
          }
        });
        return {
          ...(acc as any),
          [feature]: this.strings[feature].utilities.reduce((acc, utility) => {
            let util: Utility;

            try {
              util = utilityPartials.find(
                partial =>
                  !!partial.utilities[feature] &&
                  !!partial.utilities[feature][utility]
              ).utilities[feature][utility] as Utility | null;

              if (util === null) {
                throw new TypeError();
              }
            } catch (e) {
              const message = CompleteLogic.utilityMessage(
                feature,
                utility as string
              );
              console.warn(message);
              util = CompleteLogic.createThrowsUtility(message);
            }

            return {
              ...(acc as any),
              [utility]: util
            };
          }, {})
        };
      },
      {} as Utilities<S>
    );
  }
}
