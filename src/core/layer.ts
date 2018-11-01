import { Scope, Status, Actions } from "./types";

export class Layer<S extends Scope> {
  readonly status: Status<S>;
  readonly actions: Actions<S>;
}
