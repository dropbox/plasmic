import * as React from "react";
import * as ReactDOM from "react-dom";
import { createLogicDecorators, Layer } from "../../core";
import { composeContainer } from "../../core/react_container_layer";

type CounterScope = {
  counter: {
    actions: {
      increment: (step: number) => void;
    };
    status: {
      count: number;
    };
    utilities: {};
  };
};

const { counter } = createLogicDecorators<CounterScope>({
  counter: {
    actions: ["increment"],
    status: ["count"],
    utilities: [] as never[]
  }
});

interface CounterLayer extends Layer<CounterScope> {}

class CounterLayer {
  @counter.on.increment.update.count
  increment(current: number, step: number) {
    return current + step;
  }
}

type CounterProps = {
  step: number;
};

const Counter = composeContainer<CounterScope, CounterScope, CounterProps>(
  ({ status, actions }, { step }) => {
    const { count } = status.counter;
    const { increment } = actions.counter;

    return (
      <React.Fragment>
        <div>{count}</div>
        <button onClick={() => increment(step)}>Up</button>
        <button onClick={() => increment(-step)}>Down</button>
      </React.Fragment>
    );
  },
  [new CounterLayer()],
  {
    counter: {
      count: 0
    }
  }
);

ReactDOM.render(<Counter step={1} />, document.getElementById("root"));
