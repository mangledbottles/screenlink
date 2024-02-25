import { Skeleton } from "@/components/ui/skeleton";
import { UploadSkeleton } from "./Uploads";

export default function Loading() {
  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20 ">
          {/* Skeletons container for the header */}
          <Skeleton className="h-10 w-1/5 mb-4" />
          <div className="flex justify-center items-center space-x-2">
            {" "}
            <Skeleton className="h-32 w-1/2" />
            <Skeleton className="h-32 w-1/2" />
          </div>
          <div className="my-2">
            {" "}
            {/* Upload Skeleton */}
            <main className="flex-1 p-4 rounded overflow-hidden">
              <div className="grid grid-cols-3 gap-4">
                <UploadSkeleton quantity={9} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
