import { getSession, prisma } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { redirect } from "next/navigation";

export default async function Billing({
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
      _count: {
        select: {
          uploads: true,
          users: true,
        },
      },
    },
  });

  if (!project) {
    redirect("/app");
  }

  const currentNumbers = [
    {
      key: "uploads",
      value: project._count.uploads,
      limit: project.monthlyUploads,
    },
    {
      key: "members",
      value: project._count.users,
      limit: project.projectSeats ?? 1,
    },
  ];

  const currentUserRole = await prisma.projectUsers.findFirst({
    where: {
      projectId: project.id,
      userId: session.user.id,
    },
    select: {
      role: true,
    },
  });

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-medium">
          <span className="capitalize">{project.plan}</span> plan
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {project.plan === "Free"
              ? "No credit card required"
              : "Billed monthly"}
          </span>
        </div>
      </div>

      <div className="grid max-w-lg gap-3">
        {currentNumbers.map(({ key, value, limit }) => (
          <div key={key}>
            <div className="text-muted-foreground mb-1 flex items-center justify-between">
              <p className="text-sm capitalize">{key.replace("-", " ")}</p>
              <p className="text-xs">
                <span className="text-foreground">{value}</span> / {limit}
              </p>
            </div>
            <Progress value={(value / limit) * 100} />
          </div>
        ))}
      </div>
      {(currentUserRole?.role === "admin" ||
        currentUserRole?.role === "owner") && (
        <a
          href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL}
          target="_blank"
        >
          <Button rel="noopener noreferrer" variant="secondary">
            Manage billing
          </Button>
        </a>
      )}
    </div>
  );
}
