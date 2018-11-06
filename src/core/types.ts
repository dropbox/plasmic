export type Value = any;

export type Action<T extends Value[] = Value[]> = (...args: T) => void;

export type Utility<T extends Value[] = Value[], R extends Value = void> = (
  ...args: T
) => R;

type ActionArgs<T> = T extends Action<infer U> ? U : never;

export type Shape<T> = {
  [key: string]: T;
};

export type ActionShape = Shape<Action>;
export type StatusShape = Shape<Value>;
export type UtilityShape = Shape<Utility>;

export type Feature<
  A extends ActionShape = ActionShape,
  S extends StatusShape = StatusShape,
  U extends UtilityShape = UtilityShape
> = {
  actions: A;
  status: S;
  utilities: U;
};

export type FeatureStrings<F extends Feature> = {
  actions: (keyof F["actions"])[];
  status: (keyof F["status"])[];
  utilities: (keyof F["utilities"])[];
};

export type Scope = {
  [key: string]: Feature;
};

export type ScopeStrings<S extends Scope> = {
  [F in keyof S]: FeatureStrings<S[F]>
};

export type Status<S extends Scope> = { [K in keyof S]: S[K]["status"] };

export type Actions<S extends Scope> = {
  [F in keyof S]: { [A in keyof S[F]["actions"]]: S[F]["actions"][A] }
};

export type Utilities<S extends Scope> = {
  [F in keyof S]: { [U in keyof S[F]["utilities"]]: S[F]["utilities"][U] }
};

export type PartialActions<S extends Scope> = {
  [F in keyof S]?: { [A in keyof S[F]["actions"]]?: S[F]["actions"][A] }
};

export type PartialUtilities<S extends Scope> = {
  [F in keyof S]?: { [U in keyof S[F]["utilities"]]?: S[F]["utilities"][U] }
};

export type Observer<S extends StatusShape = StatusShape> = (
  previous: S
) => void;

export type Observers<S extends Scope> = {
  [F in keyof S]: Observer<S[F]["status"]>
};

export type Reducer<V extends Value = Value, A extends Action = Action> = (
  v: V,
  ...a: ActionArgs<A>
) => V;

export type Reducers<S extends Scope> = {
  [F in keyof S]: {
    [A in keyof S[F]["actions"]]: {
      [V in keyof S[F]["status"]]: Reducer<
        S[F]["status"][V],
        S[F]["actions"][A]
      >
    }
  }
};

export type PartialReducers<S extends Scope> = {
  [F in keyof S]?: {
    [A in keyof S[F]["actions"]]?: {
      [V in keyof S[F]["status"]]?: Reducer<
        S[F]["status"][V],
        S[F]["actions"][A]
      >
    }
  }
};

export type Logic<S extends Scope> = {
  reducers: Reducers<S>;
  actions: Actions<S>;
  observers: Observers<S>;
  utilities: Utilities<S>;
};

export type PartialLogic<S extends Scope> = {
  reducers?: PartialReducers<S>;
  actions?: PartialActions<S>;
  observers?: Partial<Observers<S>>;
  utilities?: PartialUtilities<S>;
};

export type MethodDecorator<Signature> = (
  target: any,
  method: string,
  descriptor: TypedPropertyDescriptor<Signature>
) => void;

export type LogicDecorators<S extends Scope> = {
  [F in keyof S]: {
    observe: MethodDecorator<(previousFeatureStatus: S[F]["status"]) => void>;
    on: {
      [A in keyof S[F]["actions"]]: {
        observe: MethodDecorator<
          (
            previousFeatureStatus: S[F]["status"],
            ...args: ActionArgs<S[F]["actions"][A]>
          ) => void
        >;
        update: {
          [V in keyof S[F]["status"]]: MethodDecorator<
            (
              previousValue: S[F]["status"][V],
              ...args: ActionArgs<S[F]["actions"][A]>
            ) => S[F]["status"][V]
          >
        };
      }
    };
    provide: {
      [U in keyof S[F]["utilities"]]: MethodDecorator<S[F]["utilities"][U]>
    };
  }
};
