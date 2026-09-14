"use server";
import { allTodos } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export async function getAllTodos(options?: {
  status?: string;
  order?: "DESC" | "ASC";
}): Promise<allTodos | null | { redirect: string }> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { redirect: "/auth" };
    }
    const apiHost =
      process.env.host ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080";

    const res = await axios.post(
      `${apiHost}/todos/getTodos`,
      {
        status: options?.status || "ALL",
        order: options?.order || "DESC",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = res.data?.data ?? res.data;
    return (Array.isArray(data) ? data : []) as allTodos;
  } catch (error) {
    console.warn("Error fetching todo details:", error);
    return null;
  }
}
