"use client";
import { ActionButtonProps } from "@/types";
import React from "react";

export default function ActionButton({
  name,
  onClick,
  className,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-7 w-full py-2 mb-6 border border-borderPrimary rounded-md text-textPrimary text-lg font-bold text-left pl-4
        ${className}`}
    >
      {name}
    </button>
  );
}
