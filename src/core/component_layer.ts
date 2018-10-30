import * as React from "react";
import { Scope, Status, Actions, Logic } from "./types";
import { Layer } from "./layer";
import { StatusContainer } from "./status_container";

export const LayerContext = React.createContext({});

export class ComponentLayer<S extends Scope = {}, Props = {}, State = {}>
  extends React.Component<Props, State>
  implements Layer<S> {
  static contextType = LayerContext;
  public get status(): Status<S> {
    return this.container.getStatus();
  }
  public get triggers(): Actions<S> {
    return this.container.getActions(this.logic);
  }

  private get container(): StatusContainer<S> {
    return this.context.container;
  }

  private get logic(): Logic<S> {
    return this.context.logic;
  }
}
