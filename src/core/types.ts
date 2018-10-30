import { any } from "prop-types";

export type Value = any;

export type Action = (...args: any[]) => void;

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

export type Reducer<
  V extends Value = Value,
  A extends Action = Action
> = A extends (v: V, ...a: any[]) => V ? V : never;

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
  features: Observers<S>;
};

export type PartialLogic<S extends Scope> = {
  reducers?: PartialReducers<S>;
  actions?: PartialActions<S>;
  features?: Partial<Observers<S>>;
};

export type LogicDecorator<V extends Value, A extends Action = null> = ((
  context?: {
    value: V;
    action: A;
  }
) => (target: any, methodName: string) => void);

export type LogicScaffold<S extends Scope> = {
  [F in keyof S]: {
    observe: LogicDecorator<S[F]["state"]>;
    observeOn: {
      [A in keyof S[F]["actions"]]: LogicDecorator<
        S[F]["state"],
        S[F]["actions"][A]
      > & {
        update: {
          [V in keyof S[F]["state"]]: LogicDecorator<
            S[F]["state"][V],
            S[F]["actions"][A]
          >
        };
      }
    };
  }
};
