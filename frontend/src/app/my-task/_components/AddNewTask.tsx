"use client";
import { taskBoxProps } from "@/types";
import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useTodoStore } from "@/store/useTodoStore";

function AddNewTask() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const setCurrentTodo = useTodoStore((s) => s.setCurrentTodo);

  const wrappedSetTaskData: React.Dispatch<
    React.SetStateAction<taskBoxProps>
  > = (value) => {
    const { currentTodo, setCurrentTodo } = useTodoStore.getState();

    if (typeof value === "function") {
      // It's an updater function: (prev) => newState
      const newValue = (value as (prev: taskBoxProps) => taskBoxProps)(
        currentTodo
      );
      setCurrentTodo(newValue);
    } else {
      // It's a direct value
      setCurrentTodo(value);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="cursor-pointer"
      onClick={() => {
        console.log("endtime auto")
        setCurrentTodo({
          title: "",
          description: "",
          fromDate: undefined,
          toDate: undefined,
          mode: "new",
        });
      }}
    >
      <div className="flex flex-row items-center gap-4 my-2 p-1 w-fit text-textSecondary font-semibold">
        <IoAddOutline size={18} />
        <p className="">Add New Task</p>
      </div>
    </div>
  );
}

export default AddNewTask;
