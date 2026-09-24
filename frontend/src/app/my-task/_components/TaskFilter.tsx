"use client";

import React, { useMemo } from "react";
import { useTodoStore, StatusFilter } from "@/store/useTodoStore";
import { TodoStatus } from "@/enum/TodoStatus";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";

export default function TaskFilter() {
  const statusFilter = useTodoStore((s) => s.statusFilter);
  const setStatusFilter = useTodoStore((s) => s.setStatusFilter);
  const sortOrder = useTodoStore((s) => s.sortOrder);
  const setSortOrder = useTodoStore((s) => s.setSortOrder);
  const allTodos = useTodoStore((s) => s.allTodos);
  const storeTags = useTodoStore((s) => s.tags);
  const selectedTag = useTodoStore((s) => s.selectedTag);
  const setSelectedTag = useTodoStore((s) => s.setSelectedTag);

  // Compute live counts
  const totalCount = allTodos?.length || 0;
  const completedCount =
    allTodos?.filter((item) => item?.status === TodoStatus.COMPLETED).length ||
    0;
  const activeCount = totalCount - completedCount;

  // Aggregate tag counts from all non-removed todos in store
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    if (Array.isArray(allTodos)) {
      allTodos.forEach((todo) => {
        if (Array.isArray(todo.tags)) {
          const uniqueTags = new Set(
            todo.tags
              .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
              .filter(Boolean)
          );
          uniqueTags.forEach((t) => {
            counts.set(t, (counts.get(t) || 0) + 1);
          });
        }
      });
    }
    return counts;
  }, [allTodos]);

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tagCounts.forEach((_, tag) => tagsSet.add(tag));
    if (Array.isArray(storeTags)) {
      storeTags.forEach((st) => {
        if (st?.name) tagsSet.add(st.name.trim().toLowerCase());
      });
    }
    return Array.from(tagsSet).sort();
  }, [tagCounts, storeTags]);

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
    <div className="w-full flex flex-col gap-2 pt-1 pb-1">
      <div className="w-full flex items-center justify-between flex-wrap gap-2">
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
          title={`Click to sort ${
            sortOrder === "DESC"
              ? "Oldest First (Ascending)"
              : "Newest First (Descending)"
          }`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
          bg-white/80 dark:bg-[#202127]/80 hover:bg-white dark:hover:bg-[#202127]
          border border-light-borderPrimary dark:border-dark-borderPrimary shadow-sm
          text-light-textPrimary dark:text-dark-textPrimary transition-all duration-150 cursor-pointer shrink-0"
        >
          <span className="text-light-textSecondary dark:text-dark-textSecondary flex items-center">
            {sortOrder === "DESC" ? (
              <LuArrowDown
                size={14}
                className="text-light-buttonPrimary dark:text-dark-buttonPrimary"
              />
            ) : (
              <LuArrowUp
                size={14}
                className="text-light-buttonPrimary dark:text-dark-buttonPrimary"
              />
            )}
          </span>
          <span>
            {sortOrder === "DESC" ? "Newest First (Desc)" : "Oldest First (Asc)"}
          </span>
        </button>
      </div>

      {/* Horizontal Scrollable Tag Bar */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none w-full text-xs">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedTag === null
                ? "bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white shadow-xs font-semibold"
                : "bg-zinc-100 dark:bg-zinc-800 text-light-textSecondary dark:text-dark-textSecondary hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 hover:text-light-textPrimary dark:hover:text-dark-textPrimary border border-zinc-200/80 dark:border-zinc-700/60"
            }`}
          >
            <span>All Tags</span>
          </button>
          {availableTags.map((tag) => {
            const isSelected = selectedTag?.trim().toLowerCase() === tag;
            const count = tagCounts.get(tag) || 0;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white shadow-xs font-semibold"
                    : "bg-zinc-100 dark:bg-zinc-800 text-light-textSecondary dark:text-dark-textSecondary hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 hover:text-light-textPrimary dark:hover:text-dark-textPrimary border border-zinc-200/80 dark:border-zinc-700/60 font-medium"
                }`}
              >
                <span>#{tag}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white font-bold"
                      : "bg-black/5 dark:bg-white/10 text-light-textSecondary dark:text-dark-textSecondary font-semibold"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
