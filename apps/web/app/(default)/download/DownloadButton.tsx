"use client";

import { getOS } from "@/app/utils";
import { GithubStars } from "@/components/GithubStars";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

const fetchReleases = async (): Promise<GitHubRelease[]> => {
  const response = await fetch(
    "https://api.github.com/repos/mangledbottles/screenlink-desktop/releases"
  );
  return response.json();
};

export const DownloadButton = () => {
  const [os, setOs] = useState<string | null>(null);

  useEffect(() => {
    const updatedOs = getOS();
    setOs(updatedOs);
  }, []);

  const {
    data: releases,
    isLoading,
    isError,
  } = useQuery<GitHubRelease[], Error, GitHubRelease[]>({
    queryKey: ["releases"],
    queryFn: fetchReleases,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const downloadUrl = releases ? getDownloadUrl(os ?? "", releases) : null;

  if (isLoading) {
    return (
      <span className="animate-pulse inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20 w-44 h-16 cursor-pointer"></span>
    );
  }

  if (isError || (releases && !downloadUrl)) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="max-w-[800px] mb-4 text-white text-center md:text-sm/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-white">
          ScreenLink is being built for MacOS, Windows and Linux. Its still in
          development
          {os && os !== "Unknown"
            ? ` but its not yet available for ${os}!`
            : "."}{" "}
          Get notified when it is available for your OS.
        </p>
        <GithubStars />
      </div>
    );
  }

  if (!os || os === "Unknown")
    return (
      <span className="animate-pulse inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20 w-44 h-16 cursor-pointer"></span>
    );

  if (os === "macOS") return <MacDownloadButton releases={releases ?? []} />;

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

const MacDownloadButton = ({ releases }: { releases: GitHubRelease[] }) => {
  const intelMacPattern = /ScreenLink-\d+\.\d+\.\d+\.dmg/;
  const armMacPattern = /ScreenLink-\d+\.\d+\.\d+-arm64\.dmg/;

  const intelMacRelease = releases.find((release) =>
    release.assets.find((asset) => intelMacPattern.test(asset.name))
  );

  const armMacRelease = releases.find((release) =>
    release.assets.find((asset) => armMacPattern.test(asset.name))
  );

  return (
    <div className="flex flex-row items-center justify-center h-full space-x-4">
      {intelMacRelease && (
        <a
          href={
            intelMacRelease?.assets.find((asset) =>
              intelMacPattern.test(asset.name)
            )?.browser_download_url ?? "#"
          }
          className="inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20"
          download
        >
          Download for Intel
        </a>
      )}
      {armMacRelease && (
        <a
          href={
            armMacRelease?.assets.find((asset) =>
              armMacPattern.test(asset.name)
            )?.browser_download_url ?? "#"
          }
          className="inline-flex items-center rounded-md bg-blue-400/10 px-3 py-3 text-2xl font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/20"
          download
        >
          Download for Apple Silicon
        </a>
      )}
    </div>
  );
};
