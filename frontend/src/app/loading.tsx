'use client'

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <motion.div
        className="absolute left-0 top-0 h-[4px] bg-light-buttonPrimary"
        initial={{ width: "0%" }}
        animate={{ width: ["0%", "70%", "90%"] }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}