"use client";
import { IoAddOutline } from "react-icons/io5";
import { useTodoStore } from "@/store/useTodoStore";

function AddNewTask() {

  const setCurrentTodo = useTodoStore((s) => s.setCurrentTodo);

  return (
    <div className="cursor-pointer"
      onClick={() => {
        console.log("endtime auto")
        setCurrentTodo({
          title: "",
          description: "",
          fromDate: undefined,
          toDate: undefined,
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
