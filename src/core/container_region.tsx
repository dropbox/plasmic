import * as React from "react";
import { Layer, RegionContext } from "./layer";
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

export type ContainerOptions<S extends Scope, Props = {}> = {
  readonly layers: Layer<Partial<S>>[] | ((p: Props) => Layer<Partial<S>>[]);
  readonly defaultStatus: Status<S> | ((p: Props) => Status<S>);
  layerShouldInit?: (props: Props, nextProps: Props) => boolean;
  display?(snapshot: Snapshot<S>, props: Props): React.ReactNode;
};

export type Snapshot<S extends Scope> = {
  actions: Actions<S>;
  status: Status<S>;
  utilities: Utilities<S>;
};

export type ContainerRegionProps<
  S extends Scope,
  Props = {}
> = ContainerOptions<S, Props> & {
  innerProps: Props;
};

export const ReactRegionContext = React.createContext<RegionContext<Scope>>(
  {} as RegionContext<Scope>
);

function getLogic<S extends Scope>() {
  let lastLayers: Layer<Partial<S>>[] = null;
  let lastLogic: Logic<S> = null;

  return (): Logic<S> => {
    const strings = this.getAllStrings();
    const layers = this.getAllLayers();
    const changed =
      lastLogic === null ||
      lastLayers.length !== layers.length ||
      layers.find((layer, index) => typeof layer !== typeof lastLayers[index]);

    if (changed) {
      lastLayers = layers;

      const partialLogic = extractLogic<S>(layers, this);

      lastLogic = new CompleteLogic<S>(strings, partialLogic, this) as Logic<S>;
    }

    return lastLogic;
  };
}

