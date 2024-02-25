import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./SideBar";
import { getSession, prisma } from "@/app/utils";
import { redirect } from "next/navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: {
    projectId: string;
  };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const projectId = params.projectId;
  const sidebarNavItems = [
    {
      title: "General",
      href: `/app/project/${projectId}`,
    },
    {
      title: "Members",
      href: `/app/project/${projectId}/members`,
    },
    {
      title: "Billing",
      href: `/app/project/${projectId}/billing`,
    },
  ];

  const session = await getSession();
  const userInProject = await prisma.projectUsers.findUnique({
    where: {
      userId_projectId: {
        userId: session.user.id,
        projectId: projectId,
      },
    },
  });

  if (!userInProject) {
    redirect('/app')
  }

  return (
    <>
      <div className="mt-16"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <div className="hidden space-y-6 p-6  pb-16 md:block bg-[#0E131D] rounded-lg">
          <div className="space-y-0.5 pt-2 pr-60">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and team settings.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
