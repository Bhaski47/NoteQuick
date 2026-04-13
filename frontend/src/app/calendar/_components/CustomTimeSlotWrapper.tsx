import { CustomTimeSlotWrapperProps } from "@/types/calendar";

const CustomTimeSlotWrapper = ({
  children,
}: CustomTimeSlotWrapperProps) => {
  return <div className="" style={{ border: 'none !important', width: '100%' }}>{children}</div>;
};
export default CustomTimeSlotWrapper;
