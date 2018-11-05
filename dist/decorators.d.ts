import { Scope, PartialLogic, LogicScaffold, ScopeStrings } from "./types";
import { Layer } from "./layer";
export declare function createLogicDecorators<S extends Scope>(strings: ScopeStrings<S>): LogicScaffold<S>;
export declare function extractLogic<S extends Scope>(layers: Layer<S>[], seed: Layer<S>): PartialLogic<S>[];
