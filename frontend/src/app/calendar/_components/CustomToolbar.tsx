import Header from "@/components/Header";
import { CalendarEvent } from "@/types";
import moment from "moment";
import { ToolbarProps } from "react-big-calendar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";


const CustomToolbar: React.FC<ToolbarProps<CalendarEvent, object>> = ({ date, onNavigate }: ToolbarProps<CalendarEvent, object>) => {
    const formattedDate = moment(date).format("MMMM YYYY");
    const weekNumber = moment(date).week();

    return (
      <div className="pt-[2.3%] pb-[1.5%] w-full flex gap-10">
        <Header>
          {formattedDate} / W{weekNumber}
        </Header>
        <div className="flex gap-4">
          <button
            className="px-3 py-1 font-extrabold text-2xl"
            onClick={() => {onNavigate("PREV")}}
          >
            <FaArrowLeft />
          </button>
          <button
            className="px-3 py-1 font-extrabold text-2xl"
            onClick={() => {
                console.log("12123");
                
                onNavigate("NEXT")
            }}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    );
    };
  
  export default CustomToolbar;