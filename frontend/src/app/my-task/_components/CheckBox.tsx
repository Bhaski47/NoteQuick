"use client";
import TaskBox from "./TaskBox";
import { useEffect } from "react";
import { taskBoxProps, userDetails } from "@/types";
import TodoList from "./TodoList";
import { getAllTodos } from "@/actions/getAllTodos";
import { useUserStore } from "@/store/useUserStore";
import { useTodoStore } from "@/store/useTodoStore";

export default function CheckBox({
  userDetails,
}: {
  userDetails: userDetails;
}) {
  const taskData: taskBoxProps = useTodoStore((s) => s.currentTodo);
  const setTaskData = useTodoStore((s) => s.setCurrentTodo);

  const allTodos = useTodoStore((s) => s.allTodos);
  const setAllTodos = useTodoStore((s) => s.setAllTodos);
  const setTodoListData = useTodoStore((s) => s.setAllTodos);
  const setEmail = useUserStore((s) => s.setEmail);
  const setUserName = useUserStore((s) => s.setUserName);

  useEffect(() => {
    if ("email" in userDetails && "username" in userDetails) {
      setEmail(userDetails.email);
      setUserName(userDetails.username);
    }
  }, []);

  useEffect(() => {
    async function f() {
      const res = await getAllTodos();
      if (res && !("redirect" in res)) {
        setTodoListData(res);
      }
    }
    f();
  }, []);

  const wrappedSetTaskData: React.Dispatch<
    React.SetStateAction<taskBoxProps>
  > = (value) => {
    const { currentTodo, setCurrentTodo } = useTodoStore.getState();

    if (typeof value === "function") {
      const newValue = (value as (prev: taskBoxProps) => taskBoxProps)(
        currentTodo,
      );
      setCurrentTodo({ mode: "edit", ...newValue });
    } else {
      if (value.title !== undefined) {
        setCurrentTodo({ mode: "edit", ...value });
      } else setCurrentTodo(value);
    }
  };

  return (
    <div className="sm:mx-7 sm:pr-0 px-7 flex">
      <div className="flex flex-col justify-between flex-1">
        {allTodos?.map((item: taskBoxProps, index: number) => {
          return (
            <TodoList
              taskData={item}
              key={index}
              setTaskData={setTaskData}
              setAllTodos={setAllTodos}
              allTodos={allTodos}
            />
          );
        })}
      </div>
      <TaskBox
        taskData={taskData}
        setTaskData={wrappedSetTaskData}
        mode="edit"
      />
    </div>
  );
}
