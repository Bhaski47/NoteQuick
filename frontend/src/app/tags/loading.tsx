import PageLoader from "@/components/PageLoader";

export default function TagsLoading() {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center py-12">
      <PageLoader text="Loading tags..." />
    </div>
  );
}
