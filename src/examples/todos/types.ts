import { Feature, ScopeStrings, FeatureStrings } from "../../core/types";
import { createLogicDecorators } from "../../core/logic_decorators";

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

export type TodosFeature<Data = {}> = Feature<
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

export const todosStrings = {
  actions: [
    "addTodo",
    "toggleCompleted",
    "deleteTodo",
    "refilter",
    "updateFilter"
  ],
  status: ["allTodos", "filteredTodos", "currentFilter", "nextId"],
  utilities: ["renderTodo"]
} as FeatureStrings<TodosFeature>;

export const { todos } = createLogicDecorators<{
  todos: TodosFeature;
}>({
  todos: todosStrings
});
