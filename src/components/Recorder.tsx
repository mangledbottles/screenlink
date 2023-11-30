import { useEffect, useState, useRef } from "react";
import { MultiStreamRecorder } from "recordrtc";
import { Source, baseUrl, isProd } from "../utils";
import { Video } from "lucide-react";

export function Recorder({
  selectedSource,
  cameraSource,
  audioSource,
}: {
  selectedSource: Source | null;
  cameraSource: MediaDeviceInfo | null;
  audioSource: MediaDeviceInfo | null;
}) {
  const [recordRTC, setRecordRTC] = useState<MultiStreamRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    if (!selectedSource) return alert("Select a screen to record");
    if (selectedSource && !isRecording) {
      try {
        // Notify the desktop application to start recording
        await window.electron.startRecording(selectedSource.id);

        const screenStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            // @ts-ignore
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: selectedSource.id,
            },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }

        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: audioSource?.deviceId,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: cameraSource?.deviceId,
            width: 100,
            height: 100,
            aspectRatio: 1,
            facingMode: "user",
            frameRate: 60,
          },
          audio: false,
        });

        let recorder: MultiStreamRecorder;

        if (selectedSource.sourceType === "window") {
          // Set the screenStream to the full screen
          (screenStream as any).width = window.screen.width;
          (screenStream as any).height = window.screen.height;
          (screenStream as any).fullcanvas = true;

          // Set the cameraStream to the bottom right corner
          (cameraStream as any).width = 240;
          (cameraStream as any).height = 180;
          (cameraStream as any).top =
            screen.height - (cameraStream as any).height;
          (cameraStream as any).left =
            screen.width - (cameraStream as any).width;

          const streamsToRecord = [screenStream, audioStream];
          // Only record the camera stream if it exists (if the user has selected a camera)
          if (cameraSource) streamsToRecord.push(cameraStream);
          // Only record the audio stream if it exists (if the user has selected a microphone)
          if (audioSource) streamsToRecord.push(audioStream);

          recorder = new MultiStreamRecorder(streamsToRecord, {
            mimeType: "video/webm",
            type: "video",
          });
        } else {
          const maxWidth = selectedSource.dimensions.width;
          const maxHeight = selectedSource.dimensions.height;

          (screenStream as any).width = maxWidth;
          (screenStream as any).height = maxHeight;
          (screenStream as any).fullcanvas = true;

          const streamsToRecord = [screenStream];
          if (audioSource) streamsToRecord.push(audioStream);

          recorder = new MultiStreamRecorder(streamsToRecord, {
            mimeType: "video/webm",
            type: "video",
          });
        }

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }

        recorder.record();
        setRecordRTC(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error("Failed to get media stream:", error);
        alert("Failed to get media stream, contact support if this persists");
      }
    }
  };

  const stopRecording = () => {
    if (recordRTC && isRecording) {
      recordRTC.stop(async (blob) => {
        const buffer: Buffer = await window.electron.blobToBuffer(blob);
        const sourceTitle = selectedSource?.name || "Screenlink Recording";
        const link = await window.electron.uploadVideo(buffer, sourceTitle);
        if (!link)
          return alert(
            "Failed to upload video, contact support if this issue persists"
          );
        const url = `${baseUrl}/view/${link}`;

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

  // Listen for finished recording from the floating window
  // @ts-ignore
  window.electron.on("finished-recording", (status: boolean) => {
    if (status) {
      stopRecording();
    }
  });

  return (
    <div>
      <button
        onClick={startRecording}
        disabled={isRecording}
        className={`w-full group relative justify-center gap-2 transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 bg-sky-700 text-white hover:bg-sky-900 border border-transparent hover:border-sky-900 focus:border-sky-500 focus:ring focus:ring-sky-500 ${
          isRecording &&
          "bg-red-500 hover:bg-red-600 focus:border-red-400 focus:ring-red-400"
        }`}
      >
        {isRecording ? (
          <div className="flex items-center">
            <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-red-400"></div>
            <span className="ml-4 text-md">Recording...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="dark:hidden absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-60"></span>
            <Video className="h-4 w-4" />
            <span className="text-md ml-2">Start Recording</span>
          </div>
        )}
      </button>
      {!isProd && (
        <video ref={videoRef} className="w-full mt-4" autoPlay muted />
      )}
    </div>
  );
}
