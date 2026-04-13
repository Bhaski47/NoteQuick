import { navCardProps } from "@/types/profile";
import { motion } from "framer-motion";

export default function NavCard(props:navCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      whileTap={{
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      transition={{ type: "tween" }}
      className={`rounded-3xl p-6 w-full md:w-72 h-fit shadow-lg ${props.wrapperClassStyle} select-none touch-manipulation [&_*]:select-none`}
      style={{
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      <h4 className={`${props.titleClassStyle}`}>{props.name ?? "-"}</h4>
      <h2 className={`font-semibold text-3xl ${props.valueClassStyle}`}>{props.values ?? "0"}</h2>
    </motion.div>
  );
}
