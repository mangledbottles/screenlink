"use client";
import { PlayIcon } from "lucide-react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function Video({
  src,
  animatedPreview,
}: {
  src: string;
  animatedPreview: string;
}) {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const handlePlay = () => {
    if (playerRef.current) {
      setPlaying(true);
      // @ts-ignore
      playerRef.current.getInternalPlayer().play();
    }
  };

  const handlePlayerReady = () => {
    setIsPlayerReady(true);
  };

  return (
    <div className="relative">
      <ReactPlayer
        ref={playerRef}
        url={src}
        playing={playing}
        onReady={handlePlayerReady}
        config={{
          file: {
            attributes: {
              poster: animatedPreview,
            },
          },
        }}
        controls={true}
        width="100%"
        height="auto"
        className="react-player"
      />
      {!playing && isPlayerReady && (
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-4 cursor-pointer hover:bg-opacity-75 hover:scale-110 transition duration-300 ease-in-out"
          onClick={handlePlay}
        >
          <PlayIcon className="ml-3 h-16 w-16 text-gray-800" />
        </button>
      )}
    </div>
  );
}
