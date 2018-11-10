import * as React from "react";
import {
  Scope,
  Status,
  Actions,
  Logic,
  Utilities,
  ScopeStrings
} from "./types";
import { Layer, RegionContext } from "./layer";
import { StatusContainer } from "./status_container";
import { CompleteLogic } from "./complete_logic";
import { extractLogic } from "./logic_decorators";
import { ReactRegionContext, Snapshot } from "./container_region";

function getLogic<S extends Scope>() {
  let lastContainer: StatusContainer<S> = null;
  let lastLayers: Layer<Partial<S>>[] = null;
  let lastLogic: Logic<S> = null;

  return (): Logic<S> => {
    const layers = this.context.layers as Layer<Partial<S>>[];

    if (
      lastLogic == null ||
      this.container !== lastContainer ||
      layers.length !== lastLayers.length ||
      layers.find((layer, index) => typeof layer !== typeof lastLayers[index])
    ) {
      lastLayers = layers;
      lastContainer = this.container;

      lastLogic = new CompleteLogic(
        this.context.strings,
        extractLogic(this.context.layers, this),
        this
      );
    }

    return lastLogic;
  };
}

export class Region<S extends Scope>
  extends React.Component<{
    children: (snapshot: Snapshot<S>) => JSX.Element | null;
  }>
  implements Layer<S> {
  static contextType = ReactRegionContext;
  context!: RegionContext<S>;
  public get status(): Status<S> {
    return this.container.getStatus();
  }

  public get actions(): Actions<S> {
    return this.container.getActions(this.getLogic());
  }

  public get utilities(): Utilities<S> {
    return this.getLogic().utilities;
  }

  private get container(): StatusContainer<S> {
    return this.context.container;
  }

  get seed() {
    return this;
  }

  extractLogic(seed: Layer<S>) {
    return {};
  }

  extractStrings() {
    return {} as ScopeStrings<S>;
  }
  private getLogic = (() => {
    return getLogic.call(this);
  })();
  render() {
    return this.props.children({
      actions: this.actions,
      status: this.status,
      utilities: this.utilities
    });
  }
}

export function region<
  S extends Scope,
  T extends { new (...args: any[]): React.Component & Layer<S>; name: string }
>(Constructor: T) {
  return class DecoratedRegion extends Constructor implements Layer<S> {
    static contextType = ReactRegionContext;
    static displayName = Constructor.name;
    context!: RegionContext<S>;

    get status(): Status<S> {
      return this.container.getStatus();
    }

    get actions(): Actions<S> {
      return this.container.getActions(this.getLogic());
    }

    get container() {
      return this.context.container;
    }

    get utilities(): Utilities<S> {
      return this.getLogic().utilities;
    }

    extractLogic(seed: Layer<S>) {
      return super.extractLogic
        ? super.extractLogic(seed)
        : Region.prototype.extractLogic.call(this, seed);
    }

    extractStrings() {
      return super.extractStrings
        ? super.extractStrings()
        : Region.prototype.extractStrings.call(this);
    }

    getLogic = (() => {
      return getLogic.call(this);
    })();
  };
}

export function composeRegion<S extends Scope, Props = {}>(
  fn: (snapshot: Snapshot<S>, props: Props) => JSX.Element | null
) {
  return (props: Props) => (
    <Region>{(snapshot: Snapshot<S>) => fn(snapshot, props)}</Region>
  );
}
