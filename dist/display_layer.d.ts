import * as React from "react";
import { Scope, Status, Actions, Utilities } from "./types";
import { Layer, LayerContext } from "./layer";
export declare class DisplayLayer<S extends Scope = {}, Props = {}, State = {}> extends React.Component<Props, State> implements Layer<S> {
    static contextType: React.Context<LayerContext<Scope>>;
    readonly status: Status<S>;
    readonly actions: Actions<S>;
    readonly utilities: Utilities<S>;
    private readonly container;
    extractLogic(): {};
    private getLogic;
}
