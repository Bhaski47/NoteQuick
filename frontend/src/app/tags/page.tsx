import { getAllTags } from "@/actions/getAllTags";
import { getUserDetails } from "@/actions/getUserDetails";
import { redirect } from "next/navigation";
import TagsClient from "./_components/TagsClient";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const userDetails = await getUserDetails();
  if (userDetails && "redirect" in userDetails) {
    redirect(userDetails.redirect || "/auth");
  }

  const tagsData = await getAllTags();
  if (tagsData && "redirect" in tagsData) {
    redirect(tagsData.redirect || "/auth");
  }

  return (
    <main className="sm:ml-[15%] min-h-dvh w-full sm:w-[85%] bg-light-backgroundColor dark:bg-dark-backgroundColor flex flex-col">
      <TagsClient
        initialTags={Array.isArray(tagsData) ? tagsData : []}
        userDetails={userDetails}
      />
    </main>
  );
}
