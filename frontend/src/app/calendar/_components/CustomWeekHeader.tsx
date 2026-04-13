import moment from "moment";
import { HeaderProps } from "react-big-calendar";

const CustomWeekHeader = ({ date }: HeaderProps) => {
  const date1 = moment(date).format("DD");
  const day = moment(date).format("ddd");
  return (
    <div
      className="flex items-start flex-col text-center font-bold cursor-default"
      style={{ height: "8rem" }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <h1
        className="text-light-textSecondary dark:text-dark-textSecondary"
        style={{ fontSize: "2.75rem", lineHeight: "2.75rem" }}
      >
        {date1}
      </h1>
      <p className="text-sm self-center text-light-textSecondary dark:text-dark-textSecondary">
        {day}
      </p>
      <div className="bg-light-textSecondary dark:bg-dark-textSecondary h-[30%] w-1 self-center"></div>
    </div>
  );
};

export default CustomWeekHeader;
