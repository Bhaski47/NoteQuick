import { User } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export async function getUserDetails(): Promise<
  User | null | { redirect: string }
> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { redirect: "/auth" };
    }
    let res = await axios.get(`${process.env.host}/user/getUserDetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res = res.data;
    return res.data[0] as User;
  } catch (error) {
    console.warn("Error fetching user details:", error);
    return null;
  }
}
