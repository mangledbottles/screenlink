import { getSession, prisma } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { AcceptInvite } from "./AcceptInvite";
import { NotEnoughSeats } from "./NotEnoughSeats";

export default async function JoinProjectPage({
  params,
}: {
  params: { invitationCode: string };
}) {
  const session = await getSession();
  const invitationCode = params.invitationCode;

  const project = await prisma.project.findUnique({
    where: {
      invitationCode: invitationCode,
      users: {
        none: {
          userId: session?.user?.id,
        },
      },
    },
    select: {
      id: true,
      projectSeats: true,
      name: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  if (!project) {
    redirect(`/app`);
  }

  const handleAcceptInvite = async () => {
    "use server";
    await prisma.projectUsers.create({
      data: {
        userId: session.user.id,
        role: Role.member,
        projectId: project.id,
      },
    });

    await prisma.user.update({
      data: {
        currentProjectId: project.id,
      },
      where: {
        id: session.user.id,
      },
    });

    return;
  };

  if(project.projectSeats <= project._count.users) {
    return <NotEnoughSeats projectName={project.name} />
  }

  return (
    <AcceptInvite handleAcceptInvite={handleAcceptInvite} projectId={project.id} />
  );
}
