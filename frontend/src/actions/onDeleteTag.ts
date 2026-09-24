"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function onDeleteTag(
  tagId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const apiHost =
      process.env.host ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080";

    const res = await axios.delete(`${apiHost}/tags/${tagId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revalidatePath("/tags");
    revalidatePath("/my-task");
    return {
      success: true,
      message: res.data?.message || "Tag deleted successfully",
    };
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.message
        ? (error.response.data.message as string)
        : error instanceof Error
        ? error.message
        : "Failed to delete tag";
    return { success: false, message };
  }
}
