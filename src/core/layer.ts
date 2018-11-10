import {
  Scope,
  Status,
  Actions,
  ScopeStrings,
  Utilities,
  PartialLogic
} from "./types";
import { StatusContainer } from "./status_container";

export class Layer<S extends Scope> {
  readonly seed: Layer<S>;

  get status(): Status<S> {
    return this.seed.status;
  }
  get actions(): Actions<S> {
    return this.seed.actions;
  }
  get utilities(): Utilities<S> {
    return this.seed.utilities;
  }
  extractLogic(seed: Layer<S>): PartialLogic<S> {
    return {};
  }
  extractStrings(): ScopeStrings<S> {
    return {} as ScopeStrings<S>;
  }
}

export type RegionContext<S extends Scope> = {
  container: StatusContainer<S>;
  layers: Layer<Partial<S>>[];
  strings: ScopeStrings<S>;
};
