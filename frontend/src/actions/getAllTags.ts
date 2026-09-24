"use server";
import { Tag } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export async function getAllTags(): Promise<Tag[] | null | { redirect: string }> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { redirect: "/auth" };
    }
    const apiHost =
      process.env.host ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080";

    const res = await axios.get(`${apiHost}/tags`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data?.data ?? [];
    return (Array.isArray(data) ? data : []) as Tag[];
  } catch (error) {
    console.warn("Error fetching tags:", error);
    return null;
  }
}
