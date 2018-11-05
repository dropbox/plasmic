import * as React from "react";
import { Layer, EffectContext } from "./layer";
import { StatusContainer, SubscriptionHandle } from "./status_container";
import { ChildStatusContainer } from "./child_status_container";
import { ScopeStrings, Status, Scope, Logic } from "./types";
import { extractLogic } from "./decorators";
import { CompleteLogic } from "./complete_logic";

export const ReactEffectContext = React.createContext<EffectContext<Scope>>(
  {} as EffectContext<Scope>
);

export abstract class ReactContainerLayer<
  S extends Scope,
  InnerScope extends Partial<S> = S,
  Props = {},
  State = {}
> extends React.Component<Props, State> implements Layer<S> {
  static contextType = ReactEffectContext;

  private container: StatusContainer<S>;
  private subscription: SubscriptionHandle;

  protected abstract readonly strings: ScopeStrings<InnerScope>;
  protected abstract readonly logic: Layer<Partial<S>>[];
  protected readonly defaultStatus: Status<InnerScope>;

  protected abstract display(): JSX.Element | string | null;

  get status() {
    return this.container.getStatus();
  }

  get actions() {
    return this.container.getActions(this.getLogic());
  }

  get utilities() {
    return this.getLogic().utilities;
  }

  extractLogic() {
    return {};
  }

  private getLogic(): Logic<S> {
    const strings = this.getAllStrings();
    const layers = this.getAllLogicLayers();

    const partialLogic = extractLogic(layers, this);

    return new CompleteLogic(strings, partialLogic) as Logic<S>;
  }

  private getAllLogicLayers() {
    const { context, logic } = this;
    let layers = [...logic, this];

    if (context.layers) {
      layers = [...context.layers, ...layers];
    }

    return layers;
  }

  private getAllStrings() {
    const { context, strings } = this;
    let allStrings = strings;

    if (context.strings) {
      allStrings = {
        ...(context.strings as any),
        ...(allStrings as any)
      };
    }

    return allStrings;
  }

  componentWillMount() {
    this.initialize();
  }

  protected initialize() {
    const strings = this.getAllStrings();
    if (this.context.container) {
      this.container = new ChildStatusContainer<S>(
        strings,
        this.context.container,
        this.defaultStatus
      );
    } else {
      this.container = new StatusContainer<S>(strings, this.defaultStatus);
    }

    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.container.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <MappingLayer
        container={this.container}
        layers={this.getAllLogicLayers()}
        strings={this.getAllStrings()}
      >
        {this.display()}
      </MappingLayer>
    );
  }
}

function MappingLayer<S extends Scope>(
  props: EffectContext<S> & React.HTMLProps<{}>
) {
  return (
    <ReactEffectContext.Consumer>
      {context => (
        <ReactEffectContext.Provider
          value={{
            container: props.container,
            layers: props.layers,
            strings: props.strings as ScopeStrings<Scope>
          }}
        >
          {props.children}
        </ReactEffectContext.Provider>
      )}
    </ReactEffectContext.Consumer>
  );
}
