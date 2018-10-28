import { Scope, Status, ScopeStrings, Logic, Triggers, Value } from "./types";

export type SubscriptionHandle = { unsubscribe: () => void };

export class StatusContainer<S extends Scope> {
  private listeners: ((s: Status<S>) => void)[] = [];

  constructor(private strings: ScopeStrings<S>, private status: Status<S>) {}
  public getStatus(): Status<S> {
    return this.status;
  }
  public subscribe(listener: (s: Status<S>) => void): SubscriptionHandle {
    this.listeners.push(listener);
    return {
      unsubscribe: () => {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
      }
    };
  }
  public getTriggers(logic: Logic<S>): Triggers<S> {
    return Object.keys(this.strings).reduce(
      (acc, feature) => ({
        ...(acc as any),
        [feature]: this.strings[feature].actions.reduce(
          (acc, action) => ({
            ...(acc as any),
            [action]: (v: Value) => {
              const previous = this.status;

              this.status = {
                ...(this.status as any),
                [feature]: this.strings[feature].state.reduce(
                  (acc, state) => ({
                    ...(acc as any),
                    [state]: (logic.reducers[feature][action][state] as any)(
                      this.status[feature][state],
                      v
                    )
                  }),
                  this.status[feature]
                )
              };

              logic.actions[feature][action](v);
              logic.features[feature](previous[feature]);
              this.updateSubscribers();
            }
          }),
          {}
        )
      }),
      {} as Triggers<S>
    );
  }

  updateSubscribers() {
    this.listeners.forEach(listener => listener(this.getStatus()));
  }
}
