import { useEffect, useState } from "react";
import Button from "./Button";

export type Source = {
  id: string;
  name: string;
  thumbnail: string;
};

async function getScreenSources() {
  try {
    const sources = await window.electron.getDesktopCapturerSources();
    console.log({ sources });
    return sources;
  } catch (error) {
    console.error("Failed to get screen sources:", error);
    return [];
  }
}

export function ScreenSourcesV1() {
  const [sources, setSources] = useState<Source[] | any[]>([]);

  useEffect(() => {
    getScreenSources().then(setSources);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Screen Sources</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sources.map((source) => (
          <div key={source.id} className="border p-4 rounded shadow">
            <h2 className="text-xl mb-2">{source.name}</h2>
            <img src={source.thumbnail} alt={source.name} />
            <Button variant="primary">Select</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScreenSources({
  selectedSource,
  setSelectedSource,
}: {
  selectedSource: Source | null;
  setSelectedSource: (source: Source) => void;
}) {
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    getScreenSources().then(setSources);
  }, []);
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {sources.map((source) => (
        <QuickLink
          key={source.id}
          title={source.name}
          imageUrl={source.thumbnail}
          source={source}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
        />
      ))}
    </div>
  );
}

export function QuickLink({
  title,
  imageUrl,
  source,
  selectedSource,
  setSelectedSource,
}: {
  title: string;
  imageUrl: string;
  source: Source;
  selectedSource: Source | null;
  setSelectedSource: (source: Source) => void;
}) {
  const handleClick = () => {
    console.log("QuickLink clicked!");
    setSelectedSource(source);
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
      className={`group relative rounded-xl border-transparent border-2 -inset-px  ${
        isHovered || selectedSource === source
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
        className="w-full h-auto object-cover rounded-lg"
        style={{ aspectRatio: "1920 / 1080" }}
      />
      <div className="p-2">
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
          {title}
        </p>
      </div>
    </div>
  );
}
