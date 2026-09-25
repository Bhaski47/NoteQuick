import PageLoader from "@/components/PageLoader";

export default function SettingsLoading() {
  return (
    <main className="sm:ml-[15%] min-h-dvh bg-light-backgroundColor dark:bg-dark-backgroundColor">
      <div className="pl-7 pt-8 pb-[1.5%]">
        <div className="h-8 w-40 bg-light-borderDivider/50 dark:bg-dark-borderDivider/30 rounded-lg animate-pulse mb-6" />
      </div>
      <PageLoader text="Loading settings..." />
    </main>
  );
}
