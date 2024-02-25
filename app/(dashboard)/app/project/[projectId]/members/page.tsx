import { getSession, prisma } from "@/app/utils";
import { redirect } from "next/navigation";
import { TeamMembers } from "./TeamMembers";
import { Role } from "@prisma/client";

export default async function Team({
  params,
}: {
  params: { projectId: string };
}) {
  const session = await getSession();
  if (!session.user) {
    redirect("/signin?redirect=/app");
  }

  const projectUsers = await prisma.projectUsers.findMany({
    where: {
      projectId: params.projectId,
      project: {
        users: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    include: {
      user: true,
      project: true,
    },
  });

  if (!projectUsers) {
    redirect("/app");
  }

  const currentUserRole =
    projectUsers.find((projectUser) => projectUser.userId === session.user.id)
      ?.role ?? Role.member;

  return (
    <section className="relative">
      <TeamMembers
        projectUsers={projectUsers}
        currentUserRole={currentUserRole}
        currentUser={session}
      />
    </section>
  );
}
