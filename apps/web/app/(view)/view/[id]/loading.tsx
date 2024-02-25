import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20 ">
          {/* Skeletons container for the header */}
          <Skeleton className="h-10 w-1/4 mb-2" />

          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6 mb-4">
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/6" />
          </div>
          <div className="flex justify-center items-center space-x-2">
            {" "}
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
