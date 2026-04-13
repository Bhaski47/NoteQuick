import { getUserProfile } from "@/actions/getUserProfile";
import ProfilePage from "./_components/ProfilePage";
import { notFound } from "next/navigation";
import { userProfileData } from "@/types";

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const data:userProfileData | null = await getUserProfile(params.username);

  if (!data) notFound();
  return <ProfilePage data={data} />;
}