import { Feature, ScopeStrings, FeatureStrings } from "../../core/types";
import { createLogicDecorators } from "../../core/logic_decorators";

export type Id = number;
export type Label = string;
export type Completed = boolean;
export type Filter = Completed | null;

export type Todo<Data = {}> = {
  id: Id;
  label: Label;
  priority: number;
  completed: Completed;
  data: Data;
};

export type TodosScope<Data = {}> = {
  todos: {
    actions: {
      addTodo: (label: Label, data?: Data) => void;
      toggleCompleted: (id: Id) => void;
      deleteTodo: (id: Id) => void;
      prioritize: (id: Id, priority: number) => void;
      updateFilter: (filter: Filter) => void;
      refilter: () => void;
    };
    status: {
      allTodos: Todo<Data>[];
      filteredTodos: Todo<Data>[];
      currentFilter: Filter;
      nextId: number;
    };
    utilities: {
      renderTodo: (todo: Todo<Data>) => JSX.Element | string;
    };
  };
};

export const { todos } = createLogicDecorators<TodosScope>({
  todos: {
    actions: [
      "addTodo",
      "toggleCompleted",
      "deleteTodo",
      "prioritize",
      "refilter",
      "updateFilter"
    ],
    status: ["allTodos", "filteredTodos", "currentFilter", "nextId"],
    utilities: ["renderTodo"]
  }
});
