import React from "react";
import {
  Button,
  DatePicker,
  Input,
  Textarea,
} from "@heroui/react";
import { taskBoxProps } from "@/types";
import { CalendarDate } from "@internationalized/date";
import { motion, AnimatePresence } from "framer-motion";

function TaskModal({
  taskData,
  setTaskData,
}: {
  taskData: taskBoxProps;
  setTaskData: React.Dispatch<React.SetStateAction<taskBoxProps>>;
}) {
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
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white dark:bg-[#18181b] w-[90%] max-w-lg rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Task :
            </h2>
            <button
              onClick={() => setTaskData({})}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <main className="px-10 flex flex-col">
            <div className="flex flex-col justify-between flex-1">
              <Input
                required
                label="Title"
                type="text"
                variant={"underlined"}
                value={taskData.title}
                onChange={(e) =>
                  setTaskData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
              <div className="h-[75%] justify-evenly">
                <Textarea
                  isClearable
                  disableAnimation
                  disableAutosize
                  className="col-span-12 md:col-span-6 mb-6 md:mb-0 mt-8"
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter your description"
                  variant={"bordered"}
                  classNames={{
                    base: "max-w-sm mt-[-10px] ",
                    input: "resize-y min-h-[10rem]",
                  }}
                  value={taskData.description}
                  onChange={(e) =>
                    setTaskData((prev) => ({ ...prev, desc: e.target.value }))
                  }
                  onClear={() => setTaskData((prev) => ({ ...prev, desc: "" }))}
                />
                <div className="flex my-4 gap-4 flex-wrap">
                  <DatePicker
                    className="max-w-[284px]"
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
                    className="max-w-[284px]"
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
              </div>
              <div className="flex justify-center gap-10 my-6">
                <Button
                  color="default"
                  variant="bordered"
                  className="rounded-lg h-12"
                  onPress={() => setTaskData({})}
                >
                  Cancel
                </Button>
                <Button
                  color="default"
                  variant="bordered"
                  className="rounded-lg bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white border-light-buttonPrimary dark:border-dark-buttonPrimary w-full h-12"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </main>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TaskModal;
