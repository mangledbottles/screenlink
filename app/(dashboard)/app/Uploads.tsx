"use client";

import { IconShareUploadButton } from "@/app/(view)/view/[id]/ShareUploadButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { AiOutlineDownload, AiOutlineVideoCameraAdd } from "react-icons/ai";

interface Upload {
  id: string;
  provider: string;
  uploadLink: string;
  assetId: string;
  uploadId: string;
  playbackId: string;
  status: string;
  sourceTitle: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  userId: string;
  views: number;
  deviceId: string;
}

const fetchUploads = async ({ pageParam = { offset: 0, limit: 10 } }) => {
  const { offset, limit } = pageParam;
  const res = await fetch(`/api/uploads?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error("Network response was not ok");
  const data = (await res.json()) as { uploads: Upload[]; total: number };
  const hasMore = offset + limit < data.total;
  return {
    ...data,
    nextPage: hasMore ? { offset: offset + limit, limit } : undefined,
  };
};

export default function Uploads() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["uploads"],
      queryFn: fetchUploads,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined,
    });

  const observer = useRef<IntersectionObserver>();
  const lastUploadRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // Flatten the pages of uploads into a single array for a continuous grid
  const allUploads = data?.pages.flatMap((page) => page.uploads) || [];

  return (
    <main className="flex-1 p-4 rounded overflow-hidden">
      {!isFetchingNextPage && !isFetching && allUploads.length === 0 && (
        <NoUploads />
      )}
      <div className="grid grid-cols-3 gap-4">
        {allUploads.map((upload) => (
          upload && <Upload upload={upload} key={upload.id} />
        ))}
        {(isFetchingNextPage || isFetching) && <UploadSkeleton quantity={10} />}
      </div>

      {hasNextPage && (
        <span
          ref={lastUploadRef}
          className="mt-4 text-center inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30"
        >
          <ArrowDownIcon className="w-4 h-4 mr-2" />
          {!isFetching && isFetchingNextPage
            ? "Loading more..."
            : "Scroll to load more"}
        </span>
      )}
    </main>
  );
}

const Upload = ({ upload }: { upload: Upload }) => {
  const previewUrl = `https://image.mux.com/${upload?.playbackId}/thumbnail.png?width=1080&height=720&time=0`;
  const [previewError, setPreviewError] = useState(false);
  return (
    <div className="group flex flex-col" key={upload.id}>
      <Link href={`/view/${upload.id}`}>
        <div className="relative aspect-w-16 aspect-h-9 ">
          {!previewError ? (
            <img
              alt=""
              className="object-cover"
              height="720"
              src={previewUrl}
              style={{
                aspectRatio: "1280/720",
                objectFit: "cover",
              }}
              width="1280"
              onError={() => setPreviewError(true)}
            />
          ) : (
            <div
              className="w-full h-40 bg-gray-300 dark:bg-gray-800 animate-pulse mb-auto"
              style={{ minHeight: "166px" }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="group-hover:scale-105 transition-transform group-hover:text-gray-600">
              <svg
                className="h-8 w-8 text-gray-300"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span className="sr-only">Play video</span>
            </button>
          </div>
        </div>
      </Link>
      <div className="mt-auto">
        <h2 className="mt-2 text-sm font-semibold">
          {upload?.sourceTitle} Recording
        </h2>
        <div className="flex items-center justify-between pt-2 rounded">
          <div className="text-xs">
            {formatDistanceToNow(new Date(upload.createdAt))} ago
          </div>
          <div className="text-xs">
            {upload.views} {upload.views === 1 ? "view" : "views"}
          </div>
          <IconShareUploadButton uploadId={upload.id} />
        </div>
      </div>
    </div>
  );
};

export const UploadSkeleton = ({ quantity }: { quantity: number }) => {
  return Array.from({ length: quantity }).map((_, i) => (
    <div className="group animate-pulse">
      <div className="relative aspect-w-16 aspect-h-9">
        <div
          className="w-full h-40 bg-gray-300 dark:bg-gray-800"
          style={{ height: "166px" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-800 rounded-full" />
        </div>
      </div>
      <h2 className="mt-2 h-4 bg-gray-300 dark:bg-gray-800 rounded w-3/4" />
      <div className="flex items-center justify-between pt-2 rounded">
        <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-1/4" />
      </div>
    </div>
  ));
};

const NoUploads = () => {
  return (
    <div className="text-center my-6">
      <AiOutlineVideoCameraAdd className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-100">
        No Uploaded Videos
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        You have not recorded any videos yet! Download the desktop app to get
        started.
      </p>
      <div className="mt-6">
        <Link href="/download">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <AiOutlineDownload
              className="-ml-0.5 mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            Download
          </button>
        </Link>
      </div>
    </div>
  );
};
