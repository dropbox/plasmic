import {
  Scope,
  Status,
  Actions,
  ScopeStrings,
  Utilities,
  PartialLogic
} from "./types";
import { StatusContainer } from "./status_container";

export interface Layer<S extends Scope> {
  readonly status: Status<S>;
  readonly actions: Actions<S>;
  readonly utilities: Utilities<S>;
  extractLogic(seed: Layer<S>): PartialLogic<S>;
  extractStrings(): ScopeStrings<S>;
}

export type EffectContext<S extends Scope> = {
  container: StatusContainer<S>;
  layers: Layer<Partial<S>>[];
  strings: ScopeStrings<S>;
};
