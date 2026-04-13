import { allTodos, taskBoxProps } from "@/types";
import { create } from "zustand";

interface todoState {
    currentTodo:taskBoxProps
    setCurrentTodo:(todo:taskBoxProps)=>void,
    resetTodo:()=>void,
    allTodos:allTodos,
    setAllTodos:(todos:allTodos) => void
}

export const useTodoStore = create<todoState>((set)=>({
    currentTodo: '',
    setCurrentTodo:(todo)=>set({currentTodo:todo}),
    resetTodo:()=>set({currentTodo:{}}),
    allTodos:[],
    setAllTodos:(todos) => set({allTodos:todos})
}))