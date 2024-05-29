import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import TeamSwitcher from "@/components/TeamSwitcher";
import DashboardStatistics from "@/components/DashboardStatistics";
import { redirect } from "next/navigation";
import Uploads from "./Uploads";
import { prisma } from "@/app/utils";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin?redirect=/app");
  }
  // @ts-ignore
  const userId = session?.user?.id;
  // @ts-ignore
  const currentProjectId = session?.user?.currentProjectId;
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

  const isUserOwner =
    !!(await prisma.projectUsers.findFirst({
      where: {
        projectId: currentProjectId,
        userId,
        role: Role.owner,
      },
    })) ?? false;

  const projectUsers =
    isUserOwner && currentProjectId
      ? await prisma.projectUsers
          .findMany({
            where: {
              projectId: currentProjectId,
            },
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          })
          .then((users) => {
            return users.map((user) => {
              return {
                id: user.userId,
                name: user.user?.name || "",
                role: user.role,
              };
            });
          })
      : [];

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20 ">
          <TeamSwitcher
            projects={projects}
            className="mb-3"
            currentProjectId={currentProjectId}
          />
          <DashboardStatistics />
          <div
            key="1"
            className="flex flex-col rounded overflow-hidden bg-slate-800 bg-opacity-60 "
          >
            <header className="rounded overflow-hidden">
              <div className="max-w-7xl mx-auto flex items-center justify-between px-4 pt-4">
                <h1 className="text-md font-semibold">Video Library</h1>
              </div>
            </header>
            <Uploads
              projectId={currentProjectId}
              projectUsers={projectUsers}
              currentUserId={userId}
              isUserOwner={isUserOwner}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
