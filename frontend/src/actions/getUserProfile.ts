import { userProfileData } from "@/types";
import axios from "axios";

export async function getUserProfile(userName: string): Promise<userProfileData | null> {
  try {
    const apiHost =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.host ||
      "http://localhost:8080";
    const res = await axios.get(`${apiHost}/user/${encodeURIComponent(userName)}`);
    const profile = res.data?.data;
    if (!profile || !profile.userName || profile.userName === "-") {
      return null;
    }
    return profile as userProfileData;
  } catch (error) {
    console.warn("Error fetching user profile:", error);
    return null;
  }
}