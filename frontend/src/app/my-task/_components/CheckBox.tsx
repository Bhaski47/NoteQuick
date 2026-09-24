"use client";
import TaskBox from "./TaskBox";
import { useEffect, useMemo } from "react";
import { taskBoxProps, userDetails } from "@/types";
import TodoList from "./TodoList";
import { getAllTodos } from "@/actions/getAllTodos";
import { getAllTags } from "@/actions/getAllTags";
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
  const storeTags = useTodoStore((s) => s.tags);
  const setTags = useTodoStore((s) => s.setTags);
  const selectedTag = useTodoStore((s) => s.selectedTag);
  const setSelectedTag = useTodoStore((s) => s.setSelectedTag);
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

  useEffect(() => {
    async function fetchTags() {
      if (storeTags.length === 0) {
        const res = await getAllTags();
        if (res && !("redirect" in res) && Array.isArray(res)) {
          setTags(res);
        }
      }
    }
    fetchTags();
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

    // 2. Tag Filter: If selectedTag is active, filter todos that include this tag
    if (selectedTag) {
      const normalizedSelected = selectedTag.trim().toLowerCase();
      list = list.filter((item) => {
        if (!Array.isArray(item?.tags)) return false;
        return item.tags.some(
          (t) =>
            typeof t === "string" && t.trim().toLowerCase() === normalizedSelected
        );
      });
    }

    // 3. Sort Order: Default is DESC (newest first)
    list.sort((a, b) => {
      const parseDate = (val?: unknown) => {
        if (!val) return 0;
        if (typeof val === "string") return new Date(val).getTime();
        if (typeof val === "object" && val !== null && "year" in val) {
          const d = val as {
            year: number;
            month?: number;
            day?: number;
            hour?: number;
            minute?: number;
          };
          return new Date(
            d.year,
            (d.month || 1) - 1,
            d.day || 1,
            d.hour || 0,
            d.minute || 0
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
  }, [allTodos, statusFilter, selectedTag, sortOrder]);

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
        {/* Active Tag Filter Indicator */}
        {selectedTag && (
          <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-light-buttonPrimary/10 dark:bg-dark-buttonPrimary/15 border border-light-buttonPrimary/20 dark:border-dark-buttonPrimary/25 text-light-textPrimary dark:text-dark-textPrimary mb-3 sm:w-[40.8%]">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-light-buttonPrimary dark:bg-dark-buttonPrimary shrink-0" />
              <span className="truncate">
                Filtered by tag: <b className="font-semibold">#{selectedTag}</b>{" "}
                ({displayedTodos.length}{" "}
                {displayedTodos.length === 1 ? "task" : "tasks"})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className="text-xs text-light-buttonPrimary dark:text-dark-buttonPrimary hover:underline font-semibold cursor-pointer shrink-0 ml-2"
            >
              Clear Filter
            </button>
          </div>
        )}

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
            <span className="text-2xl">{selectedTag ? "🏷️" : "📋"}</span>
            <p className="font-semibold text-sm text-light-textPrimary dark:text-dark-textPrimary">
              {selectedTag
                ? `No tasks with tag #${selectedTag}`
                : statusFilter === "COMPLETED"
                ? "No completed tasks"
                : statusFilter === "ACTIVE"
                ? "No pending tasks"
                : "No tasks yet"}
            </p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              {selectedTag
                ? "No tasks match the active tag filter."
                : statusFilter === "COMPLETED"
                ? "Tasks marked as completed will appear here."
                : statusFilter === "ACTIVE"
                ? "You are all caught up! Add a new task above."
                : "Click 'Add New Task' above to add your first task."}
            </p>
            {selectedTag && (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="mt-2 px-3 py-1 text-xs font-semibold rounded-lg bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                Clear Tag Filter
              </button>
            )}
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
