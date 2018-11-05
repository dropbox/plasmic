import { Scope, Status, ScopeStrings, Logic, Actions } from "./types";
export declare type SubscriptionHandle = {
    unsubscribe: () => void;
};
export declare class StatusContainer<S extends Scope> {
    private strings;
    private _status;
    private listeners;
    constructor(strings: ScopeStrings<S>, _status: Status<S>);
    getStatus(): Status<S>;
    setStatus(partial: Partial<Status<S>>): void;
    subscribe(listener: (s: Status<S>) => void): SubscriptionHandle;
    getActions(logic: Logic<S>): Actions<S>;
    updateSubscribers(feature: keyof S): void;
}
