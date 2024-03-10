export const VideoSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full rounded-xl overflow-hidden bg-gray-300 dark:bg-gray-800 h-96" />
      <div className="py-2 grid gap-2">
        <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-1/2" />
      </div>
      <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded w-full" />
    </div>
  );
};
