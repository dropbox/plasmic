import { Feature, ScopeStrings } from "../../core/types";
import { createLogicDecorators } from "../../core/decorators";

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
  },
  {
    renderTodo: (todo: Todo<Data>) => JSX.Element | string;
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
    state: ["allTodos", "filteredTodos", "currentFilter", "nextId"],
    utilities: ["renderTodo"]
  }
} as ScopeStrings<TodoScope>;

export const { todos } = createLogicDecorators(todoStrings);
