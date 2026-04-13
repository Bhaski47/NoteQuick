
import { getUserDetails } from "@/actions/getUserDetails";
import { redirect } from "next/navigation";
import CalendarComponent from "./_components/Calendar";

export const dynamic = 'force-dynamic';
export default async function CalendarPage() {
  const userDetails = await getUserDetails();
  if (userDetails && "redirect" in userDetails) {
    redirect(userDetails.redirect);
  }


  return (
    <main className="sm:ml-[15%] min-h-dvh px-7">
      {userDetails && <CalendarComponent userDetails={userDetails} />}
    </main>
  );
}
