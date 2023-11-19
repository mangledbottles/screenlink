import { PrismaClient, Upload, User } from "@prisma/client";
import Player from "../Player";
import { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { ShareUploadButton } from "./ShareUploadButton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarIcon, PersonIcon } from "@radix-ui/react-icons";

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
            <div className="mt-1 text-base font-semibold leading-6 text-gray-200 dark:text-gray-200">
              Watch {upload.sourceTitle}
            </div>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <PersonIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                by {upload.User?.name ?? "Unknown"}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <CalendarIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <HoverCard>
                  <HoverCardTrigger className="cursor-pointer">
                    {formatDistanceToNow(new Date(upload.createdAt))} ago
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                      <span className="text-xs text-muted-foreground">
                        {new Date(upload.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}{" "}
                        at{" "}
                        {new Date(upload.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
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
