"use client";
import { useRef } from "react";
import ReactPlayer from "react-player";

export default function Video({ src }: { src: string }) {
  const playerRef = useRef(null);

  return (
    <ReactPlayer
      ref={playerRef}
      url={src}
      autoPlay={true}
      controls={true}
      width="100%"
      height="auto"
    />
  );
}
