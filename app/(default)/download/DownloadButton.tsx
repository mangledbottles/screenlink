"use client";

import { HeaderAction } from "@/components/HeaderAction";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";

// Define the interface for a GitHub release asset
interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

// Define the interface for a GitHub release
interface GitHubRelease {
  assets: ReleaseAsset[];
}

function getDownloadUrl(os: string, releases: GitHubRelease[]): string | null {
  // Define the file extension for each OS
  const fileExtensions: { [key: string]: string } = {
    macOS: ".dmg",
    Windows: ".exe",
    Linux: ".AppImage",
  };

  // Find the asset that matches the OS and has the correct file extension
  const osFileExtension = fileExtensions[os];
  for (const release of releases) {
    const asset = release.assets.find((asset) =>
      asset.name.endsWith(osFileExtension)
    );
    if (asset) {
      return asset.browser_download_url;
    }
  }

  return null;
}

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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [githubRequestFinished, setGithubRequestFinished] = useState(false);

  useEffect(() => {
    const updatedOs = getOS();
    setOs(updatedOs);

    // Fetch the latest releases from GitHub
    fetch(
      "https://api.github.com/repos/mangledbottles/screenlink-desktop/releases"
    )
      .then((response) => response.json())
      .then((releases: GitHubRelease[]) => {
        // Assuming the first release in the array is the latest
        const latestRelease = releases[0];
        const url = getDownloadUrl(updatedOs, releases);
        setDownloadUrl(url);
        setGithubRequestFinished(true);
      })
      .catch((error) => {
        console.error("Error fetching releases:", error);
        setGithubRequestFinished(true);
      });
  }, []);

  if (githubRequestFinished && !downloadUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="max-w-[800px] mb-4 text-white text-center md:text-sm/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-white">
          ScreenLink is being built for MacOS, Windows and Linux. Its still in
          development {os ? `but its not yet available for ${os}!` : "."} Get
          notified when it is available
        </p>
        <HeaderAction />
      </div>
    );
  }

  if (!os || os === "Unknown")
    return (
      <span className="animate-pulse inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20 w-44 h-16 cursor-pointer"></span>
    );

  if (!downloadUrl)
    return (
      <span className="animate-pulse inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20 w-44 h-16 cursor-pointer"></span>
    );
  return (
    <a
      href={downloadUrl ?? "#"}
      className="inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20"
      download
    >
      Download for {os}
    </a>
  );
};
