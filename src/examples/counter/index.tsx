import * as React from "react";
import * as ReactDOM from "react-dom";
import { createLogicDecorators, Layer } from "../../core";
import { composeContainerLayer } from "../../core/react_container_layer";

type CounterScope = {
  counter: {
    actions: {
      increment: (step: number) => void;
      decrement: (step: number) => void;
    };
    status: {
      count: number;
    };
    utilities: {};
  };
};

const { counter } = createLogicDecorators<CounterScope>({
  counter: {
    actions: ["increment", "decrement"],
    status: ["count"],
    utilities: [] as never[]
  }
});

interface CounterReducerLayer extends Layer<CounterScope> {}
interface CounterActionLayer extends Layer<CounterScope> {}
interface CounterObserverLayer extends Layer<CounterScope> {}

class CounterReducerLayer {
  @counter.on.increment.update.count
  incrementCount(current: number, step: number) {
    return current + step;
  }

  @counter.on.decrement.update.count
  decrementCount(current: number, step: number) {
    return current - step;
  }
}
class CounterActionLayer {
  @counter.on.increment.observe
  observeIncrement(previous: CounterScope["counter"]["status"], step: number) {
    console.log(
      `increment: ${previous.count} + ${step} = ${this.status.counter.count}`
    );
  }

  @counter.on.decrement.observe
  observeDecrement(previous: CounterScope["counter"]["status"], step: number) {
    console.log(
      `decrement: ${previous.count} - ${step} = ${this.status.counter.count}`
    );
  }
}
class CounterObserverLayer {
  @counter.observe
  observeCounter(previous: CounterScope["counter"]["status"]) {
    console.log(
      `counter changed: ${previous.count} => ${this.status.counter.count}`
    );
  }
}

type CounterProps = {
  step: number;
};

const Counter = composeContainerLayer<CounterScope, CounterProps>(
  ({ status, actions }, { step }) => {
    const { count } = status.counter;
    const { increment, decrement } = actions.counter;

    return (
      <React.Fragment>
        <div>{count}</div>
        <button onClick={() => increment(step)}>Up</button>
        <button onClick={() => decrement(step)}>Down</button>
      </React.Fragment>
    );
  },
  [
    new CounterReducerLayer(),
    new CounterActionLayer(),
    new CounterObserverLayer()
  ],
  {
    counter: {
      count: 0
    }
  }
);

ReactDOM.render(<Counter step={1} />, document.getElementById("root"));
