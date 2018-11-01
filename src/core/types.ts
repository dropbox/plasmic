export type Value = any;

export type Action<T extends any[] = any[]> = (...args: T) => void;

export type Service<T extends any[] = any[], U extends Value = Value> = (
  ...args: T
) => U;
type ActionArgs<T> = T extends Action<infer U> ? U : never;

export type ActionShape = {
  [key: string]: Action;
};

export type StateShape = {
  [key: string]: Value;
};

export type Feature<
  A extends ActionShape = ActionShape,
  S extends StateShape = StateShape
> = {
  actions: A;
  state: S;
};

export type FeatureStrings<
  A extends ActionShape = ActionShape,
  S extends StateShape = StateShape
> = {
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

export type LogicDecorator<
  F,
  A,
  V,
  Val extends Value,
  Act extends Action = null,
  Ret extends Value = void
> = ((
  comment?: {
    feature: F;
    action: A;
    status: V;
    signature: Act extends null
      ? (value: Val) => Ret
      : (value: Val, ...a: ActionArgs<Act>) => Ret;
  }
) => (t: any, m: string) => void);

export type LogicScaffold<S extends Scope> = {
  [F in keyof S]: {
    observe: LogicDecorator<F, null, null, S[F]["state"]>;
    on: {
      [A in keyof S[F]["actions"]]: {
        observe: LogicDecorator<F, A, null, S[F]["state"], S[F]["actions"][A]>;
        update: {
          [V in keyof S[F]["state"]]: LogicDecorator<
            F,
            A,
            V,
            S[F]["state"][V],
            S[F]["actions"][A],
            S[F]["state"][V]
          >
        };
      }
    };
  }
};
