import * as React from "react";

export type Value = any;

export type Actions = {
  [key: string]: Value;
};

export type State = {
  [key: string]: Value;
};

export type Feature<A extends Actions = {}, S extends State = {}> = {
  actions: A;
  state: S;
};

export type FeatureStrings<A extends Actions = {}, S extends State = {}> = {
  actions: (keyof A)[];
  state: (keyof S)[];
};

export type Scope = {
  [key: string]: Feature;
};

export type ScopeStrings<S extends Scope> = {
  [F in keyof S]: FeatureStrings<S[F]["actions"], S[F]["state"]>
};

export type Status<S extends Scope> = { [K in keyof S]: S[K]["state"] };

export type Triggers<S extends Scope> = {
  [F in keyof S]: {
    [A in keyof S[F]["actions"]]: (a: S[F]["actions"][A]) => void
  }
};

export type ActionListener<A extends Value = Value> = (a: A) => void;

export type ActionListeners<S extends Scope> = {
  [F in keyof S]: {
    [A in keyof S[F]["actions"]]: ActionListener<S[F]["actions"][A]>
  }
};

export type PartialActionListeners<S extends Scope> = {
  [F in keyof S]?: {
    [A in keyof S[F]["actions"]]?: ActionListener<S[F]["actions"][A]>
  }
};

export type FeatureListener<S extends State = State> = (previous: S) => void;

export type FeatureListeners<S extends Scope> = {
  [F in keyof S]: FeatureListener<S[F]["state"]>
};

export type Reducer<V extends Value = Value, A extends Value = Value> = (
  v: V,
  a: A
) => V;

export type Reducers<S extends Scope> = {
  [F in keyof S]: {
    [A in keyof S[F]["actions"]]: {
      [V in keyof S[F]["state"]]: Reducer<S[F]["state"][V], S[F]["actions"][A]>
    }
  }
};

export type PartialReducers<S extends Scope> = {
  [F in keyof S]?: {
    [A in keyof S[F]["actions"]]?: {
      [V in keyof S[F]["state"]]?: (
        v: S[F]["state"][V],
        a: S[F]["actions"][A]
      ) => S[F]["state"][V]
    }
  }
};

export type Logic<S extends Scope> = {
  reducers: Reducers<S>;
  actions: ActionListeners<S>;
  features: FeatureListeners<S>;
};

export type PartialLogic<S extends Scope> = {
  reducers?: PartialReducers<S>;
  actions?: PartialActionListeners<S>;
  features?: Partial<FeatureListeners<S>>;
};

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

export type SubscriptionHandle = { unsubscribe: () => void };

export class StatusContainer<S extends Scope> {
  private listeners: ((s: Status<S>) => void)[] = [];

  constructor(private strings: ScopeStrings<S>, private status: Status<S>) {}
  public getStatus(): Status<S> {
    return this.status;
  }
  public subscribe(listener: (s: Status<S>) => void): SubscriptionHandle {
    this.listeners.push(listener);
    return {
      unsubscribe: () => {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
      }
    };
  }
  public getTriggers(logic: Logic<S>): Triggers<S> {
    return Object.keys(this.strings).reduce(
      (acc, feature) => ({
        ...(acc as any),
        [feature]: this.strings[feature].actions.reduce(
          (acc, action) => ({
            ...(acc as any),
            [action]: (v: Value) => {
              const previous = this.status;

              this.status = {
                ...(this.status as any),
                [feature]: this.strings[feature].state.reduce(
                  (acc, state) => ({
                    ...(acc as any),
                    [state]: (logic.reducers[feature][action][state] as any)(
                      this.status[feature][state],
                      v
                    )
                  }),
                  this.status[feature]
                )
              };

              logic.actions[feature][action](v);
              logic.features[feature](previous[feature]);
              this.updateSubscribers();
            }
          }),
          {}
        )
      }),
      {} as Triggers<S>
    );
  }

  updateSubscribers() {
    this.listeners.forEach(listener => listener(this.getStatus()));
  }
}

export class Layer<S extends Scope> {
  readonly status: Status<S>;
  readonly triggers: Triggers<S>;
}

export const LayerContext = React.createContext({});

export class RenderLayer<S extends Scope = {}, Props = {}, State = {}>
  extends React.Component<Props, State>
  implements Layer<S> {
  static contextType = LayerContext;
  public get status(): Status<S> {
    return this.container.getStatus();
  }
  public get triggers(): Triggers<S> {
    return this.container.getTriggers(this.logic);
  }

  private get container(): StatusContainer<S> {
    return this.context.container;
  }

  private get logic(): Logic<S> {
    return this.context.logic;
  }
}

export type LogicScaffold<S extends Scope> = {
  [F in keyof S]: (() => (target: any, methodName: string) => void) & {
    on: {
      [A in keyof S[F]["actions"]]: (() => (
        target: any,
        methodName: string
      ) => void) & {
        update: {
          [V in keyof S[F]["state"]]: (() => (
            target: any,
            methodName: string
          ) => void)
        };
      }
    };
  }
};

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

export function createLogicScaffold<S extends Scope>(
  strings: ScopeStrings<S>
): LogicScaffold<S> {
  return Object.keys(strings).reduce(
    (acc, feature) => ({
      ...(acc as any),
      [feature]: Object.assign(
        createExtractLogicDecorator((method, base) => {
          base.features = base.features || {};

          return {
            ...base,
            features: {
              ...(base.features as any),
              [feature]: method
            }
          };
        }),
        {
          on: strings[feature].actions.reduce(
            (acc, action) => ({
              ...(acc as any),
              [action]: Object.assign(
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
                      [state]: createExtractLogicDecorator((method, base) => {
                        base.reducers = base.reducers || ({} as Reducers<S>);
                        base.reducers[feature] = base.reducers[feature] || {};
                        (base.reducers[feature] as any)[action] =
                          (base.reducers[feature] as any)[action] || {};

                        return {
                          ...(base.reducers as any),
                          reducers: {
                            [feature]: {
                              ...(base.reducers[feature] as any),
                              [action]: {
                                ...((base.reducers[feature] as any)[
                                  action
                                ] as any),
                                [state]: method
                              }
                            }
                          }
                        };
                      })
                    }),
                    {}
                  )
                }
              )
            }),
            {}
          )
        }
      )
    }),
    {}
  ) as LogicScaffold<S>;
}

export function extractLogic<S extends Scope>(
  layers: LogicLayer<S>[],
  seed: Layer<S>
): PartialLogic<S>[] {
  return layers.map(layer => layer.extractLogic(seed));
}
