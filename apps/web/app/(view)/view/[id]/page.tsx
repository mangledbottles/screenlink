import { Upload, User } from "@prisma/client";
import Player, { ErrorBanner } from "./_components/Player";
import { Metadata } from "next";
import Mux, { Upload as MuxUpload } from "@mux/mux-node";
import { posthog_serverside, prisma } from "@/app/utils";
import { ViewHeader } from "./_components/ViewHeader";
import { ReactionToolbar } from "./_components/EmojiToolbar";

export type UserUpload = Upload & {
  User: User | null;
};

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const { id } = params;
  const upload = await prisma.upload.findUnique({ where: { id } });

  posthog_serverside.capture({
    // distinctId: upload?.uploadId!,
    distinctId: upload?.userId!,
    event: "Video Metadata Viewed",
    properties: {
      ...upload,
    },
    groups: {
      projectId: upload?.projectId!,
    },
  });

  const title = upload?.sourceTitle ?? "ScreenLink Recording";
  const imageUrl = `https://image.mux.com/${upload?.playbackId}/thumbnail.png?width=1080&height=720&time=0`;
  return {
    title: `Watch ${title} | ScreenLink`,
    description: `Easily capture and share your screen with ScreenLink. Watch "${title}" now for a seamless viewing experience!`,
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 720,
          alt: title,
        },
      ],
      type: "video.movie",
    },
  };
};

const getUpload = async (Video: any, uploadId: string): Promise<MuxUpload> => {
  try {
    const upload = await Video.Uploads.get(uploadId);
    return upload;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default async function View({ params }: { params: { id: string } }) {
  const { id } = params;
  let errorMessage;
  let upload = await prisma.upload.findUnique({
    where: { id },
    include: { User: true, reactions: true },
  });

  posthog_serverside.capture({
    distinctId: upload?.userId!,
    event: "Video Viewed",
    properties: {
      ...upload,
    },
    groups: {
      projectId: upload?.projectId!,
    },
  });

  const isUploadDevelopment = upload?.provider == "mux-dev";
  const { Video } = new Mux(
    isUploadDevelopment
      ? process.env.MUX_DEV_ACCESS_TOKEN!
      : process.env.MUX_ACCESS_TOKEN!,
    isUploadDevelopment
      ? process.env.MUX_DEV_SECRET_KEY!
      : process.env.MUX_SECRET_KEY!
  );

  // If there is no Asset ID, but there is an Upload ID, check Mux for the status of the upload
  if (!upload?.assetId && upload?.uploadId) {
    const muxUpload = await getUpload(Video, upload.uploadId);
    if (muxUpload.status === "asset_created") {
      const video = await Video.Assets.get(muxUpload.asset_id!);
      const playbackId = video?.playback_ids?.[0]?.id;

      upload = await prisma.upload.update({
        where: { id },
        data: {
          status: "asset_created",
          assetId: muxUpload.asset_id,
          playbackId,
        },
        include: { User: true, reactions: true },
      });
    }
  }

  // Get the Mux video asset
  let muxVideo = null;
  try {
    muxVideo = upload?.assetId ? await Video.Assets.get(upload?.assetId) : null;
  } catch (error) {
    console.error("Error fetching Mux video asset:", error);
    errorMessage = "Video file not found. It may have been deleted.";
  }
  if (upload?.assetId && !errorMessage && (!upload || !muxVideo)) {
    console.log({ errorMessage, upload, muxVideo });
    errorMessage = "Video not found";
  }

  // Check if the video is ready
  const isReady = muxVideo?.status === "ready" ?? false;

  const reactions = upload?.reactions.reduce((acc, reaction) => {
    if (acc[reaction.emoji]) {
      acc[reaction.emoji].count++;
    } else {
      acc[reaction.emoji] = { emoji: reaction.emoji, count: 1 };
    }
    return acc;
  }, {} as Record<string, { emoji: string; count: number }>);

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {upload && <ViewHeader upload={upload} />}
          {errorMessage || !upload ? (
            <ErrorBanner
              message={errorMessage ?? "Video could not be loaded"}
            />
          ) : (
            <>
              <Player id={id} video={upload} isUploadReady={isReady} />
              <ReactionToolbar uploadId={upload.id} />
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Reactions
                </h2>
                <div className="mt-4 flex flex-wrap gap-4">
                  {Object.values(reactions ?? {}).map(({ emoji, count }) => (
                    <div
                      key={emoji}
                      className="flex items-center space-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1"
                    >
                      <span className="text-xl">{emoji}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
