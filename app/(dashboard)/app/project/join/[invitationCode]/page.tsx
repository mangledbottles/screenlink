import { getSession, prisma } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function JoinProjectPage({
  params,
}: {
  params: { invitationCode: string };
}) {
  const session = await getSession();
  if (!session.user) {
    redirect(`/signin?redirect=/app/project/join/${params.invitationCode}`);
  }
  const invitationCode = params.invitationCode;

  const project = await prisma.project.findUnique({
    where: {
      invitationCode: invitationCode,
      users: {
        none: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!project) {
    redirect(`/app`);
  }

  const handleAcceptInvite = async () => {
    "use server";
    await toast.promise(
      prisma.projectUsers.create({
        data: {
          userId: session.user.id,
          role: Role.member,
          projectId: project.id,
        },
      }),
      {
        loading: "Joining project...",
        success: "Successfully joined the project!",
        error: "Failed to join the project.",
      }
    );

    redirect(`/app/project/${project.id}`);
  };

  return (
    <form action={handleAcceptInvite}>
      <Button type="submit">Join project</Button>
    </form>
  );
}
