import { Feature, ScopeStrings, createLogicScaffold } from "./core";

export type Id = number;
export type Label = string;
export type Completed = boolean;

export type Todo = {
  id: Id;
  label: Label;
  completed: Completed;
};

export type TodoFeature = Feature<
  {
    addTodo: Label;
    toggleCompleted: Id;
    deleteTodo: Id;
    updateFilter: Completed | null;
    refilter: null;
  },
  {
    allTodos: Todo[];
    filteredTodos: Todo[];
    currentFilter: Completed | null;
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
