"use client";
import { GithubIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

export const HeaderAction = () => {
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/repos/mangledbottles/screenlink-desktop")
      .then((response) => response.json())
      .then((data) => setStarCount(data.stargazers_count))
      .catch((error) => console.error("Error:", error));
  }, []);

  const formatStarCount = (count: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(
      count
    );
  };

  return (
    <span
      className="isolate inline-flex rounded-md shadow-sm"
      data-aos="fade-up"
    >
      <div className="relative inline-flex">
        <a
          href="https://github.com/mangledbottles/screenlink-desktop"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            type="button"
            className="relative inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-white/20 focus:z-10"
          >
            <GithubIcon className="mr-2 h-4 w-4" /> Star on GitHub
            <Badge
              variant="secondary"
              className="ml-2 min-h-[20px] min-w-[24px]"
            >
              {starCount > 0 && formatStarCount(starCount)}
            </Badge>
          </button>
        </a>
      </div>
    </span>
  );
};
