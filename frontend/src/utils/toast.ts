import { addToast } from "@heroui/react";

/**
 * Toast notification utility perfectly styled for NoteQuick's light and dark themes.
 * Uses HeroUI's built-in toast system with custom classes matching the app's palette.
 */
export const toast = {
  success: (title: string, description?: string) => {
    return addToast({
      title,
      description,
      color: "success",
      severity: "success",
      timeout: 3500,
      shouldShowTimeoutProgress: true,
      classNames: {
        base: "font-manrope rounded-xl bg-white dark:bg-[#202127] border border-emerald-500/30 dark:border-emerald-500/40 shadow-xl shadow-emerald-500/10 dark:shadow-black/50 py-2.5 px-3",
        title: "text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary",
        description: "text-xs text-light-textSecondary dark:text-dark-textSecondary mt-0.5",
        icon: "text-emerald-500 dark:text-emerald-400 text-lg",
        closeButton: "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary",
        progressIndicator: "bg-emerald-500 dark:bg-emerald-400",
      },
    });
  },

  error: (title: string, description?: string) => {
    return addToast({
      title,
      description,
      color: "danger",
      severity: "danger",
      timeout: 4500,
      shouldShowTimeoutProgress: true,
      classNames: {
        base: "font-manrope rounded-xl bg-white dark:bg-[#202127] border border-rose-500/30 dark:border-rose-500/40 shadow-xl shadow-rose-500/10 dark:shadow-black/50 py-2.5 px-3",
        title: "text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary",
        description: "text-xs text-rose-600 dark:text-rose-400 mt-0.5",
        icon: "text-rose-500 dark:text-rose-400 text-lg",
        closeButton: "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary",
        progressIndicator: "bg-rose-500 dark:bg-rose-400",
      },
    });
  },

  info: (title: string, description?: string) => {
    return addToast({
      title,
      description,
      color: "primary",
      severity: "primary",
      timeout: 3500,
      shouldShowTimeoutProgress: true,
      classNames: {
        base: "font-manrope rounded-xl bg-white dark:bg-[#202127] border border-[#6457F9]/30 dark:border-[#8B5CF6]/40 shadow-xl shadow-[#6457F9]/10 dark:shadow-black/50 py-2.5 px-3",
        title: "text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary",
        description: "text-xs text-light-textSecondary dark:text-dark-textSecondary mt-0.5",
        icon: "text-[#6457F9] dark:text-[#8B5CF6] text-lg",
        closeButton: "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary",
        progressIndicator: "bg-[#6457F9] dark:bg-[#8B5CF6]",
      },
    });
  },

  warning: (title: string, description?: string) => {
    return addToast({
      title,
      description,
      color: "warning",
      severity: "warning",
      timeout: 4000,
      shouldShowTimeoutProgress: true,
      classNames: {
        base: "font-manrope rounded-xl bg-white dark:bg-[#202127] border border-amber-500/30 dark:border-amber-500/40 shadow-xl shadow-amber-500/10 dark:shadow-black/50 py-2.5 px-3",
        title: "text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary",
        description: "text-xs text-amber-700 dark:text-amber-400 mt-0.5",
        icon: "text-amber-500 dark:text-amber-400 text-lg",
        closeButton: "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary",
        progressIndicator: "bg-amber-500 dark:bg-amber-400",
      },
    });
  },
};
