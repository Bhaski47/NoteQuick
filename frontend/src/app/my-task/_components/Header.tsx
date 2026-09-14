import Divider from "@/utils/Divider";
import AddNewTask from "./AddNewTask";
import SearchTodo from "./SearchTodo";
import TaskFilter from "./TaskFilter";

export default function Header() {
  return (
    <div className="sm:ml-7 sm:pr-0 px-7 pl-7 bg-light-backgroundColor dark:bg-dark-backgroundColor">
      <div className="sm:w-[40.8%]">
        <h1 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary sm:pl-0 pt-8 pb-2 w-full tracking-tight">
          TO DO&apos;S
        </h1>
        <SearchTodo />
        <TaskFilter />
        <Divider className="my-2 w-full" />
        <AddNewTask />
        <Divider className="my-2 w-full" />
      </div>
    </div>
  );
}
