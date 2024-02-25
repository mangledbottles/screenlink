import { Card, Metric, Text, Flex, ProgressBar, Grid } from "@tremor/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plan, PrismaClient, Project, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { UpgradeButton } from "./UpgradeButton";

export default async function DashboardStatistics() {
  const session = await getServerSession(authOptions);

  const prisma = new PrismaClient();
  // @ts-ignore
  const currentProjectId = session?.user?.currentProjectId;
  const project = await prisma.project.findFirst({
    where: {
      id: currentProjectId,
    },
    include: {
      users: true,
    },
  });

  if (!project) return null;

  const limits: Record<Plan, number> = { Free: 5, Pro: 100, Growth: 1000 };

  const totalVideoUploads = await prisma.upload.count({
    where: {
      projectId: currentProjectId,
    },
  });
  const limit = limits[project.plan as Plan];

  // @ts-ignore
  const userId = session?.user?.id;
  const email = session?.user?.email;
  const projectId = project?.id;
  const projectPlan = project?.plan;
  const clientReferenceId = `${projectId}-${userId}`;

  if (!userId || !email || !projectId || !projectPlan)
    return <div>Something went wrong</div>;

  const currentUserRole = project.users.find((user) => user.userId === userId)?.role ?? Role.member;

  return (
    <>
      <Grid numItemsSm={2} numItemsLg={2} className="gap-6 mb-4">
        <MonthlyUsage limit={limit} total={totalVideoUploads} />
        <Card className="p-4">
          <Text>Plan</Text>
          <Metric className="text-tremor-content-emphasis">
            <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
              {project?.plan ?? (
                <span className="animate-pulse w-10 h-5"></span>
              )}
            </span>
          </Metric>
          <Flex className="mt-4">
            {(currentUserRole == "admin" || currentUserRole == "owner") && projectPlan != "Growth" && (
              <UpgradeButton
                clientReferenceId={clientReferenceId}
                email={email}
                plan={projectPlan}
              />
            )}
          </Flex>
        </Card>
      </Grid>
    </>
  );
}

function MonthlyUsage({ limit, total }: { limit: number; total: number }) {
  const percentage = (total / limit) * 100;

  return (
    <Card className="p-4">
      <Text>Video Uploads</Text>
      <Metric className="text-tremor-content-emphasis text-xl">
        {new Intl.NumberFormat().format(total)}
      </Metric>
      <Flex className="mt-4">
        <Text className="truncate">{`${
          percentage.toFixed(2) ?? 0.0
        }% (${new Intl.NumberFormat().format(total ?? 0)})`}</Text>
        <Text>{new Intl.NumberFormat().format(limit)}</Text>
      </Flex>
      <ProgressBar value={percentage} className="mt-2" />
    </Card>
  );
}
