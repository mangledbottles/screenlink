"use client";
import Link from "next/link";

function getOS() {
  if (typeof window === "undefined") return;
  const userAgent = window.navigator.userAgent,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  let os = null;

  if (macosPlatforms.some((platform) => userAgent.includes(platform))) {
    os = "macOS";
  } else if (
    windowsPlatforms.some((platform) => userAgent.includes(platform))
  ) {
    os = "Windows";
  } else if (/Linux/.test(userAgent)) {
    os = "Linux";
  }

  return os;
}

export default function Download() {
  const os = getOS();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 min-h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl dark:text-white">
            Download ScreenLink
          </h1>
          <p className="max-w-[600px] text-zinc-500 text-center md:text-sm/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
            ScreenLink allows you to record your screen and share it with
            anyone! Download ScreenLink and get started for free today.
          </p>
        </div>
        <div className="flex justify-center mt-12">
          <Link
            className="inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20"
            href={`/download/${os}`}
          >
            Download for {os}
          </Link>
        </div>
      </div>
    </section>
  );
}
