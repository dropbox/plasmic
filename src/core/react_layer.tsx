import * as React from "react";
import {
  Scope,
  Status,
  Actions,
  Logic,
  Utilities,
  ScopeStrings
} from "./types";
import { Layer } from "./layer";
import { StatusContainer } from "./status_container";
import { CompleteLogic } from "./complete_logic";
import { extractLogic } from "./logic_decorators";
import { ReactEffectContext, Snapshot } from "./react_container_layer";

export function reactLayer<
  S extends Scope,
  T extends { new (...args: any[]): React.Component & Layer<S> }
>(Constructor: T) {
  return class ReactLayer extends Constructor implements Layer<S> {
    static contextType = ReactEffectContext;
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

    extractLogic(seed: Layer<S>) {
      return super.extractLogic ? super.extractLogic(seed) : {};
    }

    private getLogic = (() => {
      let lastContainer = null;
      let lastLayers = null;
      let lastLogic = null;

      return (): Logic<S> => {
        if (
          this.context.layers !== lastLayers ||
          this.container !== lastContainer
        ) {
          lastLayers = this.context.layers;
          lastContainer = this.container;

          lastLogic = new CompleteLogic(
            this.context.strings,
            extractLogic(this.context.layers, this)
          );
        }

        return lastLogic;
      };
    })();
  };
}

export class ReactLayer<S extends Scope>
  extends React.Component<{
    children: (snapshot: Snapshot<S>) => JSX.Element | null;
  }>
  implements Layer<S> {
  static contextType = ReactEffectContext;
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

  extractLogic(seed: Layer<S>) {
    return {};
  }

  extractStrings() {
    return {} as ScopeStrings<S>;
  }
  private getLogic = (() => {
    let lastContainer = null;
    let lastLayers = null;
    let lastLogic = null;

    return (): Logic<S> => {
      if (
        this.context.layers !== lastLayers ||
        this.container !== lastContainer
      ) {
        lastLayers = this.context.layers;
        lastContainer = this.container;

        lastLogic = new CompleteLogic(
          this.context.strings,
          extractLogic(this.context.layers, this)
        );
      }

      return lastLogic;
    };
  })();
  render() {
    return this.props.children({
      actions: this.actions,
      status: this.status,
      utilities: this.utilities
    });
  }
}

export function composeReactLayer<S extends Scope, Props = {}>(
  fn: (snapshot: Snapshot<S>, props: Props) => JSX.Element | null
) {
  return (props: Props) => (
    <ReactLayer>{(snapshot: Snapshot<S>) => fn(snapshot, props)}</ReactLayer>
  );
}
