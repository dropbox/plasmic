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
