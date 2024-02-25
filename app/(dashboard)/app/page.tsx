import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { AiOutlineDownload, AiOutlineVideoCameraAdd } from "react-icons/ai";
import TeamSwitcher from "@/components/TeamSwitcher";
import DashboardStatistics from "@/components/DashboardStatistics";
import { IconShareUploadButton } from "@/app/(view)/view/[id]/ShareUploadButton";
import { redirect } from "next/navigation";
import Uploads from "./Uploads";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin?redirect=/app");
  }

  const prisma = new PrismaClient();
  // @ts-ignore
  const userId = session?.user?.id;
  if (!userId) return redirect("/signin");

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

  // TODO: implement some logic behind changing projectId under user column
  // const changeProject = async (projectIdToChangeTo: string) => {
  //   "use server";
  // };

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
            <Uploads />
          </div>
        </div>
      </div>
    </section>
  );
}
