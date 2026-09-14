"use client";
import TaskBox from "./TaskBox";
import { useEffect, useMemo } from "react";
import { taskBoxProps, userDetails } from "@/types";
import TodoList from "./TodoList";
import { getAllTodos } from "@/actions/getAllTodos";
import { useUserStore } from "@/store/useUserStore";
import { useTodoStore } from "@/store/useTodoStore";
import { TodoStatus } from "@/enum/TodoStatus";

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
  const statusFilter = useTodoStore((s) => s.statusFilter);
  const sortOrder = useTodoStore((s) => s.sortOrder);
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
      const res = await getAllTodos({ status: statusFilter, order: sortOrder });
      if (res && !("redirect" in res)) {
        setTodoListData(res);
      }
    }
    f();
  }, []);

  // Compute filtered and sorted tasks
  const displayedTodos = useMemo(() => {
    if (!allTodos || !Array.isArray(allTodos)) return [];

    let list = [...allTodos];

    // 1. General Filter: When "COMPLETED", show only completed. When "ACTIVE", show only pending.
    if (statusFilter === "ACTIVE") {
      list = list.filter((item) => item?.status !== TodoStatus.COMPLETED);
    } else if (statusFilter === "COMPLETED") {
      list = list.filter((item) => item?.status === TodoStatus.COMPLETED);
    }

    // 2. Sort Order: Default is DESC (newest first)
    list.sort((a, b) => {
      const parseDate = (val?: any) => {
        if (!val) return 0;
        if (typeof val === "string") return new Date(val).getTime();
        if (typeof val === "object" && "year" in val) {
          return new Date(
            val.year,
            (val.month || 1) - 1,
            val.day || 1,
            val.hour || 0,
            val.minute || 0
          ).getTime();
        }
        return 0;
      };

      const timeA = parseDate(a.fromDate) || parseDate(a.toDate);
      const timeB = parseDate(b.fromDate) || parseDate(b.toDate);

      if (timeA && timeB && timeA !== timeB) {
        return sortOrder === "DESC" ? timeB - timeA : timeA - timeB;
      }

      // Fallback sort by todoId
      const idA = String(a.todoId || "");
      const idB = String(b.todoId || "");
      return sortOrder === "DESC"
        ? idB.localeCompare(idA, undefined, { numeric: true })
        : idA.localeCompare(idB, undefined, { numeric: true });
    });

    return list;
  }, [allTodos, statusFilter, sortOrder]);

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
        {displayedTodos.length > 0 ? (
          displayedTodos.map((item: taskBoxProps, index: number) => {
            return (
              <TodoList
                taskData={item}
                key={item.todoId || index}
                setTaskData={setTaskData}
                setAllTodos={setAllTodos}
                allTodos={allTodos}
              />
            );
          })
        ) : (
          <div className="py-12 sm:w-[40.8%] flex flex-col items-center justify-center text-center gap-1.5 border border-dashed border-light-borderPrimary dark:border-dark-borderPrimary rounded-xl my-4 p-6">
            <span className="text-2xl">📋</span>
            <p className="font-semibold text-sm text-light-textPrimary dark:text-dark-textPrimary">
              {statusFilter === "COMPLETED"
                ? "No completed tasks"
                : statusFilter === "ACTIVE"
                ? "No pending tasks"
                : "No tasks yet"}
            </p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              {statusFilter === "COMPLETED"
                ? "Tasks marked as completed will appear here."
                : statusFilter === "ACTIVE"
                ? "You are all caught up! Add a new task above."
                : "Click 'Add New Task' above to add your first task."}
            </p>
          </div>
        )}
      </div>
      <TaskBox
        taskData={taskData}
        setTaskData={wrappedSetTaskData}
        mode="edit"
      />
    </div>
  );
}
