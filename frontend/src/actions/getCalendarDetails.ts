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
    let res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/calendar/getCalendarDetails`,
      {
        fromDate:"2025-04-01",
        toDate:"2025-04-31"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res = res.data;
    console.log("res.data");
    console.log(res.data);

    return res.data as CalendarEvent[];
  } catch (error) {
    console.warn("Error fetching calendar details:", error);
    return null;
  }
}
