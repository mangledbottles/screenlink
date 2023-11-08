import { useEffect, useState } from "react";
import Button from "./Button";

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

type Source = {
  id: string;
  name: string;
  thumbnail: string;
};

export function ScreenSourcesV1() {
  const [sources, setSources] = useState<Source[]>([]);

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
  const [sources, setSources] = useState<Source[]>([]);
  // const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  useEffect(() => {
    getScreenSources().then(setSources);
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getScreenSources().then(setSources);
  //   }, 10000); // Refresh every 10 seconds

  //   // Cleanup function to clear the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, []);

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

export function QuickLinkV1({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string;
}) {
  const handleClick = () => {
    // Handle the click event here
    console.log("QuickLink clicked!");
  };

  return (
    <div className="group relative rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
      <div className="relative overflow-hidden rounded-xl p-6">
        {/* <Icon icon={icon} className="h-8 w-8" /> */}
        {/* <h2 className="mt-4 font-display text-base text-slate-900 dark:text-white"> */}
        {/* <Link href={href}> */}
        {/* <span className="absolute -inset-px rounded-xl" /> */}
        {/* {title} */}
        {/* </Link> */}
        {/* </h2> */}
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
          {title}
        </p>
      </div>
    </div>
  );
}
