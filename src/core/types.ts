export type Value = any;

export type Action<T extends any[] = any[]> = (...args: T) => void;

export type Utility<T extends any[] = any[], U extends Value = Value> = (
  ...args: T
) => U;

type ActionArgs<T> = T extends Action<infer U> ? U : never;

type UtilityArgs<T> = T extends Utility<infer U> ? U : never;

type UtilityReturn<T> = T extends Utility<infer U, infer V> ? V : never;

export type ActionShape = {
  [key: string]: Action;
};

export type StateShape = {
  [key: string]: Value;
};

export type UtilityShape = {
  [key: string]: Utility;
};

export type Feature<
  A extends ActionShape = ActionShape,
  S extends StateShape = StateShape,
  U extends UtilityShape = UtilityShape
> = {
  actions: A;
  state: S;
  utilities: U;
};

export type FeatureStrings<
  A extends ActionShape = ActionShape,
  S extends StateShape = StateShape,
  U extends UtilityShape = UtilityShape
> = {
  actions: (keyof A)[];
  state: (keyof S)[];
  utilities: (keyof U)[];
};

export type Scope = {
  [key: string]: Feature;
};

export type ScopeStrings<S extends Scope> = {
  [F in keyof S]: FeatureStrings<S[F]["actions"], S[F]["state"]>
};

export type Status<S extends Scope> = { [K in keyof S]: S[K]["state"] };

export type Actions<S extends Scope> = {
  [F in keyof S]: { [A in keyof S[F]["actions"]]: S[F]["actions"][A] }
};

export type PartialActions<S extends Scope> = {
  [F in keyof S]?: { [A in keyof S[F]["actions"]]?: S[F]["actions"][A] }
};

export type Observer<S extends StateShape = StateShape> = (previous: S) => void;

export type Observers<S extends Scope> = {
  [F in keyof S]: Observer<S[F]["state"]>
};

export type Reducer<V extends Value = Value, A extends Action = Action> = (
  v: V,
  ...a: ActionArgs<A>
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
      [V in keyof S[F]["state"]]?: Reducer<S[F]["state"][V], S[F]["actions"][A]>
    }
  }
};

export type Logic<S extends Scope> = {
  reducers: Reducers<S>;
  actions: Actions<S>;
  observers: Observers<S>;
};

export type PartialLogic<S extends Scope> = {
  reducers?: PartialReducers<S>;
  actions?: PartialActions<S>;
  observers?: Partial<Observers<S>>;
};

export type ObserverDecorator<F, Feat extends Feature> = ((
  comment?: {
    feature: F;
    signature: (previousState: Feat["state"]) => void;
  }
) => (t: any, m: string) => void);

export type ActionDecorator<F, A, Feat extends Feature, Act extends Action> = ((
  comment?: {
    feature: F;
    action: A;
    signature: (previousState: Feat["state"], ...a: ActionArgs<Act>) => void;
  }
) => (t: any, m: string) => void);

export type ReducerDecorator<
  F,
  A,
  V,
  Act extends Action,
  Val extends Value
> = ((
  comment?: {
    feature: F;
    action: A;
    status: V;
    signature: (currentValue: Val, ...a: ActionArgs<Act>) => Val;
  }
) => (t: any, m: string) => void);

export type UtilityDecorator<F, U, Util extends Utility> = ((
  comment?: {
    feature: F;
    utility: U;
    signature: (...a: UtilityArgs<Util>) => UtilityReturn<Util>;
  }
) => (t: any, m: string) => void);

export type LogicScaffold<S extends Scope> = {
  [F in keyof S]: {
    observe: ObserverDecorator<F, S[F]>;
    on: {
      [A in keyof S[F]["actions"]]: {
        observe: ActionDecorator<F, A, S[F], S[F]["actions"][A]>;
        update: {
          [V in keyof S[F]["state"]]: ReducerDecorator<
            F,
            A,
            V,
            S[F]["actions"][A],
            S[F]["state"][V]
          >
        };
      }
    };
    handle: {
      [U in keyof S[F]["utilities"]]: UtilityDecorator<
        F,
        U,
        S[F]["utilities"][U]
      >
    };
  }
};
