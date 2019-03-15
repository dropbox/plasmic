# Plasmic

A framework for composing extensible UI applications

## What are these apps built with?

From the `core/types`:

```typescript
// At the heart your app is a visual representation of some values
export type Value = any;

// This representation leads to events, which are translated into actions
export type Action<Args extends Value[] = Value[]> = (...args: Args) => void;

// There may be other ways you want to transform these values outside of events
export type Utility<Args extends Value[] = Value[], R extends Value = void> = (
  ...args: Args
) => R;

// You put these together into shapes
export type Shape<T> = {
  [key: string]: T;
};

export type ActionShape = Shape<Action>;
export type StatusShape = Shape<Value>;
export type UtilityShape = Shape<Utility>;

// And these shapes together into features
export type Feature<
  A extends ActionShape = ActionShape,
  S extends StatusShape = StatusShape,
  U extends UtilityShape = UtilityShape
> = {
  actions: A;
  status: S;
  utilities: U;
};

// A collection of features makes a scope
export type Scope = {
  [key: string]: Feature;
};
```

## Snippet

What does this look like in practice:

```tsx
// A "Counter" feature
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
  log:
    actions: {};
    status: {};
    utilities: {
      log: (...string[]) =>
    }
  };
};
```

```tsx
const { counter } = createLogicDecorators<CounterScope>({
  counter: {
    actions: ["increment", "decrement"],
    status: ["count"],
    utilities: [] as never[]
  }
});
```

```tsx
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
```

```tsx
type CounterProps = {
  step: number;
};

const Counter = composeContainerRegion<CounterScope, CounterProps>(
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
```
