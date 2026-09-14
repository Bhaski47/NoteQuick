"use server";
import { allTodos } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export async function searchTodos(
  query: string,
  status: string = "ALL"
): Promise<allTodos | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return null;
    }
    const apiHost =
      process.env.host ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080";

    const res = await axios.post(
      `${apiHost}/todos/searchTodo`,
      { query, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data?.data ?? res.data;
    return (Array.isArray(data) ? data : []) as allTodos;
  } catch (error) {
    console.warn("Error searching todos:", error);
    return null;
  }
}
