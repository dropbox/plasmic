import * as React from "react";
import { Layer, LayerContext } from "./layer";
import { ScopeStrings, Status, Scope } from "./types";
export declare const LayerReactContext: React.Context<LayerContext<Scope>>;
export declare abstract class ContainerLayer<S extends Scope, InnerScope extends Partial<S> = S, Props = {}, State = {}> extends React.Component<Props, State> implements Layer<S> {
    static contextType: React.Context<LayerContext<Scope>>;
    private container;
    private subscription;
    protected abstract readonly strings: ScopeStrings<InnerScope>;
    protected abstract readonly logic: Layer<Partial<S>>[];
    protected readonly defaultStatus: Status<InnerScope>;
    protected abstract display(): JSX.Element | string | null;
    readonly status: Status<S>;
    readonly actions: import("./types").Actions<S>;
    readonly utilities: import("./types").Utilities<S>;
    extractLogic(): {};
    private getLogic;
    private getAllLogicLayers;
    private getAllStrings;
    componentWillMount(): void;
    protected initialize(): void;
    render(): JSX.Element;
}
