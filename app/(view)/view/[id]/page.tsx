import { PrismaClient } from "@prisma/client";
import Player from "../Player";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const { id } = params;
  const prisma = new PrismaClient();
  const upload = await prisma.upload.findUnique({ where: { id } });

  const title = upload?.sourceTitle ?? "ScreenLink Recording";
  const imageUrl = `https://image.mux.com/${upload?.playbackId}/thumbnail.png?width=1080&height=720&time=0`
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

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Player id={id} />
      </div>
    </section>
  );
}
