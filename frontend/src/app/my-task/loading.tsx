import PageLoader from "@/components/PageLoader";

export default function TasksLoading() {
  return (
    <main className="sm:ml-[15%] min-h-dvh bg-light-backgroundColor dark:bg-dark-backgroundColor">
      <div className="sm:ml-7 px-7 pt-8 pb-4">
        <div className="h-8 w-36 bg-light-borderDivider/50 dark:bg-dark-borderDivider/30 rounded-lg animate-pulse mb-6" />
      </div>
      <PageLoader text="Loading tasks..." />
    </main>
  );
}
