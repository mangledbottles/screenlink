"use client";
import { useEffect, useState } from "react";
import Video from "./Video";
import { VideoSkeleton } from "./VideoSkeleton";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Upload, User } from "@prisma/client";

export default function Player({
  id,
  video,
  isUploadReady,
}: {
  id: string;
  video: Upload & Partial<User>;
  isUploadReady: boolean;
}) {
  const [assetId, setAssetId] = useState<string | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [viewed, setViewed] = useState(false);

  let intervalId: NodeJS.Timeout | null = null;

  const fetchVideo = async () => {
    const res = await fetch(`/api/uploads/${id}`);
    const upload = await res.json();
    setFirstTimeLoading(false);
    if (!upload || res.status == 404) {
      setError(upload.error ?? "Video not found");
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    if (upload.status === "asset_created") {
      setAssetId(upload.assetId);
      setPlaybackId(upload.playbackId);
      setIsReady(upload.isReady);
      if (upload.isReady) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    } else if (upload.status === "errored") {
      setError(
        "There was an error processing your video. It could not be uploaded."
      );
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  };

  useEffect(() => {
    if (!isUploadReady) {
      console.log("upload not ready");
      // Set up the interval immediately
      intervalId = setInterval(fetchVideo, 3000);
    } else {
      console.log(
        `upload ready: ${isUploadReady} and assetId: ${video.assetId} and playbackId: ${video.playbackId}`
      );
      setAssetId(video.assetId);
      setPlaybackId(video.playbackId);
      setIsReady(true);
      setFirstTimeLoading(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id]);

  const trackView = async () => {
    if (viewed) return;
    const res = await fetch(`/api/uploads/${id}/view`, {
      method: "POST",
    });
    const json = await res.json();
    console.log({ json });
    setViewed(true);
  };

  if (error) {
    return (
      <div className="relative max-w-6xl mx-auto pt-12 md:pt-8">
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (firstTimeLoading) {
    return (
      <div className="relative max-w-6xl mx-auto pt-12 md:pt-8">
        <LoadingBanner message={"Loading video..."} />
        <VideoSkeleton />
      </div>
    );
  }

  if (!assetId || !playbackId || !isReady) {
    console.log({ assetId, playbackId, isReady, at: "loding" });
    return (
      <div className="relative max-w-6xl mx-auto pt-12 md:pt-8">
        <LoadingBanner
          message={
            "Video uploading or still processing... The video display when the processing is complete"
          }
        />
        <VideoSkeleton />
      </div>
    );
  }

  const baseUrl = "https://stream.mux.com";
  const backupSource =
    "https://stream.mux.com/yb2L3z3Z4IKQH02HYkf9xPToVYkOC85WA.m3u8";
  const videoSource = `${baseUrl}/${playbackId}.m3u8` || backupSource;
  const animatedPreview = `https://image.mux.com/${playbackId}/animated.gif?fps=15&width=640`;

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto">
        <div className="pt-2 md:pt-12" onClick={trackView}>
          <Video src={videoSource} animatedPreview={animatedPreview} />
        </div>
      </div>
    </section>
  );
}

const LoadingBanner = ({ message }: { message: string }) => {
  return (
    <div className="mb-4 rounded-md bg-blue-50 p-4 bg-indigo-400/10 px-2 font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
      <div className="flex">
        <div className="flex-shrink-0">
          <AiOutlineInfoCircle
            className="h-5 w-5 text-indigo-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-indigo-400">{message}</p>
        </div>
      </div>
    </div>
  );
};

export const ErrorBanner = ({ message }: { message: string }) => {
  return (
    <div className="mt-4 mb-4 rounded-md bg-pink-400/10 p-4 px-2 font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
      <div className="flex">
        <div className="flex-shrink-0">
          <AiOutlineInfoCircle
            className="h-5 w-5 text-pink-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-pink-400">{message}</p>
        </div>
      </div>
    </div>
  );
};
