import { Scope, Status, Actions, ScopeStrings } from "./types";
import { StatusContainer } from "./status_container";
import { LogicLayer } from "./logic_layer";

export class Layer<S extends Scope> {
  readonly status: Status<S>;
  readonly actions: Actions<S>;
}

export type LayerContext<S extends Scope> = {
  container: StatusContainer<S>;
  layers: LogicLayer<Partial<S>>[];
  strings: ScopeStrings<S>;
};
