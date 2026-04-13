"use server";
import TabNavigate from "@/app/settings/_components/TabNavigate";
import { redirect } from "next/navigation";
import { getUserDetails } from "@/actions/getUserDetails";
import UserStoreInit from "./_components/UserStoreInit";

export default async function SettingsPage() {
  const userDetails = await getUserDetails();
  if (userDetails && "redirect" in userDetails) {
    redirect("/auth");
  }
  return (
    <main className="sm:ml-[15%] min-h-dvh">
      <h1 className="text-2xl font-bold text-textPrimary pl-7 pt-8 pb-[1.5%] w-full">
        SETTINGS
      </h1>
      {userDetails && <UserStoreInit user={userDetails} />}
      {userDetails && <TabNavigate userDetails={userDetails} />}
    </main>
  );
}
