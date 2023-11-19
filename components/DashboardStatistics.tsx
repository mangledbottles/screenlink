import { Card, Metric, Text, Flex, ProgressBar, Grid } from "@tremor/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plan, PrismaClient, Project } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { UpgradeButton } from "./UpgradeButton";

export default async function DashboardStatistics() {
  const session = await getServerSession(authOptions);

  const prisma = new PrismaClient();
  const project = await prisma.project.findFirst({
    where: {
      // @ts-ignore
      id: session?.user?.currentProjectId,
    },
  });

  if (!project) return null;

  const limits: Record<Plan, number> = { Free: 5, Pro: 100, Growth: 1000 };

  const totalVideoUploads = await prisma.upload.count({
    where: {
      projectId: project.id,
    },
  });
  const limit = limits[project.plan as Plan];

  return (
    <>
      <Grid numItemsSm={2} numItemsLg={2} className="gap-6 mb-4">
        <MonthlyUsage limit={limit} total={totalVideoUploads} />
        <Card className="p-4">
          <Text>Plan</Text>
          <Metric className="text-tremor-content-emphasis">
            {/* <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {project?.plan ?? (
                <span className="animate-pulse w-10 h-5"></span>
              )}
            </span> */}

            <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
              {project?.plan ?? (
                <span className="animate-pulse w-10 h-5"></span>
              )}
            </span>
          </Metric>
          <Flex className="mt-4">
            {project?.plan !== "Growth" && <UpgradeButton />}
            {/* <UpgradeButton /> */}
            {/* <UpgradeButton /> */}
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
