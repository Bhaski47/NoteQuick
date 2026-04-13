import { CustomDayColumnWrapperProps } from "@/types/calendar";
import React from "react";

export default function CustomDayColumnWrapper({
  children,
}: CustomDayColumnWrapperProps) {
  return <div className="rbc-day-slot">{children}</div>;
}
