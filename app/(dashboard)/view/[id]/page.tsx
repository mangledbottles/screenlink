"use client";
import { useEffect, useState } from "react";
import VideoPlayer from "../VideoPlayer";

export default function View({ params }: { params: { id: string } }) {
  const { id } = params;
  const [assetId, setAssetId] = useState<string | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchVideo = async () => {
      const res = await fetch(`/api/uploads/${id}`);
      const upload = await res.json();
      setFirstTimeLoading(false);
      if (!upload) {
        setError("Video not found");
        return;
      }

      if (upload.status === "asset_created") {
        setAssetId(upload.assetId);
        setPlaybackId(upload.playbackId);
        setIsReady(upload.isReady);
      } else if (upload.status === "errored") {
        setError(
          "There was an error processing your video. It could not be uploaded."
        );
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Call fetchVideo immediately
    fetchVideo().then(() => {
      // Then set up the interval
      intervalId = setInterval(fetchVideo, 2000);
    });

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id]);

  if (error) {
    return (
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-32 md:pt-40">
        {error}
      </div>
    );
  }

  if (firstTimeLoading) {
    return (
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-32 md:pt-40">
        Loading...
      </div>
    );
  }

  if (!assetId || !playbackId || !isReady) {
    return (
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-32 md:pt-40">
        Video uploading or still processing...
      </div>
    );
  }

  const baseUrl = "https://stream.mux.com";
  const backupSource =
    "https://stream.mux.com/yb2L3z3Z4IKQH02HYkf9xPToVYkOC85WA.m3u8";
  const videoSource = `${baseUrl}/${playbackId}.m3u8` || backupSource;

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">
          <VideoPlayer src={videoSource} />
        </div>
      </div>
    </section>
  );
}
