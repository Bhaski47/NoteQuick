"use client";

import React from "react";
import { useTodoStore, StatusFilter, SortOrder } from "@/store/useTodoStore";
import { TodoStatus } from "@/enum/TodoStatus";
import { LuArrowDown, LuArrowUp, LuArrowDownUp } from "react-icons/lu";

export default function TaskFilter() {
  const statusFilter = useTodoStore((s) => s.statusFilter);
  const setStatusFilter = useTodoStore((s) => s.setStatusFilter);
  const sortOrder = useTodoStore((s) => s.sortOrder);
  const setSortOrder = useTodoStore((s) => s.setSortOrder);
  const allTodos = useTodoStore((s) => s.allTodos);

  // Compute live counts
  const totalCount = allTodos?.length || 0;
  const completedCount =
    allTodos?.filter((item) => item?.status === TodoStatus.COMPLETED).length ||
    0;
  const activeCount = totalCount - completedCount;

  const filterOptions: {
    label: string;
    value: StatusFilter;
    count: number;
    dotColor?: string;
  }[] = [
    { label: "All Tasks", value: "ALL", count: totalCount },
    {
      label: "Pending",
      value: "ACTIVE",
      count: activeCount,
      dotColor: "bg-amber-500",
    },
    {
      label: "Completed",
      value: "COMPLETED",
      count: completedCount,
      dotColor: "bg-emerald-500",
    },
  ];

  const toggleSort = () => {
    setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
  };

  return (
    <div className="w-full flex items-center justify-between flex-wrap gap-2 pt-1 pb-1">
      {/* General Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm">
        {filterOptions.map((option) => {
          const isSelected = statusFilter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-[#202127] text-light-textPrimary dark:text-dark-textPrimary shadow-sm font-semibold ring-1 ring-black/5 dark:ring-white/10"
                  : "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {option.dotColor && (
                <span className={`w-2 h-2 rounded-full ${option.dotColor}`} />
              )}
              <span>{option.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected
                    ? "bg-light-buttonPrimary/15 dark:bg-dark-buttonPrimary/25 text-light-buttonPrimary dark:text-dark-buttonPrimary"
                    : "bg-black/5 dark:bg-white/10 text-light-textSecondary dark:text-dark-textSecondary"
                }`}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Filter Control (Default: Descending) */}
      <button
        type="button"
        onClick={toggleSort}
        title={`Click to sort ${sortOrder === "DESC" ? "Oldest First (Ascending)" : "Newest First (Descending)"}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
        bg-white/80 dark:bg-[#202127]/80 hover:bg-white dark:hover:bg-[#202127]
        border border-light-borderPrimary dark:border-dark-borderPrimary shadow-sm
        text-light-textPrimary dark:text-dark-textPrimary transition-all duration-150 cursor-pointer shrink-0"
      >
        <span className="text-light-textSecondary dark:text-dark-textSecondary flex items-center">
          {sortOrder === "DESC" ? (
            <LuArrowDown size={14} className="text-light-buttonPrimary dark:text-dark-buttonPrimary" />
          ) : (
            <LuArrowUp size={14} className="text-light-buttonPrimary dark:text-dark-buttonPrimary" />
          )}
        </span>
        <span>
          {sortOrder === "DESC" ? "Newest First (Desc)" : "Oldest First (Asc)"}
        </span>
      </button>
    </div>
  );
}
