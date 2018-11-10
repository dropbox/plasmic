import { TodosScope, Id } from "../types";
import { CounterScope, counter } from "../../counter/app";
import { Layer } from "../../../core";

export type PriorityCounterLayerScope = CounterScope & TodosScope;

export class PriorityCounterLayer extends Layer<PriorityCounterLayerScope> {
  constructor(private id: Id) {
    super();
  }

  @counter.observe
  updatePriority() {
    this.actions.todos.prioritize(this.id, this.status.counter.count);
  }
}
