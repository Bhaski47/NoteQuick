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
} from "@heroui/react";
import {
  CalendarDate,
  CalendarDateTime,
  today,
  now,
} from "@internationalized/date";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getLocalTimeZone } from "@internationalized/date";
import { toCalendarDateTimeValue, toNoonISO } from "@/utils/FormatTime";
import { LuTrash2, LuX } from "react-icons/lu";
import NProgress from "nprogress";

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
  const initialTodo = useRef<taskBoxProps>({ ...taskData });
  const [hasChanges, setHasChanges] = useState(false);
  const setTodoListData = useTodoStore((s) => s.setAllTodos);
  const todayDate = today(getLocalTimeZone());
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  useEffect(() => {
    if (mode === "new") {
      setTaskData({
        title: "",
        description: "",
        fromDate: toNoonISO(getNowDateTime()),
        toDate: toNoonISO(getNowDateTime()),
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

    const changesExist =
      initialTodo.current.title !== taskData.title ||
      initialTodo.current.description !== taskData.description ||
      !datesEqual(initialTodo.current.fromDate, taskData.fromDate) ||
      !datesEqual(initialTodo.current.toDate, taskData.toDate);

    setHasChanges(changesExist);
  }, [taskData]);

  console.log("taskData.toDate");
  console.log(taskData);
  

  const handleSave = async () => {
    try {
      if (!taskData.title?.trim()) {
        alert("Invalid Title");
        return;
      }
      setIsLoading(true);
      NProgress.start();
      const token = getCookie("token");
      const isNew = taskData.mode === "new" || mode === "new";
      const url = isNew
      ? `${process.env.host}/todos/addTodo`
      : `${process.env.host}/todos/updateTodo`;

      const payload = {
        ...taskData,
        fromDate: taskData.fromDate ?? toNoonISO(todayNoon),
        toDate: taskData.toDate ?? toNoonISO(todayNoon),
      };

      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todos = await getAllTodos();
      if (todos) setTodoListData(todos as allTodos);
      setTaskData({});
    } catch (error) {
      console.error("Todo operation failed:", error);
      alert("Something went wrong");
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
      await axios.post(
        `${process.env.host}/todos/deleteTodo`,
        { todoId: taskData.todoId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const todos = await getAllTodos();
      if (todos) setTodoListData(todos as allTodos);
      onClose();
      setTaskData({});
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Something went wrong");
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
            const newFrom = date ?? todayNoon;
            const currentTo =
              toCalendarDateTimeValue(taskData.toDate as string | undefined) ??
              todayNoon;
            const newTo =
              currentTo.compare(newFrom) >= 0
                ? currentTo
                : newFrom.add({ days: 1 });
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
            todayNoon
          }
          onChange={(date) => {
            const newTo =
              date &&
              date.compare(
                toCalendarDateTimeValue(
                  taskData.fromDate as string | undefined,
                ) ?? todayNoon,
              ) >= 0
                ? date
                : todayNoon.add({ days: 1 });
            setTaskData((prev) => ({
              ...prev,
              toDate: toNoonISO(newTo),
            }));
          }}
        />
      </div>
    </div>
  );

  const actionButtons = hasChanges && (
    <div className="flex justify-center gap-10 w-10/12 my-6">
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
        className="rounded-lg bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white border-light-buttonPrimary dark:border-dark-buttonPrimary flex-1 h-11"
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
            className="hidden md:block border-1.5 border-borderDivider h-[80%] w-[40%] fixed right-7 top-12 rounded-lg"
          >
            <main className="p-10 flex flex-col h-full overflow-y-scroll">
              <div className="flex justify-between">
                <p className="text-xl font-bold text-textPrimary">Task :</p>
                <button
                  className="text-2xl text-rose-500 cursor-pointer"
                  onClick={onOpen}
                >
                  <LuTrash2 />
                </button>
              </div>

              <div className="flex flex-col justify-between flex-1">
                {formContent}
                {actionButtons}
              </div>
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
                {actionButtons}
                <div className="h-6" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {deleteModal}
    </>
  );
}
