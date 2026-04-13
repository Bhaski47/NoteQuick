import { CustomGutterTimeWrapperProps } from "@/types/calendar";

const CustomGutterTimeWrapper = ({
  children
}: CustomGutterTimeWrapperProps) => {
  return (
    <div className="w-full text-light-textMuted dark:text-dark-textMuted font-semibold ">
      {children}
    </div>
  );
};
export default CustomGutterTimeWrapper;
