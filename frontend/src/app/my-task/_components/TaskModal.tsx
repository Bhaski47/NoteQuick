import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  DatePicker,
  Input,
  Textarea,
} from "@heroui/react";
import { taskBoxProps } from "@/types";
import { CalendarDate } from "@internationalized/date";
import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore } from "@/store/useTodoStore";

function TaskModal({
  taskData,
  setTaskData,
}: {
  taskData: taskBoxProps;
  setTaskData: React.Dispatch<React.SetStateAction<taskBoxProps>>;
}) {
  const allTodos = useTodoStore((s) => s.allTodos);
  const storeTags = useTodoStore((s) => s.tags);
  const [tagInput, setTagInput] = useState("");
  const isLoading = false;

  const initialTodo = useRef<taskBoxProps>({
    ...taskData,
    tags: [...(taskData.tags || [])],
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    initialTodo.current = {
      ...taskData,
      tags: [...(taskData.tags || [])],
    };
  }, [taskData.todoId]);

  useEffect(() => {
    const initTags = initialTodo.current?.tags || [];
    const currTags = taskData?.tags || [];
    const tagsEqual =
      initTags.length === currTags.length &&
      initTags.every((t, i) => t === currTags[i]);

    const changed =
      taskData?.title !== initialTodo.current?.title ||
      taskData?.description !== initialTodo.current?.description ||
      taskData?.fromDate !== initialTodo.current?.fromDate ||
      taskData?.toDate !== initialTodo.current?.toDate ||
      !tagsEqual;

    setHasChanges(changed);
  }, [taskData]);

  // Aggregate all existing tags from allTodos and storeTags
  const allExistingTags = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(storeTags)) {
      storeTags.forEach((t) => {
        if (t?.name) set.add(t.name.trim().toLowerCase());
      });
    }
    if (Array.isArray(allTodos)) {
      allTodos.forEach((item: taskBoxProps) => {
        if (Array.isArray(item?.tags)) {
          item.tags.forEach((tag: string) => {
            if (tag && typeof tag === "string" && tag.trim().length > 0) {
              set.add(tag.trim().toLowerCase());
            }
          });
        }
      });
    }
    return Array.from(set).sort();
  }, [allTodos, storeTags]);

  const currentTags = useMemo(() => {
    const raw = taskData.tags;
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    const list: string[] = [];
    raw.forEach((t) => {
      if (typeof t === "string") {
        const norm = t.trim().toLowerCase();
        if (norm && !seen.has(norm)) {
          seen.add(norm);
          list.push(norm);
        }
      }
    });
    return list;
  }, [taskData.tags]);

  const matchingSuggestions = useMemo(() => {
    const q = tagInput.trim().toLowerCase();
    const available = allExistingTags.filter((tag) => !currentTags.includes(tag));
    if (!q) return available;
    return available.filter((tag) => tag.includes(q));
  }, [allExistingTags, tagInput, currentTags]);

  const handleAddTag = (rawTag: string) => {
    const normalized = rawTag.trim().toLowerCase();
    if (!normalized) return;
    setTaskData((prev) => {
      const existing = (prev.tags || []).map((t) => t.trim().toLowerCase());
      if (existing.includes(normalized)) {
        return prev;
      }
      return {
        ...prev,
        tags: [...(prev.tags || []), normalized],
      };
    });
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTaskData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter(
        (t: string) => t.trim().toLowerCase() !== tagToRemove.trim().toLowerCase()
      ),
    }));
  };

  if (Object.keys(taskData).length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white dark:bg-[#18181b] w-full max-w-lg rounded-xl shadow-lg p-6 max-h-[90vh] flex flex-col"
        >
          <div className="flex justify-between items-center border-b border-borderDivider pb-3 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Task Details
            </h2>
            <button
              onClick={() => setTaskData({})}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1"
            >
              ✕
            </button>
          </div>

          <main className="px-2 flex flex-col flex-1 overflow-y-auto py-4 space-y-4">
            <Input
              required
              label="Title"
              type="text"
              variant={"flat"}
              value={taskData.title}
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            <Textarea
              isClearable
              label="Description"
              labelPlacement="outside"
              placeholder="Enter your description"
              variant={"flat"}
              classNames={{
                base: "w-full",
                input: "resize-y min-h-[8rem] outline-none focus:outline-none",
                inputWrapper: "shadow-none",
              }}
              value={taskData.description}
              onChange={(e) =>
                setTaskData((prev) => ({ ...prev, description: e.target.value }))
              }
              onClear={() => setTaskData((prev) => ({ ...prev, description: "" }))}
            />

            <div className="flex my-2 gap-4 flex-wrap">
              <DatePicker
                className="max-w-[240px]"
                label={"From Date"}
                labelPlacement={"outside-left"}
                onChange={(e) => {
                  setTaskData((prev) => ({
                    ...prev,
                    fromDate: e || undefined,
                  }));
                }}
                value={taskData?.fromDate || null}
              />
              <DatePicker
                className="max-w-[240px]"
                label={"To Date"}
                labelPlacement={"outside-left"}
                onChange={(e) => {
                  setTaskData((prev) => ({
                    ...prev,
                    toDate: (e as CalendarDate) || undefined,
                  }));
                }}
                value={taskData?.toDate || null}
              />
            </div>

            {/* Tags Autocomplete Section */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                Tags
              </label>

              {/* Tag Chips */}
              {currentTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {currentTags.map((tag: string) => (
                    <Chip
                      key={tag}
                      size="sm"
                      variant="flat"
                      color="primary"
                      onClose={() => handleRemoveTag(tag)}
                      classNames={{
                        base: "bg-light-buttonPrimary/10 dark:bg-dark-buttonPrimary/20 border border-light-buttonPrimary/20 dark:border-dark-buttonPrimary/30",
                        content:
                          "text-xs font-medium text-light-buttonPrimary dark:text-dark-buttonPrimary",
                      }}
                    >
                      #{tag}
                    </Chip>
                  ))}
                </div>
              )}

              {/* HeroUI Autocomplete */}
              <Autocomplete
                aria-label="Add a tag"
                placeholder={
                  currentTags.length > 0
                    ? "Add another tag..."
                    : "Type or select a tag..."
                }
                size="sm"
                variant="bordered"
                allowsCustomValue
                selectedKey={null}
                inputValue={tagInput}
                onInputChange={(value) => setTagInput(value)}
                onSelectionChange={(key) => {
                  if (key) {
                    handleAddTag(String(key));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (tagInput.trim()) {
                      handleAddTag(tagInput);
                    }
                  }
                }}
                className="w-full"
              >
                {matchingSuggestions.map((suggestion) => (
                  <AutocompleteItem key={suggestion} textValue={suggestion}>
                    #{suggestion}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </main>

          {/* Sticky Action Buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-[#18181b] pt-3 pb-1 border-t border-borderDivider z-20 flex gap-4 w-full flex-shrink-0 mt-auto">
            <Button
              color="default"
              variant="bordered"
              className="rounded-lg flex-1 h-11"
              onPress={() => setTaskData({})}
            >
              Cancel
            </Button>
            <Button
              color="default"
              variant="bordered"
              isLoading={isLoading}
              isDisabled={!hasChanges || isLoading}
              className={`rounded-lg flex-1 h-11 transition-all font-semibold ${
                hasChanges && !isLoading
                  ? "bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white border-light-buttonPrimary dark:border-dark-buttonPrimary cursor-pointer shadow-md"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border-transparent cursor-not-allowed opacity-60"
              }`}
              onPress={() => setTaskData({})}
            >
              Save Changes
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TaskModal;
