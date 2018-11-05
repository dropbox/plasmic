import * as React from "react";
import { Scope, Status, Actions, Logic, Utilities } from "./types";
import { Layer, LayerContext } from "./layer";
import { StatusContainer } from "./status_container";
import { CompleteLogic } from "./complete_logic";
import { extractLogic } from "./decorators";
import { LayerReactContext } from "./container_layer";

export class DisplayLayer<S extends Scope = {}, Props = {}, State = {}>
  extends React.Component<Props, State>
  implements Layer<S> {
  static contextType = LayerReactContext;
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

  extractLogic() {
    return {};
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
}
