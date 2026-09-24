import { allTodos, Tag, taskBoxProps } from "@/types";
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
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  removeTag: (tagId: string, tagName: string) => void;
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
  tags: [],
  setTags: (tags) => set({ tags }),
  addTag: (tag) =>
    set((state) => {
      const exists = state.tags.some(
        (t) =>
          t.tagId === tag.tagId ||
          t.name.trim().toLowerCase() === tag.name.trim().toLowerCase()
      );
      if (exists) return state;
      return {
        tags: [...state.tags, tag].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      };
    }),
  selectedTag: null,
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  removeTag: (tagId, tagName) =>
    set((state) => {
      const normalizedTarget = tagName.trim().toLowerCase();
      const updatedTodos = state.allTodos.map((todo) => {
        if (!todo.tags || !todo.tags.length) return todo;
        return {
          ...todo,
          tags: todo.tags.filter(
            (t) => t.trim().toLowerCase() !== normalizedTarget
          ),
        };
      });

      const updatedCurrentTodo = state.currentTodo?.tags
        ? {
            ...state.currentTodo,
            tags: state.currentTodo.tags.filter(
              (t) => t.trim().toLowerCase() !== normalizedTarget
            ),
          }
        : state.currentTodo;

      return {
        tags: state.tags.filter((t) => t.tagId !== tagId),
        allTodos: updatedTodos,
        currentTodo: updatedCurrentTodo,
        selectedTag:
          state.selectedTag?.trim().toLowerCase() === normalizedTarget
            ? null
            : state.selectedTag,
      };
    }),
}));