"use client";

import { Link } from "lucide-react";
import { useEffect, useState } from "react";

function getOS(): string {
  if (typeof window === "undefined") return "Unknown";
  const userAgent = window.navigator.userAgent,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  let os = "Unknown";

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

export const DownloadButton = () => {
  const [os, setOs] = useState<string | null>(null);

  useEffect(() => {
    const updatedOs = getOS();
    setOs(updatedOs);
  }, []);

  if (!os || os === "Unknown")
    return (
      <span className="animate-pulse inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20 w-44 h-16 cursor-pointer"></span>
    );

  return (
    <span className="inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20">
      Download for {os || "your OS"}
    </span>
  );
};
