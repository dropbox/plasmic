import { StatusContainer } from "./status_container";
import { Scope, ScopeStrings, Status, Logic } from "./types";

export class ChildStatusContainer<S extends Scope> extends StatusContainer<S> {
  constructor(
    strings: ScopeStrings<S>,
    private parent: StatusContainer<S>,
    private _childStatus?: Partial<Status<S>>
  ) {
    super(strings, {} as Status<S>);
  }

  private get childStatus() {
    return this._childStatus || {};
  }

  getStatus() {
    return {
      ...(this.parent.getStatus() as any),
      ...(this.childStatus as any)
    };
  }

  setStatus(partial: Partial<Status<S>>) {
    Object.keys(partial).forEach(feature => {
      if (
        feature in partial &&
        feature in this.childStatus &&
        this.childStatus[feature] !== partial[feature]
      ) {
        this.childStatus[feature] = partial[feature];
      } else {
        this.parent.setStatus({
          [feature]: partial[feature]
        } as Partial<Status<S>>);
      }
    });
  }

  subscribe(listener: (s: Status<S>) => void) {
    const handle = super.subscribe(listener);
    const parentHandle = this.parent.subscribe(() => {
      listener(this.getStatus());
    });

    return {
      unsubscribe: () => {
        handle.unsubscribe();
        parentHandle.unsubscribe();
      }
    };
  }

  updateSubscribers(feature: keyof S) {
    if (!(feature in this.childStatus)) {
      this.parent.updateSubscribers(feature);
    }

    super.updateSubscribers(feature);
  }
}
