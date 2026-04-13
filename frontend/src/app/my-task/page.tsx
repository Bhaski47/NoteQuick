"use server"
import Header from "./_components/Header";
import CheckBox from "./_components/CheckBox";
import { getAllTodos } from "@/actions/getAllTodos";
import { redirect } from "next/navigation";
import { getUserDetails } from "@/actions/getUserDetails";

export default async function TasksPage() {
  const todoData = await getAllTodos();
  if (todoData && "redirect" in todoData) {
    redirect(todoData.redirect);
  }
  const userDetails = await getUserDetails();
  if (userDetails && "redirect" in userDetails) {
    redirect(userDetails.redirect);
  }
  return (
    <main className="sm:ml-[15%] min-h-dvh">
      <Header />
      {todoData && userDetails && !("redirect" in todoData) && (
        <CheckBox userDetails={userDetails} />
      )}
    </main>
  );
}
