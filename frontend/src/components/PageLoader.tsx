import React from "react";

interface PageLoaderProps {
  text?: string;
  className?: string;
}

export default function PageLoader({
  text = "Loading...",
  className = "",
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-label={text}
      className={`w-full min-h-[50vh] flex flex-col items-center justify-center p-8 bg-transparent ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-11 h-11 rounded-full border-3 border-light-borderDivider dark:border-dark-borderDivider border-t-light-buttonPrimary dark:border-t-dark-buttonPrimary animate-spin" />
        </div>
        <p className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary animate-pulse tracking-wide font-manrope">
          {text}
        </p>
      </div>
    </div>
  );
}
