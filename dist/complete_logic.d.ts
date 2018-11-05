import { Scope, Logic, Reducers, Actions, Observers, Value, ScopeStrings, PartialLogic, Utilities } from "./types";
export declare class CompleteLogic<S extends Scope> implements Logic<S> {
    private strings;
    reducers: Reducers<S>;
    actions: Actions<S>;
    observers: Observers<S>;
    utilities: Utilities<S>;
    static noop(): void;
    static noopReducer(value: Value): any;
    static utilityMessage(feature: string, utility: string): string;
    static createThrowsUtility(message: string): () => never;
    constructor(strings: ScopeStrings<S>, partials: PartialLogic<S>[]);
    private completeReducers;
    private completeActions;
    private completeObservers;
    completeUtilities(partials: PartialLogic<S>[]): any;
}
