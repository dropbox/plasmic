import * as React from "react";
import { Layer, EffectContext } from "./layer";
import { StatusContainer, SubscriptionHandle } from "./status_container";
import { ChildStatusContainer } from "./child_status_container";
import {
  ScopeStrings,
  Status,
  Scope,
  Logic,
  Utilities,
  Actions
} from "./types";
import { extractLogic, extractStrings } from "./logic_decorators";
import { CompleteLogic } from "./complete_logic";

export type ContainableLayer<
  S extends Scope,
  InnerScope extends Partial<S> = S
> = {
  readonly layers: Layer<Partial<S>>[];
  readonly defaultStatus: Status<InnerScope>;
} & Layer<S>;

export const ReactEffectContext = React.createContext<EffectContext<Scope>>(
  {} as EffectContext<Scope>
);

export type Snapshot<S extends Scope> = {
  actions: Actions<S>;
  status: Status<S>;
  utilities: Utilities<S>;
};

export type ReactContainerProps<
  S extends Scope,
  InnerScope extends Partial<S> = S
> = {
  layers: Layer<Partial<S>>[];
  defaultStatus?: Status<InnerScope>;
  children:
    | ((snapshot: Snapshot<S>) => JSX.Element | null)
    | JSX.Element
    | JSX.Element[]
    | null;
};

export function reactContainerLayer<
  T extends {
    new (...args: any[]): React.Component & ContainableLayer<S, InnerScope>;
  },
  S extends Scope = Scope,
  InnerScope extends Partial<S> = S
>(Constructor: T) {
  return class ReactContainerLayer extends Constructor implements Layer<S> {
    static contextType = ReactEffectContext;

    private container: StatusContainer<S>;
    private subscription: SubscriptionHandle;

    get strings() {
      return this.getAllStrings();
    }

    get status() {
      return this.container.getStatus();
    }

    get actions() {
      return this.container.getActions(this.getLogic());
    }

    get utilities() {
      return this.getLogic().utilities;
    }

    getAllStrings() {
      return (extractStrings(this.getAllLayers()) as any) as ScopeStrings<S>;
    }

    extractLogic(seed: Layer<S>) {
      return super.extractLogic ? super.extractLogic(seed) : {};
    }

    extractStrings() {
      if (super.extractStrings) {
        return super.extractStrings();
      }
      return {} as ScopeStrings<S>;
    }

    private getLogic(): Logic<S> {
      const strings = this.getAllStrings();
      const layers = this.getAllLayers();

      const partialLogic = extractLogic(layers, this);

      return new CompleteLogic(strings, partialLogic) as Logic<S>;
    }

    private getAllLayers() {
      const { context, layers } = this;
      let allLayers = [...layers, this];

      if (context.layers) {
        allLayers = [...context.layers, ...layers];
      }

      return allLayers;
    }

    componentWillMount() {
      this.initialize();
      super.componentWillMount && super.componentWillMount();
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
          layers={this.getAllLayers()}
          strings={this.getAllStrings()}
        >
          {super.render ? super.render() : this.props.children}
        </MappingLayer>
      );
    }
  };
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

export interface ReactContainerLayer<S extends Scope> {}

export class ReactContainerLayer<
  S extends Scope,
  InnerScope extends Partial<S> = S
> extends React.Component<ReactContainerProps<S, InnerScope>>
  implements Layer<S> {
  get defaultStatus(): Status<InnerScope> {
    return this.props.defaultStatus;
  }
  get layers(): Layer<Partial<S>>[] {
    return this.props.layers;
  }

  static contextType = ReactEffectContext;

  private container: StatusContainer<S>;
  private subscription: SubscriptionHandle;

  get strings() {
    return this.getAllStrings();
  }

  get status() {
    return this.container.getStatus();
  }

  get actions() {
    return this.container.getActions(this.getLogic());
  }

  get utilities() {
    return this.getLogic().utilities;
  }

  getAllStrings() {
    return (extractStrings(this.getAllLayers()) as any) as ScopeStrings<S>;
  }

  extractLogic(seed: Layer<S>) {
    return {};
  }

  extractStrings() {
    return {} as ScopeStrings<S>;
  }

  private getLogic(): Logic<S> {
    const strings = this.getAllStrings();
    const layers = this.getAllLayers();

    const partialLogic = extractLogic(layers, this);

    return new CompleteLogic(strings, partialLogic) as Logic<S>;
  }

  private getAllLayers() {
    const { context, layers } = this;
    let allLayers = [...layers, this];

    if (context.layers) {
      allLayers = [...context.layers, ...layers];
    }

    return allLayers;
  }

  componentWillMount() {
    this.initialize();
    super.componentWillMount && super.componentWillMount();
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
        layers={this.getAllLayers()}
        strings={this.getAllStrings()}
      >
        {typeof this.props.children === "function"
          ? this.props.children({
              actions: this.actions,
              status: this.status,
              utilities: this.utilities
            })
          : this.props.children}
      </MappingLayer>
    );
  }
}

export function composeContainer<
  S extends Scope,
  Props = {},
  InnerScope extends Partial<S> = S
>(
  fn: (snapshot: Snapshot<S>, props: Props) => JSX.Element | null,
  layers: Layer<Partial<S>>[],
  defaultStatus?: Status<InnerScope>
) {
  return (props: Props) => (
    <ReactContainerLayer defaultStatus={defaultStatus} layers={layers}>
      {(snapshot: Snapshot<S>) => fn(snapshot, props)}
    </ReactContainerLayer>
  );
}