export class ContainerRegion<S extends Scope, Props = {}>
  extends React.Component<ContainerRegionProps<S, Props>>
  implements Layer<S>, ContainerOptions<S, ContainerRegionProps<S, Props>> {
  get defaultStatus() {
    return (props: ContainerRegionProps<S, Props>) =>
      typeof props.defaultStatus === "function"
        ? props.defaultStatus(props.innerProps)
        : props.defaultStatus;
  }

  get layers() {
    return (props: ContainerRegionProps<S, Props>) =>
      typeof props.layers === "function"
        ? props.layers(props.innerProps)
        : props.layers;
  }

  static contextType = ReactRegionContext;
  context!: RegionContext<S>;

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

  get seed() {
    return this;
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

  getLogic = (() => {
    return getLogic.apply(this);
  })();

  getAllLayers() {
    const { context } = this;
    const layers = this.layers(this.props);

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

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  componentWillReceiveProps(nextProps: ContainerRegionProps<S, Props>) {
    if (this.layerShouldInit(nextProps)) {
      this.initialize(nextProps);
    }
  }

  layerShouldInit(nextProps: ContainerRegionProps<S, Props>) {
    return nextProps.layerShouldInit
      ? nextProps.layerShouldInit(this.props.innerProps, nextProps.innerProps)
      : false;
  }

  warnConsistency(strings: ScopeStrings<S>, status: Status<S>) {
    const statusFeatures = Object.keys(status);
    const stringFeatures = Object.keys(strings);
    let badFeature =
      statusFeatures.find(feature => stringFeatures.indexOf(feature) === -1) ||
      null;

    if (badFeature !== null) {
      console.warn(`Feature ${badFeature} is inconsistent in:`, this);
    }
  }

  initialize(props?: ContainerRegionProps<S, Props>) {
    let defaultStatus = this.defaultStatus(props || this.props);

    const strings = this.getAllStrings();

    if (this.context.container) {
      this.container = new ChildStatusContainer<S>(
        strings,
        this.context.container,
        defaultStatus
      );
    } else {
      this.container = new StatusContainer<S>(strings, defaultStatus);
    }

    this.warnConsistency(strings, this.container.getStatus());

    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.container.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <ReactRegionContext.Provider
        value={{
          container: this.container,
          layers: this.getAllLayers() as Layer<Partial<Scope>>[],
          strings: this.getAllStrings() as ScopeStrings<Scope>
        }}
      >
        {this.props.display
          ? this.props.display(
              {
                actions: this.actions,
                utilities: this.utilities,
                status: this.status
              },
              this.props.innerProps
            )
          : this.props.children}
      </ReactRegionContext.Provider>
    );
  }
}

export function containerRegion<
  T extends {
    new (...args: any[]): React.Component<Props> &
      ContainerOptions<S, Props> &
      Layer<S>;
    name: string;
  },
  S extends Scope = Scope,
  Props = {}
>(Constructor: T) {
  class DecoratedContainerRegion extends Constructor
    implements Layer<S>, ContainerOptions<S, Props> {
    static displayName = Constructor.name;
    _defaultStatus: Status<S> | ((p: Props) => Status<S>);
    _layers: Layer<Partial<S>>[] | ((p: Props) => Layer<Partial<S>>[]);

    get defaultStatus() {
      const defaultStatus = super.defaultStatus || this._defaultStatus;

      return (props: Props) =>
        typeof defaultStatus === "function"
          ? defaultStatus(props)
          : defaultStatus;
    }

    set defaultStatus(status: Status<S> | ((p: Props) => Status<S>)) {
      this._defaultStatus = status;
    }

    get layers() {
      const layers = super.layers || this._layers;

      return (props: Props) =>
        typeof layers === "function" ? layers(props) : layers;
    }

    set layers(
      layers: Layer<Partial<S>>[] | ((p: Props) => Layer<Partial<S>>[])
    ) {
      this._layers = layers;
    }

    static contextType = ReactRegionContext;
    context!: RegionContext<S>;

    container: StatusContainer<S>;
    subscription: SubscriptionHandle;

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

    get seed() {
      return this;
    }

    getAllStrings(): ScopeStrings<S> {
      return ContainerRegion.prototype.getAllStrings.call(this);
    }

    extractLogic(seed: Layer<S>) {
      return super.extractLogic
        ? super.extractLogic(seed)
        : ContainerRegion.prototype.extractLogic.call(this, seed);
    }

    extractStrings(): ScopeStrings<S> {
      if (super.extractStrings) {
        return super.extractStrings();
      }
      return ContainerRegion.prototype.extractStrings.call(
        this
      ) as ScopeStrings<S>;
    }

    getLogic = (() => {
      return getLogic.apply(this);
    })();

    getAllLayers(): Layer<Partial<S>>[] {
      return ContainerRegion.prototype.getAllLayers.call(this);
    }

    componentWillMount() {
      this.initialize();
      super.componentWillMount && super.componentWillMount();
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    componentWillReceiveProps(nextProps: Props) {
      if (
        !!this.layerShouldInit &&
        this.layerShouldInit(this.props, nextProps)
      ) {
        this.initialize(nextProps);
      }
    }

    warnConsistency() {
      ContainerRegion.prototype.warnConsistency.apply(this, arguments);
    }

    initialize(props?: Props) {
      ContainerRegion.prototype.initialize.apply(this, arguments);
    }

    render() {
      return (
        <ReactRegionContext.Provider
          value={{
            container: this.container,
            layers: this.getAllLayers(),
            strings: this.getAllStrings() as ScopeStrings<Scope>
          }}
        >
          {super.render ? super.render() : this.props.children}
        </ReactRegionContext.Provider>
      );
    }
  }

  return DecoratedContainerRegion;
}

export function composeContainerRegion<S extends Scope, Props = {}>(
  containableLayer: ContainerOptions<S, Props>
) {
  return (props: Props) => {
    const {
      defaultStatus,
      layers,
      layerShouldInit,
      display
    } = containableLayer;
    return (
      <ContainerRegion
        defaultStatus={defaultStatus}
        layers={layers}
        innerProps={props}
        layerShouldInit={layerShouldInit}
        display={(snapshot: Snapshot<S>) =>
          display ? display(snapshot, props) : null
        }
      />
    );
  };
}
