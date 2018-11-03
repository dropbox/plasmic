import { Feature, ScopeStrings } from "../../core/types";
import { createLogicScaffold } from "../../core/logic_layer";

export type Id = number;
export type Label = string;
export type Completed = boolean;
export type Filter = Completed | null;

export type Todo<Data = {}> = {
  id: Id;
  label: Label;
  completed: Completed;
  data: Data;
};

export type TodoFeature<Data = {}> = Feature<
  {
    addTodo: (label: Label, data?: Data) => void;
    toggleCompleted: (id: Id) => void;
    deleteTodo: (id: Id) => void;
    updateFilter: (filter: Filter) => void;
    refilter: () => void;
  },
  {
    allTodos: Todo<Data>[];
    filteredTodos: Todo<Data>[];
    currentFilter: Filter;
    nextId: number;
  }
>;

export type TodoScope<Data = {}> = {
  todos: TodoFeature<Data>;
};

export const todoStrings = {
  todos: {
    actions: [
      "addTodo",
      "toggleCompleted",
      "deleteTodo",
      "refilter",
      "updateFilter"
    ],
    state: ["allTodos", "filteredTodos", "currentFilter", "nextId"]
  }
} as ScopeStrings<TodoScope>;

export const { todos } = createLogicScaffold(todoStrings);
