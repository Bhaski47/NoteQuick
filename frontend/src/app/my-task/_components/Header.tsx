import Divider from "@/utils/Divider";
import AddNewTask from "./AddNewTask";

export default function Header() {
  return (
    <div className=" sm:ml-7 sm:pr-0 px-7 pl-7 bg-light-backgroundColor dark:bg-dark-backgroundColor">
      <h1 className="text-2xl font-bold text-textPrimary sm:pl-0 pt-8 pb-[1.5%] w-full">
        TO DO&apos;S
      </h1>
      <Divider className="sm:w-[40%]" />
      <AddNewTask />
      <Divider className="sm:w-[40%]" />
    </div>
  );
}
