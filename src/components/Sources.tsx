import { useMemo, useState } from "react";
import { Source, SourceType } from "../utils";

async function getScreenSources() {
  try {
    const sources = await window.electron.getDesktopCapturerSources();
    console.log({ sources });
    return sources;
  } catch (error) {
    console.error("Failed to get screen sources:", error);
    await window.electron.setPermissionsMissing(true);
    return [];
  }
}

export function ScreenSources({
  selectedSource,
  setSelectedSource,
}: {
  selectedSource: Source | null;
  setSelectedSource: (source: Source) => void;
}) {
  const [sources, setSources] = useState<any[]>([]);

  useMemo(() => {
    getScreenSources().then((newSources) => {
      const uniqueSources = Array.from(
        new Set(newSources.map((source) => JSON.stringify(source)))
      ).map((source) => JSON.parse(source));
      setSources(uniqueSources);
    });
  }, []);

  if (!sources.length) return <SourcesSkeleton />;

  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {sources.map((source) => (
        <QuickLink
          key={source.id}
          title={source.name}
          applicationName={source.applicationName}
          imageUrl={source.thumbnail}
          source={source}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
        />
      ))}
    </div>
  );
}

const SourcesSkeleton = () => {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse group relative rounded-xl border-transparent border-2 -inset-px bg-gray-100 dark:bg-slate-800"
        >
          <div className="w-full h-48 rounded-lg bg-gray-300 dark:bg-slate-900"></div>
          <div className="p-2">
            <div className="mt-2 text-sm text-gray-300 dark:text-slate-400">
              <div className="w-1/4 h-4 rounded bg-gray-300 dark:bg-slate-900"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export function QuickLink({
  title,
  applicationName,
  imageUrl,
  source,
  selectedSource,
  setSelectedSource,
}: {
  title: string;
  applicationName: string;
  imageUrl: string;
  source: Source;
  selectedSource: Source | null;
  setSelectedSource: (source: Source) => void;
}) {
  const handleClick = () => {
    console.log("QuickLink clicked!");
    const sourceType = source.id.split(":")[0] as SourceType;
    console.log(`sourceType: ${sourceType}`);
    setSelectedSource({ ...source, sourceType });
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`group relative rounded-xl border-transparent border-2 -inset-px overflow-hidden ${
        isHovered || selectedSource?.id === source.id
          ? "[background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]"
          : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-auto object-cover rounded-lg hover:scale-105"
        style={{ aspectRatio: "1920 / 1080" }}
      />
      <div className="space-y-1 text-sm pt-2">
        <h3 className="font-medium leading-none">{applicationName ?? title}</h3>
        <p className="text-xs text-muted-foreground truncate overflow-ellipsis overflow-hidden max-h-[3.5em]">
          {title ?? ""}
        </p>
      </div>
    </div>
  );
}
