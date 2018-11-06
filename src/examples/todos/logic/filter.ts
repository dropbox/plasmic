import { todos, TodosFeature, Filter } from "../types";
import { Layer } from "../../../core";

export type FilterLayerScope<Data> = {
  todos: TodosFeature<Data>;
};

export interface FilterLayer<Data = {}> extends Layer<FilterLayerScope<Data>> {}

export class FilterLayer<Data = {}> {
  @todos.on.updateFilter.update.currentFilter
  updateOnUpdateFilter(current: Filter, next: Filter) {
    if (current !== next) {
      return next;
    }
  }
}
