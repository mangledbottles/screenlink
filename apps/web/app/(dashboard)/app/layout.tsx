"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Illustration from "@/public/images/hero-illustration.svg";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    redirect("/signin");
  }

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  return (
    <>
      <DashboardHeader />

      <main className="grow">
        {/* Illustration */}
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <Image
            src={Illustration}
            className="max-w-none"
            priority
            alt="Hero Illustration"
          />
        </div>

        {children}
      </main>

      {/* <Footer /> */}
    </>
  );
}
