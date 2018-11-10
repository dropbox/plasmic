import * as React from "react";
import {
  createLogicDecorators,
  Layer,
  composeRegion,
  composeContainerRegion
} from "../../core";

export type CounterScope = {
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

export type LoggingScope = {
  logging: {
    actions: {
      toggle: () => void;
      off: () => void;
    };
    status: {
      isOn: boolean;
    };
    utilities: {
      log: (message: string) => void;
    };
  };
};

export const { counter, logging } = createLogicDecorators<
  LoggingScope & CounterScope
>({
  counter: {
    actions: ["increment", "decrement"],
    status: ["count"],
    utilities: [] as never[]
  },
  logging: {
    actions: ["toggle"],
    status: ["isOn"],
    utilities: ["log"]
  }
});

export class CounterReducerLayer extends Layer<CounterScope> {
  @counter.on.increment.update.count
  incrementCount(current: number, step: number) {
    return current + step;
  }

  @counter.on.decrement.update
  decrementCounter(current: CounterScope["counter"]["status"], step: number) {
    return {
      count: current.count - step
    };
  }
}
export class CounterActionLayer extends Layer<CounterScope & LoggingScope> {
  @counter.on.increment.observe
  observeIncrement(previous: CounterScope["counter"]["status"], step: number) {
    this.utilities.logging.log(
      `increment: ${previous.count} + ${step} = ${this.status.counter.count}`
    );
  }

  @counter.on.decrement.observe
  observeDecrement(previous: CounterScope["counter"]["status"], step: number) {
    this.utilities.logging.log(
      `decrement: ${previous.count} - ${step} = ${this.status.counter.count}`
    );
  }
}
export class CounterObserverLayer extends Layer<CounterScope & LoggingScope> {
  @counter.observe
  observeCounter(previous: CounterScope["counter"]["status"]) {
    this.utilities.logging.log(
      `counter changed: ${previous.count} => ${this.status.counter.count}`
    );
  }
}

export class LogStatusLayer extends Layer<LoggingScope> {
  @logging.on.toggle.update.isOn
  toggle(currentValue: boolean) {
    return !currentValue;
  }
}

export class ConsoleLogLayer extends Layer<LoggingScope> {
  @logging.provide.log
  log(message: string) {
    if (this.status.logging.isOn) {
      console.log(message);
    }
  }
}

export const LogButton = composeRegion<LoggingScope>(({ status, actions }) => (
  <button onClick={() => actions.logging.toggle()}>
    Turn logging {status.logging.isOn ? "off" : "on"}
  </button>
));

export type CounterProps = {
  step: number;
  initial?: number;
};

export const Counter: React.StatelessComponent<
  CounterProps
> = composeContainerRegion<CounterScope, CounterProps>({
  display: ({ status, actions }, { step }) => (
    <React.Fragment>
      <span>{status.counter.count}</span>
      <button onClick={() => actions.counter.increment(step)}>Up</button>
      <button onClick={() => actions.counter.decrement(step)}>Down</button>
    </React.Fragment>
  ),
  layers: [new CounterReducerLayer()],
  defaultStatus: (props: CounterProps) => ({
    counter: {
      count: props.initial || 0
    }
  }),
  layerShouldInit: (props, nextProps) => {
    return props.initial !== nextProps.initial;
  }
});

Counter.displayName = "Counter";

export const App = composeContainerRegion<LoggingScope>({
  display: () => {
    return (
      <React.Fragment>
        <div>
          <Counter step={1} />
          <Counter step={1} initial={10} />
        </div>
        <LogButton />
      </React.Fragment>
    );
  },
  layers: [
    new LogStatusLayer(),
    new ConsoleLogLayer(),
    new CounterActionLayer(),
    new CounterObserverLayer()
  ],
  defaultStatus: {
    logging: {
      isOn: true
    }
  }
});
