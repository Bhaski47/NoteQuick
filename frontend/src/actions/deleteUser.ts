"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function deleteUser() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { redirect: "/auth" };
    }
    await axios.get(`${process.env.host}/user/deleteUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.warn("Failed to delete account", error);
    return null;
  }
}
