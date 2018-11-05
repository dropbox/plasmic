import { StatusContainer } from "./status_container";
import { Scope, ScopeStrings, Status } from "./types";
export declare class ChildStatusContainer<S extends Scope> extends StatusContainer<S> {
    private parent;
    private _childStatus?;
    constructor(strings: ScopeStrings<S>, parent: StatusContainer<S>, _childStatus?: Partial<Status<S>>);
    private readonly childStatus;
    getStatus(): any;
    setStatus(partial: Partial<Status<S>>): void;
    subscribe(listener: (s: Status<S>) => void): {
        unsubscribe: () => void;
    };
    updateSubscribers(feature: keyof S): void;
}
