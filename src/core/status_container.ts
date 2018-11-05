import {
  Scope,
  Status,
  ScopeStrings,
  Logic,
  Actions,
  Value,
  Reducer
} from "./types";
import { log } from "util";

export type SubscriptionHandle = { unsubscribe: () => void };

export class StatusContainer<S extends Scope> {
  private listeners: ((s: Status<S>) => void)[] = [];

  constructor(private strings: ScopeStrings<S>, private _status: Status<S>) {}

  public getStatus(): Status<S> {
    return this._status;
  }
  public setStatus(partial: Partial<Status<S>>) {
    Object.keys(partial).forEach(feature => {
      if (feature in partial && this._status[feature] !== partial[feature]) {
        this._status[feature] = partial[feature];
      }
    });
  }
  public subscribe(listener: (s: Status<S>) => void): SubscriptionHandle {
    this.listeners.push(listener);
    return {
      unsubscribe: () => {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
      }
    };
  }
  public getActions(logic: Logic<S>): Actions<S> {
    return Object.keys(this.strings).reduce(
      (acc, feature) => ({
        ...(acc as any),
        [feature]: this.strings[feature].actions.reduce(
          (acc, action) => ({
            ...(acc as any),
            [action]: (...values: Value[]) => {
              const previous = {
                ...(this.getStatus() as any)
              };

              this.setStatus({
                [feature]: this.strings[feature].status.reduce(
                  (acc, state) => ({
                    ...(acc as any),
                    [state]: (logic.reducers[feature][action][
                      state
                    ] as Reducer)(this.getStatus()[feature][state], ...values)
                  }),
                  this.getStatus()[feature]
                )
              } as Partial<Status<S>>);

              logic.actions[feature][action](previous[feature], ...values);
              logic.observers[feature](previous[feature]);

              this.updateSubscribers(feature);
            }
          }),
          {}
        )
      }),
      {} as Actions<S>
    );
  }

  updateSubscribers(feature: keyof S) {
    this.listeners.forEach(listener => listener(this.getStatus()));
  }
}
