"use client";
import { IoAddOutline } from "react-icons/io5";
import { useTodoStore } from "@/store/useTodoStore";
import {
  CalendarDateTime,
  getLocalTimeZone,
  now,
} from "@internationalized/date";
import { toNoonISO } from "@/utils/FormatTime";

function AddNewTask() {
  const setCurrentTodo = useTodoStore((s) => s.setCurrentTodo);

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        const nowTime = now(getLocalTimeZone());
        const nowDt = new CalendarDateTime(
          nowTime.year,
          nowTime.month,
          nowTime.day,
          nowTime.hour,
          nowTime.minute,
          nowTime.second,
        );
        const endDt = nowDt.add({ minutes: 30 });
        setCurrentTodo({
          title: "",
          description: "",
          fromDate: toNoonISO(nowDt),
          toDate: toNoonISO(endDt),
          tags: [],
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
