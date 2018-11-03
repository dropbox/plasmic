import * as React from "react";
import { Scope, Status, Actions, Logic } from "./types";
import { Layer, LayerContext } from "./layer";
import { StatusContainer } from "./status_container";
import { CompleteLogic } from "./complete_logic";
import { extractLogic } from "./logic_layer";

export const LayerReactContext = React.createContext<LayerContext<Scope>>(
  {} as LayerContext<Scope>
);

export class DisplayLayer<S extends Scope = {}, Props = {}, State = {}>
  extends React.Component<Props, State>
  implements Layer<S> {
  static contextType = LayerReactContext;
  public get status(): Status<S> {
    return this.container.getStatus();
  }
  public get actions(): Actions<S> {
    return this.getActions();
  }

  private get container(): StatusContainer<S> {
    return this.context.container;
  }

  private getActions = (() => {
    let lastContainer = null;
    let lastLayers = null;
    let lastActions = null;

    return (): Actions<S> => {
      if (
        this.context.layers !== lastLayers ||
        this.container !== lastContainer
      ) {
        lastLayers = this.context.layers;
        lastContainer = this.container;

        lastActions = this.container.getActions(
          new CompleteLogic(
            this.context.strings,
            extractLogic(this.context.layers, this)
          )
        );
      }

      return lastActions;
    };
  })();
}
