"use client";

import { getAllTodos } from "@/actions/getAllTodos";
import { searchTodos } from "@/actions/searchTodos";
import { useTodoStore } from "@/store/useTodoStore";
import { allTodos } from "@/types";
import { Button } from "@heroui/react";
import React, { useState } from "react";
import {
  IoCloseOutline,
  IoSearchOutline,
} from "react-icons/io5";

type StatusFilter = "ALL" | "ACTIVE" | "COMPLETED";

export default function SearchTodo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [lastSearchedTerm, setLastSearchedTerm] = useState("");

  const setAllTodos = useTodoStore((s) => s.setAllTodos);

  const executeSearch = async (term: string, filter: StatusFilter) => {
    const trimmed = term.trim();
    if (!trimmed) {
      handleClear();
      return;
    }

    try {
      setIsLoading(true);
      const results = await searchTodos(trimmed, filter);
      if (results) {
        setAllTodos(results);
      }
      setIsSearched(true);
      setLastSearchedTerm(trimmed);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    executeSearch(searchTerm, statusFilter);
  };

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    if (isSearched && searchTerm.trim()) {
      executeSearch(searchTerm, filter);
    }
  };

  const handleClear = async () => {
    setSearchTerm("");
    setIsSearched(false);
    setLastSearchedTerm("");
    try {
      setIsLoading(true);
      const originalTodos = await getAllTodos();
      if (originalTodos && !("redirect" in originalTodos)) {
        setAllTodos(originalTodos as allTodos);
      }
    } catch (error) {
      console.error("Failed to restore todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filterOptions: {
    label: string;
    value: StatusFilter;
    badgeColor?: string;
  }[] = [
    { label: "All Tasks", value: "ALL" },
    { label: "Pending", value: "ACTIVE", badgeColor: "bg-amber-500" },
    { label: "Completed", value: "COMPLETED", badgeColor: "bg-emerald-500" },
  ];

  return (
    <div className="w-full my-2 flex flex-col gap-2.5">
      {/* Sleek Search Input Container */}
      <div
        className="w-full flex items-center gap-2 p-1 pl-3.5 rounded-xl border border-light-borderPrimary dark:border-dark-borderPrimary 
        bg-white/80 dark:bg-[#1a1b20]/90 backdrop-blur-md shadow-sm transition-all duration-200
        focus-within:border-light-buttonPrimary dark:focus-within:border-dark-buttonPrimary 
        focus-within:ring-2 focus-within:ring-light-buttonPrimary/20 dark:focus-within:ring-dark-buttonPrimary/20"
      >
        <IoSearchOutline className="text-light-textSecondary dark:text-dark-textSecondary text-lg shrink-0" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search tasks by title or note..."
          className="w-full bg-transparent outline-none text-sm text-light-textPrimary dark:text-dark-textPrimary 
          placeholder:text-light-textMuted dark:placeholder:text-dark-textMuted tracking-wide"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="p-1 text-light-textSecondary hover:text-light-textPrimary dark:text-dark-textSecondary dark:hover:text-dark-textPrimary 
            rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            title="Clear text"
          >
            <IoCloseOutline size={18} />
          </button>
        )}

        <Button
          size="sm"
          isLoading={isLoading}
          onPress={handleSearch}
          className="h-8 px-4 font-semibold text-xs rounded-lg text-white 
          bg-light-buttonPrimary dark:bg-dark-buttonPrimary hover:opacity-90 
          shadow-sm transition-transform active:scale-95 shrink-0"
        >
          Search
        </Button>
      </div>

      {/* Filter Chips Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-0.5">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60">
          {filterOptions.map((option) => {
            const isSelected = statusFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFilterChange(option.value)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-[#2b2c34] text-light-textPrimary dark:text-dark-textPrimary shadow-sm font-semibold"
                    : "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary"
                }`}
              >
                {option.badgeColor ? (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${option.badgeColor}`}
                  />
                ) : (
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                  </span>
                )}
                {option.label}
              </button>
            );
          })}
        </div>

        {isSearched && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-light-textSecondary hover:text-red-500 dark:text-dark-textSecondary dark:hover:text-red-400 font-medium transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Active Search Badge */}
      {isSearched && (
        <div
          className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg 
          bg-light-buttonPrimary/10 dark:bg-dark-buttonPrimary/15 
          border border-light-buttonPrimary/20 dark:border-dark-buttonPrimary/25 
          text-light-textPrimary dark:text-dark-textPrimary animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-light-buttonPrimary dark:bg-dark-buttonPrimary shrink-0 animate-pulse" />
            <span className="truncate">
              Results for: <b className="font-semibold">&quot;{lastSearchedTerm}&quot;</b>
              <span className="opacity-70 ml-1">
                ({statusFilter === "ALL" ? "All" : statusFilter === "ACTIVE" ? "Pending" : "Completed"})
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-light-buttonPrimary dark:text-dark-buttonPrimary hover:underline font-semibold cursor-pointer shrink-0 ml-2"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
