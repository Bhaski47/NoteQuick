"use server";
import { allTodos } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export async function getAllTodos(): Promise<
  allTodos | null | { redirect: string }
> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { redirect: "/auth" };
    }
    let res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/todos/getTodos`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res = res.data;
    return res.data as allTodos;
  } catch (error) {
    console.warn("Error fetching todo details:", error);
    return null;
  }
}
