import { infoCardType } from "@/types/profile";
import { motion } from "framer-motion";

export default function InfoCard(props: infoCardType) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      whileTap={{
        y: -10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className="border-1 border-light-borderPrimary px-3 py-3 rounded-2xl w-64 max-w-72 select-none touch-manipulation [&_*]:select-none"
      style={{
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      <p className="text-light-textSecondary text-xs tracking-widest pb-2">
        {props.title}
      </p>
      <p className="text-light-textPrimary font-semibold">{props.name}</p>
    </motion.div>
  );
}
