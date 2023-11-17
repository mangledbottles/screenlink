import { PrismaClient, Upload, User } from "@prisma/client";
import Player from "../Player";
import { Metadata } from "next";
import { AiOutlineLink } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import { ShareUploadButton } from "./ShareUploadButton";

type UserUpload = Upload & {
  User: User | null;
};

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const { id } = params;
  const prisma = new PrismaClient();
  const upload = await prisma.upload.findUnique({ where: { id } });

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
    },
  };
};

export default async function View({ params }: { params: { id: string } }) {
  const { id } = params;

  const prisma = new PrismaClient();
  const upload = await prisma.upload.findUnique({
    where: { id },
    include: { User: true },
  });

  // function classNames(...classes) {
  //   return classes.filter(Boolean).join(" ");
  // }
  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {upload && <ViewHeader upload={upload} />}
          <Player id={id} />
        </div>
      </div>
    </section>
  );
}

const ViewHeader = ({ upload }: { upload: UserUpload }) => {
  return (
    <header>
      <div className="mx-auto flex items-center justify-between gap-x-8 lg:mx-0 max-w-none mt-16">
        <div className="flex items-center gap-x-6">
          <h1>
            <div className="mt-1 text-base font-semibold leading-6 text-gray-900 dark:text-gray-200">
              Watch {upload.sourceTitle}
            </div>
            <div className="text-sm leading-6 text-gray-500 dark:text-gray-300">
              by {upload.User?.name ?? "Unknown"} |{" "}
              {formatDistanceToNow(new Date(upload.createdAt))} ago
            </div>
          </h1>
        </div>
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <ShareUploadButton uploadId={upload.id} />
        </div>
      </div>
    </header>
  );
};
