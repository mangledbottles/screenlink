export const metadata = {
  title: "Sign Up - ScreenLink",
  description:
    "Sign up for ScreenLink to start recording your screen and camera.",
};

import Image from "next/image";
import Avatar01 from "@/public/images/avatar-01.jpg";
import Avatar02 from "@/public/images/avatar-02.jpg";
import Avatar03 from "@/public/images/avatar-03.jpg";
import Avatar04 from "@/public/images/avatar-04.jpg";
import AuthForm from "../AuthForm";
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { redirect } from "next/navigation";

export default async function SignUp({
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
  const redirectTo = String(searchParams?.redirect) || "/app";

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="lg:flex lg:space-x-20">
          <div className="grow lg:mt-20 mb-12 lg:mb-0 flex flex-col items-center lg:items-start">
            <h1 className="h2 font-hkgrotesk mb-8 text-center lg:text-left">
              Create Screen Recordings in Minutes
            </h1>
            {/* List */}
            <ul className="inline-flex flex-col text-lg text-slate-500 space-y-3">
              <li className="flex items-center">
                <svg
                  className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>
                  Record demos for your co-workers, customers, and friends
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>
                  Turn your meeting into a recording with a single click
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>Get started for free with no credit card required</span>
              </li>
            </ul>
          </div>
          {/* Right side */}
          <div className="relative w-full max-w-md mx-auto">
            {/* Bg gradient */}
            <div
              className="absolute inset-0 opacity-40 bg-gradient-to-t from-transparent to-slate-800 -z-10"
              aria-hidden="true"
            />
            <div className="p-6 md:p-8">
              <div className="font-hkgrotesk text-xl font-bold mb-6">
                Get Started!
              </div>
              <AuthForm
                providers={await getProviders()}
                redirect={redirectTo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
