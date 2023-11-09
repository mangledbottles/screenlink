import { useEffect, useState, useRef } from "react";
import RecordRTC from "recordrtc";

type Source = {
  id: string;
  name: string;
  thumbnail: string;
};

export function Recorder({
  selectedSource,
}: {
  selectedSource: Source | null;
}) {
  const [recordRTC, setRecordRTC] = useState<RecordRTC | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    if (selectedSource && !isRecording) {
      const constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: selectedSource.id,
            minWidth: 1920,
            maxWidth: 1920,
            minHeight: 1080,
            maxHeight: 1080,
          },
        },
      };

      try {
        // @ts-ignore
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const recorder = new RecordRTC(stream, {
          type: "video",
          mimeType: "video/webm",
        });
        recorder.startRecording();
        setRecordRTC(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error("Failed to get media stream:", error);
      }
    }
  };

  const stopRecording = () => {
    if (recordRTC && isRecording) {
      recordRTC.stopRecording(async () => {
        const blob = recordRTC.getBlob();
        const buffer: Buffer = await window.electron.blobToBuffer(blob);
        const sourceTitle = selectedSource?.name || "Screenlink Recording";
        const link = await window.electron.uploadVideo(buffer, sourceTitle);
        console.log({ link });
        if (!link)
          return alert(
            "Failed to upload video, contact support if this issue persists"
          );
        const isProd = process.env.NODE_ENV === "production";
        const url = isProd
          ? `https://screenlink.io/view/${link}`
          : `http://localhost:3008/view/${link}`;

        setIsRecording(false);

        await window.electron.openInBrowser(url);
      });
      if (videoRef.current && videoRef.current.srcObject) {
        // @ts-ignore
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track: MediaStreamTrack) => track.stop());
      }
      setRecordRTC(null);
    }
  };

  useEffect(() => {
    // Cleanup function to stop media tracks when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // @ts-ignore
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <video autoPlay ref={videoRef} />
    </div>
  );
}
