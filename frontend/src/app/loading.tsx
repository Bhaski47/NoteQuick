import PageLoader from "@/components/PageLoader";

export default function RootLoading() {
  return (
    <div className="sm:ml-[15%] min-h-dvh flex items-center justify-center bg-light-backgroundColor dark:bg-dark-backgroundColor">
      <PageLoader text="Loading..." />
    </div>
  );
}
