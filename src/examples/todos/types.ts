import { Feature, ScopeStrings } from "../../core/types";
import { createLogicScaffold } from "../../core/logic_layer";

export type Id = number;
export type Label = string;
export type Completed = boolean;
export type Filter = Completed | null;

export type Todo = {
  id: Id;
  label: Label;
  completed: Completed;
};

export type TodoFeature = Feature<
  {
    addTodo: (label: Label) => void;
    toggleCompleted: (id: Id) => void;
    deleteTodo: (id: Id) => void;
    updateFilter: (filter: Filter) => void;
    refilter: () => void;
  },
  {
    allTodos: Todo[];
    filteredTodos: Todo[];
    currentFilter: Filter;
    nextId: number;
  }
>;

export type TodoScope = {
  todos: TodoFeature;
};

export const TodoStrings = {
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

export const { todos } = createLogicScaffold(TodoStrings);
