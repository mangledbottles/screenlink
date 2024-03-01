import { getSession, prisma } from "@/app/utils";
import { redirect } from "next/navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: {
    invitationCode: string;
  };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const session = await getSession();
  if (!session?.user) {
    redirect(`/signin?redirect=/app/project/join/${params.invitationCode}`);
  }

  const invitationCode = params.invitationCode;
  const project = await prisma.project.findUnique({
    where: {
      invitationCode: invitationCode,
    },
  });

  if (!project) {
    redirect("/app");
  }

  return (
    <>
      <div className="mt-16"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <div className="hidden space-y-6 p-6  pb-16 md:block bg-[#0E131D] rounded-lg">
          <div className="space-y-0.5 pt-2 pr-60">
            <h2 className="text-2xl font-bold tracking-tight">
              Project Invitation
            </h2>
            <p className="text-muted-foreground">
              You have been invited to join project {project.name} 🚀
            </p>
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
