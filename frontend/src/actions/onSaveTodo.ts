"use server";
import { taskBoxProps } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CalendarDate } from "@internationalized/date";

function toIsoString(date?: CalendarDate | string): string | undefined {
  if (!date) return undefined;
  if (typeof date === "string") return date;
  const y = date.year;
  const m = String(date.month).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  return `${y}-${m}-${d}T12:00:00`;
}

export async function onSaveTodo(
  taskData: taskBoxProps,
  fromDate?: CalendarDate,
  toDate?: CalendarDate
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return;

    const apiHost =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.host ||
      "http://localhost:8080";

    const effectiveFrom = toIsoString(fromDate) ?? toIsoString(taskData.fromDate);
    const effectiveTo = toIsoString(toDate) ?? toIsoString(taskData.toDate);

    await axios.post(
      `${apiHost}/todos/updateTodo`,
      {
        ...taskData,
        fromDate: effectiveFrom,
        toDate: effectiveTo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    revalidatePath("/my-task");
  } catch (error) {
    console.warn("Failed to save todo:", error);
  }
}
