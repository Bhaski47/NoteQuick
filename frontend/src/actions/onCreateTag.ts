"use server";
import { Tag } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function onCreateTag(
  name: string
): Promise<{ success: boolean; data?: Tag; message?: string }> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const apiHost =
      process.env.host ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080";

    const res = await axios.post(
      `${apiHost}/tags`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    revalidatePath("/tags");
    const createdTag = res.data?.data as Tag;
    return {
      success: true,
      data: createdTag,
      message: res.data?.message || "Tag created",
    };
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.message
        ? (error.response.data.message as string)
        : error instanceof Error
        ? error.message
        : "Failed to create tag";
    return { success: false, message };
  }
}
