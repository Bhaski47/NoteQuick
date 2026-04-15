"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";

export default function NotFound() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("system");
  });
  useEffect(() => {
    const timer = setTimeout(() => {}, 3000); // ⏱ 3 seconds

    return () => clearTimeout(timer);
  }, []);
  return (
    <main className="relative min-h-screen bg-light-backgroundColor dark:bg-dark-background overflow-hidden flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-light-buttonPrimary/10 dark:bg-dark-buttonPrimary/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-light-buttonPrimary/10 dark:bg-dark-buttonPrimary/10 blur-[120px]" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#333232 1px, transparent 1px), linear-gradient(90deg, #333232 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <span className="text-[10rem] md:text-[14rem] font-bold leading-none font-manrope select-none bg-gradient-to-b from-light-buttonPrimary/30 to-transparent dark:from-dark-buttonPrimary/20 bg-clip-text text-transparent">
            404
          </span>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-light-buttonPrimary/30 dark:shadow-dark-buttonPrimary/30 whitespace-nowrap"
          >
            Page Not Found
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-16 h-[2px] bg-light-borderDivider dark:bg-dark-borderDivider rounded-full mb-8"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold font-manrope text-light-textPrimary dark:text-dark-textPrimary mb-4"
        >
          Oops! This page doesn&apos;t exist
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-base md:text-lg text-light-textSecondary dark:text-dark-textSecondary mb-10 leading-relaxed max-w-md"
        >
          The page you&apos;re looking for might have been removed, renamed, or
          is temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/my-task"
            className="group flex items-center gap-2 bg-light-buttonPrimary dark:bg-dark-buttonPrimary hover:bg-light-buttonHover dark:hover:bg-dark-buttonHover text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-light-buttonPrimary/25 dark:shadow-dark-buttonPrimary/25 hover:shadow-light-buttonPrimary/40 dark:hover:shadow-dark-buttonPrimary/40 hover:-translate-y-0.5"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Todo List
          </Link>

          <Link
            href="/auth"
            className="flex items-center gap-2 bg-transparent border border-light-borderPrimary dark:border-dark-borderPrimary hover:bg-light-backgroundHover/10 dark:hover:bg-dark-backgroundHover text-light-textPrimary dark:text-dark-textPrimary font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Go to Login
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <p className="text-xs text-light-textMuted dark:text-dark-textMuted font-manrope">
          © {new Date().getFullYear()}{" "}
          <span className="text-light-buttonPrimary dark:text-dark-buttonPrimary font-semibold">
            NoteQuick
          </span>{" "}
          · All rights reserved
        </p>
      </motion.div>
    </main>
  );
}
