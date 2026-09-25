import PageLoader from "@/components/PageLoader";

export default function CalendarLoading() {
  return (
    <main className="sm:ml-[15%] min-h-dvh px-7 bg-light-backgroundColor dark:bg-dark-backgroundColor">
      <div className="pt-8 pb-4">
        <div className="h-8 w-44 bg-light-borderDivider/50 dark:bg-dark-borderDivider/30 rounded-lg animate-pulse mb-6" />
      </div>
      <PageLoader text="Loading calendar..." />
    </main>
  );
}
