import { Suspense } from "react";
import { constructMetadata } from "@/app/utils";
import OnboardingPageClient from "./page-client";
import { getSession, prisma } from "@/app/utils";
import { redirect } from "next/navigation";

export const runtime = "nodejs";


export const metadata = constructMetadata({
  title: `Welcome to ScreenLink - Onboarding`,
});

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session.user) {
    redirect("/signin?redirect=/onboarding");
  }

  const userProject = await prisma.project.findFirst({
    where: {
      users: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  return (
    <>
      <Suspense>
        <OnboardingPageClient project={userProject} />
      </Suspense>
    </>
  );
}
