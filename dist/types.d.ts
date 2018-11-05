export declare type Value = any;
export declare type Action<T extends Value[] = Value[]> = (...args: T) => void;
export declare type Utility<T extends Value[] = Value[], R extends Value = void> = (...args: T) => R;
declare type ActionArgs<T> = T extends Action<infer U> ? U : never;
export declare type Shape<T> = {
    [key: string]: T;
};
export declare type ActionShape = Shape<Action>;
export declare type StatusShape = Shape<Value>;
export declare type UtilityShape = Shape<Utility>;
export declare type Feature<A extends ActionShape = ActionShape, S extends StatusShape = StatusShape, U extends UtilityShape = UtilityShape> = {
    actions: A;
    state: S;
    utilities: U;
};
export declare type FeatureStrings<A extends ActionShape = ActionShape, S extends StatusShape = StatusShape, U extends UtilityShape = UtilityShape> = {
    actions: (keyof A)[];
    state: (keyof S)[];
    utilities: (keyof U)[];
};
export declare type Scope = {
    [key: string]: Feature;
};
export declare type ScopeStrings<S extends Scope> = {
    [F in keyof S]: FeatureStrings<S[F]["actions"], S[F]["state"], S[F]["utilities"]>;
};
export declare type Status<S extends Scope> = {
    [K in keyof S]: S[K]["state"];
};
export declare type Actions<S extends Scope> = {
    [F in keyof S]: {
        [A in keyof S[F]["actions"]]: S[F]["actions"][A];
    };
};
export declare type Utilities<S extends Scope> = {
    [F in keyof S]: {
        [U in keyof S[F]["utilities"]]: S[F]["utilities"][U];
    };
};
export declare type PartialActions<S extends Scope> = {
    [F in keyof S]?: {
        [A in keyof S[F]["actions"]]?: S[F]["actions"][A];
    };
};
export declare type PartialUtilities<S extends Scope> = {
    [F in keyof S]?: {
        [U in keyof S[F]["utilities"]]?: S[F]["utilities"][U];
    };
};
export declare type Observer<S extends StatusShape = StatusShape> = (previous: S) => void;
export declare type Observers<S extends Scope> = {
    [F in keyof S]: Observer<S[F]["state"]>;
};
export declare type Reducer<V extends Value = Value, A extends Action = Action> = (v: V, ...a: ActionArgs<A>) => V;
export declare type Reducers<S extends Scope> = {
    [F in keyof S]: {
        [A in keyof S[F]["actions"]]: {
            [V in keyof S[F]["state"]]: Reducer<S[F]["state"][V], S[F]["actions"][A]>;
        };
    };
};
export declare type PartialReducers<S extends Scope> = {
    [F in keyof S]?: {
        [A in keyof S[F]["actions"]]?: {
            [V in keyof S[F]["state"]]?: Reducer<S[F]["state"][V], S[F]["actions"][A]>;
        };
    };
};
export declare type Logic<S extends Scope> = {
    reducers: Reducers<S>;
    actions: Actions<S>;
    observers: Observers<S>;
    utilities: Utilities<S>;
};
export declare type PartialLogic<S extends Scope> = {
    reducers?: PartialReducers<S>;
    actions?: PartialActions<S>;
    observers?: Partial<Observers<S>>;
    utilities?: PartialUtilities<S>;
};
export declare type ObserverDecorator<F, Feat extends Feature> = ((comment?: {
    feature: F;
    signature: (previousState: Feat["state"]) => void;
}) => (t: any, m: string) => void);
export declare type ActionDecorator<F, A, Feat extends Feature, Act extends Action> = ((comment?: {
    feature: F;
    action: A;
    signature: (previousState: Feat["state"], ...a: ActionArgs<Act>) => void;
}) => (t: any, m: string) => void);
export declare type ReducerDecorator<F, A, V, Act extends Action, Val extends Value> = ((comment?: {
    feature: F;
    action: A;
    status: V;
    signature: (currentValue: Val, ...a: ActionArgs<Act>) => Val;
}) => (t: any, m: string) => void);
export declare type UtilityDecorator<F, U, Util extends Utility> = ((comment?: {
    feature: F;
    utility: U;
    signature: Util;
}) => (t: any, m: string) => void);
export declare type LogicScaffold<S extends Scope> = {
    [F in keyof S]: {
        observe: ObserverDecorator<F, S[F]>;
        on: {
            [A in keyof S[F]["actions"]]: {
                observe: ActionDecorator<F, A, S[F], S[F]["actions"][A]>;
                update: {
                    [V in keyof S[F]["state"]]: ReducerDecorator<F, A, V, S[F]["actions"][A], S[F]["state"][V]>;
                };
            };
        };
        provides: {
            [U in keyof S[F]["utilities"]]: UtilityDecorator<F, U, S[F]["utilities"][U]>;
        };
    };
};
export {};
