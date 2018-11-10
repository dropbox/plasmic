import * as React from "react";
import { composeContainerRegion } from "../../../core";
import { Counter, CounterProps } from "../../counter/app";
import { PriorityCounterLayer } from "../logic/priority_counter";
import { Id } from "../types";

export type PriorityCounterScope = {};
export type PriorityCounterProps = {
  id: Id;
  priority: number;
} & CounterProps;

export const PriorityCounter = composeContainerRegion<
  PriorityCounterScope,
  PriorityCounterProps
>({
  display: ({}, { step, priority }) => (
    <Counter step={step} initial={priority} />
  ),
  layers: ({ id }) => [new PriorityCounterLayer(id)],
  defaultStatus: {}
});
