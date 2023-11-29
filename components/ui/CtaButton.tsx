"use client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CtaButton({ styles }: { styles?: string }) {
  const { status } = useSession();

  if (status === "loading")
    return (
      <div className="btn-sm inline-flex items-center text-slate-100 bg-slate-800 hover:bg-slate-900 group shadow-sm">
        <div className="relative flex justify-between space-x-2">
          <div className="animate-pulse h-4 bg-gray-500 rounded w-24"></div>
        </div>
      </div>
    );

  if (status === "authenticated")
    return (
      <Link
        className={`text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group ${
          styles ? styles : ``
        }`}
        href="/app"
      >
        Dashboard{" "}
        {/* <span className="tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
          -&gt;
        </span> */}
        <ArrowRightIcon className="tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1" />
      </Link>
    );

  return (
    <Link
      className={`font-medium text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group px-3 lg:px-4 py-2 flex items-center transition duration-150 ease-in-out rounded-md ${
        styles ? styles : ``
      }`}
      href="/signup"
    >
      Get Started{" "}
      <ArrowRightIcon className="tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1" />
    </Link>
  );

  return (
    <Link
      className={`text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group ${
        styles ? styles : ``
      }`}
      href="/signup"
    >
      Get Started{" "}
      <span className="tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
        -&gt;
      </span>
    </Link>
  );
}
