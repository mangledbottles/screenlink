import { getProviders } from "next-auth/react";
import Link from "next/link";
import AuthForm from "../AuthForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/app/utils";

export const metadata = constructMetadata({
  description:
    "Login to ScreenLink to start recording demos with your screen and camera.",
  title: "Sign In - ScreenLink",
});

export default async function SignIn({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    redirect("/app");
  }

  // Get redirect from query
  const redirectTo = searchParams?.redirect
    ? String(searchParams?.redirect)
    : "/app";

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        {/* Page header */}
        <div className="max-w-3xl mx-auto text-center pb-12">
          <h1 className="h2 font-hkgrotesk">Welcome back!</h1>
        </div>
        <div className="max-w-sm mx-auto">
          {/* Social logins */}
          <AuthForm providers={await getProviders()} redirect={redirectTo} />
          <div className="text-center mt-6">
            <div className="text-sm text-slate-500">
              Don't you have an account?{" "}
              <Link className="font-medium text-indigo-500" href="/signup">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
