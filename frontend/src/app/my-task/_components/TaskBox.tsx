"use client";
import { getAllTodos } from "@/actions/getAllTodos";
import { useTodoStore } from "@/store/useTodoStore";
import { allTodos, taskBoxProps } from "@/types";
import { getCookie } from "@/utils/getCookie";
import {
  DatePicker,
  Input,
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Chip,
} from "@heroui/react";
import {
  CalendarDate,
  CalendarDateTime,
  today,
  now,
  ZonedDateTime,
} from "@internationalized/date";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getLocalTimeZone } from "@internationalized/date";
import { toCalendarDateTimeValue, toNoonISO } from "@/utils/FormatTime";
import { LuTrash2, LuX } from "react-icons/lu";
import NProgress from "nprogress";
import { toast } from "@/utils/toast";

export default function TaskBox({
  taskData,
  setTaskData,
  mode,
}: {
  taskData: taskBoxProps;
  setTaskData: React.Dispatch<React.SetStateAction<taskBoxProps>>;
  mode: "new" | "edit";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const initialTodo = useRef<taskBoxProps>({
    ...taskData,
    tags: [...(taskData.tags || [])],
  });
  const [hasChanges, setHasChanges] = useState(false);
  const setTodoListData = useTodoStore((s) => s.setAllTodos);
  const allTodos = useTodoStore((s) => s.allTodos);
  const storeTags = useTodoStore((s) => s.tags);
  const statusFilter = useTodoStore((s) => s.statusFilter);
  const sortOrder = useTodoStore((s) => s.sortOrder);
  const todayDate = today(getLocalTimeZone());
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [tagInput, setTagInput] = useState("");

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

  const getNowDateTime = () => {
    const nowTime = now(getLocalTimeZone());
    return new CalendarDateTime(
      nowTime.year,
      nowTime.month,
      nowTime.day,
      nowTime.hour,
      nowTime.minute,
      nowTime.second,
    );
  };

  const todayNoon = getNowDateTime();
  const defaultEndTime = getNowDateTime().add({ minutes: 30 });

  useEffect(() => {
    if (mode === "new") {
      const nowDt = getNowDateTime();
      const endDt = nowDt.add({ minutes: 30 });
      setTaskData({
        title: "",
        description: "",
        fromDate: toNoonISO(nowDt),
        toDate: toNoonISO(endDt),
        tags: [],
        mode: "new",
      });
    }
  }, [mode]);

  useEffect(() => {
    const datesEqual = (date1?: CalendarDate, date2?: CalendarDate) => {
      if (!date1 || !date2) return date1 === date2;
      return (
        date1.year === date2.year &&
        date1.month === date2.month &&
        date1.day === date2.day
      );
    };

    const tagsEqual = (a?: string[], b?: string[]) => {
      const arrA = (a || []).map((t) => t.trim().toLowerCase());
      const arrB = (b || []).map((t) => t.trim().toLowerCase());
      if (arrA.length !== arrB.length) return false;
      return arrA.every((t, i) => t === arrB[i]);
    };

    const changesExist =
      initialTodo.current.title !== taskData.title ||
      initialTodo.current.description !== taskData.description ||
      !datesEqual(initialTodo.current.fromDate, taskData.fromDate) ||
      !datesEqual(initialTodo.current.toDate, taskData.toDate) ||
      !tagsEqual(initialTodo.current.tags, taskData.tags);

    setHasChanges(changesExist);
  }, [taskData]);

  useEffect(() => {
    initialTodo.current = {
      ...taskData,
      tags: [...(taskData.tags || [])],
    };
    setHasChanges(false);
    setTagInput("");
  }, [taskData.todoId, mode]);

  const handleSave = async () => {
    try {
      if (!taskData.title?.trim()) {
        toast.warning("Title Required", "Please provide a title for your task");
        return;
      }
      setIsLoading(true);
      NProgress.start();
      const token = getCookie("token");
      const apiHost =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.host ||
        "http://localhost:8080";
      const isNew = taskData.mode === "new" || mode === "new";
      const url = isNew
        ? `${apiHost}/todos/addTodo`
        : `${apiHost}/todos/updateTodo`;

      const payload = {
        ...taskData,
        fromDate: taskData.fromDate ?? toNoonISO(todayNoon),
        toDate: taskData.toDate ?? toNoonISO(todayNoon),
        tags: currentTags,
      };

      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todos = await getAllTodos({
        status: statusFilter,
        order: sortOrder,
      });
      if (todos) setTodoListData(todos as allTodos);
      toast.success(
        isNew ? "Task Created" : "Task Updated",
        `"${taskData.title}" ${isNew ? "added to your list" : "saved successfully"}`
      );
      setTaskData({});
    } catch (error) {
      console.error("Todo operation failed:", error);
      toast.error("Operation Failed", "Could not save task. Please try again.");
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      NProgress.start();
      const token = getCookie("token");
      const apiHost =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.host ||
        "http://localhost:8080";
      await axios.post(
        `${apiHost}/todos/deleteTodo`,
        { todoId: taskData.todoId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const todos = await getAllTodos({
        status: statusFilter,
        order: sortOrder,
      });
      if (todos) setTodoListData(todos as allTodos);
      toast.success("Task Deleted", `"${taskData.title || "Task"}" has been deleted`);
      onClose();
      setTaskData({});
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Delete Failed", "Could not delete task. Please try again.");
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  const isVisible = Object.keys(taskData).length !== 0;

  const formContent = (
    <div className="flex flex-col gap-4">
      <Input
        required
        label="Title"
        type="text"
        variant="underlined"
        value={taskData.title}
        classNames={{
          inputWrapper:
            "[&:after]:dark:bg-white border-b dark:border-b-white/60",
        }}
        onChange={(e) =>
          setTaskData((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <Textarea
        isClearable
        disableAnimation
        disableAutosize
        label="Description"
        labelPlacement="outside"
        placeholder="Enter your description"
        variant="bordered"
        classNames={{
          input: "resize-y min-h-[8rem]",
        }}
        value={taskData.description}
        onChange={(e) =>
          setTaskData((prev) => ({ ...prev, description: e.target.value }))
        }
        onClear={() => setTaskData((prev) => ({ ...prev, description: "" }))}
      />
      {/* Tags Autocomplete Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary">
          Tags
        </label>

        {/* Tag Chips */}
        {currentTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {currentTags.map((tag: string) => (
              <Chip
                key={tag}
                variant="flat"
                color="primary"
                size="sm"
                onClose={() => handleRemoveTag(tag)}
                className="font-medium text-xs bg-light-buttonPrimary/15 text-light-buttonPrimary dark:bg-dark-buttonPrimary/25 dark:text-dark-buttonPrimary"
              >
                #{tag}
              </Chip>
            ))}
          </div>
        )}

        {/* HeroUI Autocomplete Input */}
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
      <div className="flex flex-col sm:flex-row gap-3">
        <DatePicker
          label="From Date & Time"
          variant="bordered"
          granularity="minute"
          minValue={todayDate}
          value={
            toCalendarDateTimeValue(taskData.fromDate as string | undefined) ??
            todayNoon
          }
          onChange={(date) => {
            const newFrom =
              date ?? (todayNoon as ZonedDateTime | CalendarDateTime);
            const currentTo =
              toCalendarDateTimeValue(taskData.toDate as string | undefined) ??
              defaultEndTime;
            const newTo =
              currentTo.compare(newFrom) > 0
                ? currentTo
                : newFrom.add({ minutes: 30 });
            setTaskData((prev) => ({
              ...prev,
              fromDate: toNoonISO(newFrom),
              toDate: toNoonISO(newTo),
            }));
          }}
        />
        <DatePicker
          label="To Date & Time"
          variant="bordered"
          granularity="minute"
          minValue={todayDate}
          value={
            toCalendarDateTimeValue(taskData.toDate as string | undefined) ??
            defaultEndTime
          }
          onChange={(date) => {
            const currentFrom =
              toCalendarDateTimeValue(taskData.fromDate as string | undefined) ??
              todayNoon;
            const newTo =
              date && date.compare(currentFrom) >= 0
                ? date
                : currentFrom.add({ minutes: 30 });
            setTaskData((prev) => ({
              ...prev,
              toDate: toNoonISO(newTo),
            }));
          }}
        />
      </div>
    </div>
  );

  const actionButtons = (
    <div className="sticky bottom-0 bg-light-backgroundColor dark:bg-dark-backgroundColor pt-3 pb-2 border-t border-borderDivider z-20 flex gap-4 w-full mt-auto">
      <Button
        color="default"
        variant="bordered"
        className="rounded-lg flex-1 h-11"
        onPress={() => setTaskData({})}
      >
        Close
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
        onPress={handleSave}
      >
        Save Changes
      </Button>
    </div>
  );
  const deleteModal = (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Delete Todo</ModalHeader>
            <ModalBody>
              <p className="text-light-textSecondary dark:text-dark-textSecondary text-sm">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                  {taskData.title || "this todo"}
                </span>
                ? This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                className="rounded-lg"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                className="rounded-lg bg-rose-500 text-white border-rose-500"
                isLoading={isLoading}
                onPress={handleDelete}
              >
                Yes, Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden md:block border-1.5 border-borderDivider h-[80%] w-[40%] fixed right-7 top-12 rounded-lg bg-light-backgroundColor dark:bg-dark-backgroundColor shadow-xl"
          >
            <main className="p-8 flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold text-textPrimary">Task :</p>
                <button
                  className="text-2xl text-rose-500 cursor-pointer hover:text-rose-600 transition-colors"
                  onClick={onOpen}
                >
                  <LuTrash2 />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                {formContent}
              </div>
              {actionButtons}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isVisible && (
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setTaskData({})}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-light-backgroundColor dark:bg-dark-backgroundColor rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-light-borderSecondary dark:bg-dark-borderSecondary" />
              </div>
              <div className="flex justify-between items-center px-5 py-3 border-b border-borderDivider">
                <p className="text-lg font-bold text-textPrimary">Task</p>
                <div className="flex items-center gap-3">
                  {mode === "edit" && (
                    <button
                      onClick={onOpen}
                      className="text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      <LuTrash2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setTaskData({})}
                    className="text-light-textMuted dark:text-dark-textMuted"
                  >
                    <LuX size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {formContent}
              </div>
              <div className="px-5 pb-3">
                {actionButtons}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {deleteModal}
    </>
  );
}
