import { allTodos, taskBoxProps } from "@/types";
import { create } from "zustand";

export type StatusFilter = "ALL" | "ACTIVE" | "COMPLETED";
export type SortOrder = "DESC" | "ASC";

interface todoState {
  currentTodo: taskBoxProps;
  setCurrentTodo: (todo: taskBoxProps) => void;
  resetTodo: () => void;
  allTodos: allTodos;
  setAllTodos: (todos: allTodos) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useTodoStore = create<todoState>((set) => ({
  currentTodo: {},
  setCurrentTodo: (todo) => set({ currentTodo: todo }),
  resetTodo: () => set({ currentTodo: {} }),
  allTodos: [],
  setAllTodos: (todos) => set({ allTodos: todos }),
  statusFilter: "ALL",
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  sortOrder: "DESC",
  setSortOrder: (order) => set({ sortOrder: order }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));