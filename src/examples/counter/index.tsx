import * as React from "react";
import * as ReactDOM from "react-dom";
import { Feature, FeatureStrings } from "../../core/types";
import { createLogicDecorators, ReactContainerLayer, Layer } from "../../core";

type CounterFeature = Feature<
  {
    increment: (diff: number) => void;
  },
  {
    count: number;
  }
>;

const counterStrings: FeatureStrings<CounterFeature> = {
  actions: ["increment"],
  status: ["count"],
  utilities: []
};

const { counter } = createLogicDecorators<{
  counter: CounterFeature;
}>({
  counter: counterStrings
});

class CounterLogicLayer extends Layer<{ counter: CounterFeature }> {
  @counter.on.increment.update.count()
  increment(current: number, diff: number) {
    return current + diff;
  }
}

class Counter extends ReactContainerLayer<{ counter: CounterFeature }> {
  strings = {
    counter: counterStrings
  };

  defaultStatus = {
    counter: {
      count: 0
    }
  };

  logic = [new CounterLogicLayer()];

  display() {
    const { count } = this.status.counter;
    const { increment } = this.actions.counter;

    return (
      <React.Fragment>
        <div>{count}</div>
        <button
          onClick={() => {
            increment(1);
          }}
        >
          Up
        </button>
        <button
          onClick={() => {
            increment(-1);
          }}
        >
          Down
        </button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
