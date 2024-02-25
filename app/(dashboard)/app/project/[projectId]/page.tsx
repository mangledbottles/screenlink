import { getSession, prisma } from "@/app/utils";
import { redirect } from "next/navigation";
import { TeamMembers } from "./members/TeamMembers";
import Image from "next/image";
import { SidebarNav } from "./SideBar";
import { Separator } from "@/components/ui/separator";
import { ProjectSettings } from "./GeneralSettings";

export default async function Team({
  params,
}: {
  params: { projectId: string };
}) {
  const session = await getSession();
  if (!session.user) {
    redirect("/signin?redirect=/app");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: params.projectId,
    },
    include: {
      users: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  // Check if the current session user is the owner of the project
  const isUserOwner = project?.users.some(
    (user) => user.userId === session.user.id && user.role === "owner"
  ) ?? false;

  if (!project) {
    redirect("/app");
  }

  return (
    <section className="relative">
      <ProjectSettings project={project} isUserOwner={isUserOwner} />
    </section>
  );
}
