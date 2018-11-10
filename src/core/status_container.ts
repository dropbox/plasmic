import {
  Scope,
  Status,
  ScopeStrings,
  Logic,
  Actions,
  ActionArgs,
  ValueReducer
} from "./types";
import { log } from "util";

export type SubscriptionHandle = { unsubscribe: () => void };

export class StatusContainer<S extends Scope> {
  private listeners: ((s: Status<S>) => void)[] = [];
  private _status: Status<S>;

  constructor(
    private strings: ScopeStrings<S>,
    private defaultStatus: Status<S>
  ) {
    this._status = defaultStatus;
  }

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
            [action]: (
              ...args: ActionArgs<
                S[keyof S]["actions"][keyof S[keyof S]["actions"]]
              >
            ) => {
              const previous = {
                ...(this.getStatus() as any)
              };

              this.setStatus({
                [feature]: {
                  ...previous[feature],
                  ...(logic.statusReducers[feature][action](
                    this.strings[feature].status.reduce(
                      (acc, state) => ({
                        ...(acc as any),
                        [state]: (logic.valueReducers[feature][action][
                          state
                        ] as ValueReducer)(
                          this.getStatus()[feature][state],
                          ...args
                        )
                      }),
                      this.getStatus()[feature]
                    ),
                    ...args
                  ) as any)
                }
              } as Partial<Status<S>>);

              logic.actions[feature][action](previous[feature], ...args);
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
