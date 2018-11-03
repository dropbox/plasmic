import * as React from "react";
import { Layer, LayerContext } from "./layer";
import { StatusContainer, SubscriptionHandle } from "./status_container";
import { Logic, ScopeStrings, Status, Scope } from "./types";
import { LogicLayer } from "./logic_layer";
import { LayerReactContext } from "./display_layer";

export type ContainerLayerProps<S extends Scope> = {
  scopeStrings: ScopeStrings<S>;
  status: Status<S>;
  logicLayers: LogicLayer<S>[];
};

export class ContainerLayer<S extends Scope>
  extends React.Component<ContainerLayerProps<S>>
  implements Layer<S> {
  private container: StatusContainer<S>;
  private logic: Logic<S>;
  private subscription: SubscriptionHandle;

  get status() {
    return this.container.getStatus();
  }

  get actions() {
    return this.container.getActions(this.logic);
  }

  constructor(props: ContainerLayerProps<S>, context: LayerContext<S>) {
    super(props, context);
    this.initialize();
  }

  componentWillReceiveProps(nextProps: ContainerLayerProps<S>) {
    if (this.props.status !== nextProps.status) {
      this.initialize();
    }
  }

  initialize() {
    this.container = new StatusContainer<S>(
      this.props.scopeStrings,
      this.props.status
    );

    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.container.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <LayerReactContext.Provider
        value={{
          container: this.container,
          layers: this.props.logicLayers,
          strings: this.props.scopeStrings as ScopeStrings<Scope>
        }}
      >
        {this.props.children}
      </LayerReactContext.Provider>
    );
  }
}
