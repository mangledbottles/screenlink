import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  AiOutlineDownload,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import TeamSwitcher from "@/components/TeamSwitcher";
import DashboardStatistics from "@/components/DashboardStatistics";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin?redirect=/app");
  }

  const prisma = new PrismaClient();
  // @ts-ignore
  const userId = session?.user?.id;
  if (!userId) return redirect("/signin");
  const videos = await prisma.upload.findMany({
    where: {
      // @ts-ignore
      User: {
        id: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const projects = await prisma.project.findMany({
    where: {
      // @ts-ignore
      users: {
        some: {
          userId,
        },
      },
    },
  });

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20 ">
          <TeamSwitcher projects={projects} className="mb-3" />
          <DashboardStatistics />
          <div
            key="1"
            className="flex flex-col rounded overflow-hidden bg-slate-800 bg-opacity-60 "
          >
            <header className="rounded overflow-hidden">
              <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                <h1 className="text-md font-semibold">Video Library</h1>
              </div>
            </header>
            <main className="flex-1 p-4 rounded overflow-hidden">
              {videos.length === 0 && <NoUploads />}
              <div className="grid grid-cols-3 gap-4">
                {videos.map((video) => {
                  const previewUrl = `https://image.mux.com/${video?.playbackId}/thumbnail.png?width=1080&height=720&time=0`;
                  // const animatedPreviewUrl = `https://image.mux.com/${video?.playbackId}/animated.gif`;

                  return (
                    <div className="group" key={video.id}>
                      <Link href={`/view/${video.id}`}>
                        <div className="relative aspect-w-16 aspect-h-9 bg-slate-800  bg-opacity-60 ">
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
                          />
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
                      <h2 className="mt-2 text-sm font-semibold">
                        {video?.sourceTitle} Recording
                      </h2>
                      <div className="flex items-center justify-between  pt-2 rounded">
                        <div className="text-xs">
                          {formatDistanceToNow(new Date(video.createdAt))} ago
                        </div>
                        <div className="text-xs">0 views</div>
                        <button>
                          <svg
                            className=" h-6 w-6"
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
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" x2="12" y1="2" y2="15" />
                          </svg>
                          <span className="sr-only">Share video</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

const NoUploads = () => {
  return (
    <div className="text-center my-6">
      {/* mx-auto h-12 w-12 text-gray-400 */}
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
