"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function deleteUser() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { redirect: "/auth" };
    }
    const apiHost =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.host ||
      "http://localhost:8080";
    await axios.delete(`${apiHost}/user/deleteUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    (await cookies()).delete("token");
    return { redirect: "/auth" };
  } catch (error) {
    console.warn("Failed to delete account", error);
    return null;
  }
}
