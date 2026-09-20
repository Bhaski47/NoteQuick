"use server";
import { CalendarEvent } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export async function getCalendarDetails(
  fromDate: string | undefined = undefined,
  toDate: string | undefined = undefined
): Promise<CalendarEvent[] | null | { redirect: string }> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { redirect: "/auth" };
    }
    const apiHost =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.host ||
      "http://localhost:8080";

    const formatToBackendDate = (d: string | undefined, fallback: Date): string => {
      if (!d) {
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${pad(fallback.getDate())}/${pad(fallback.getMonth() + 1)}/${fallback.getFullYear()}`;
      }
      if (d.includes("/")) return d;
      if (d.includes("-")) {
        const parts = d.split("T")[0].split("-");
        if (parts.length === 3) {
          return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
        }
      }
      return d;
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const effectiveFrom = formatToBackendDate(fromDate, startOfMonth);
    const effectiveTo = formatToBackendDate(toDate, endOfMonth);

    const res = await axios.post(
      `${apiHost}/calendar/getCalendarDetails`,
      {
        fromDate: effectiveFrom,
        toDate: effectiveTo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data?.data ?? res.data;
    return (Array.isArray(data) ? data : []) as CalendarEvent[];
  } catch (error) {
    console.warn("Error fetching calendar details:", error);
    return null;
  }
}
