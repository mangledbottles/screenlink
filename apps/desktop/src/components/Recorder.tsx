import { useEffect, useState, useRef } from "react";
import { Source, UploadLink, baseUrl, isProd } from "../utils";
import { Video } from "lucide-react";
import { captureException } from "@sentry/react";
import { Progress } from "./ui/progress";

export function Recorder({
  selectedSource,
  cameraSource,
  audioSource,
}: {
  selectedSource: Source | null;
  cameraSource: MediaDeviceInfo | null;
  audioSource: MediaDeviceInfo | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [screenMedia, setScreenMedia] = useState<MediaRecorder | null>(null);
  const [cameraMedia, setCameraMedia] = useState<MediaRecorder | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(13);
  const [justStarted, setJustStarted] = useState(false);

  const uploadFile = async (
    uploadFilePath: string,
    uploadLink: string,
    uploadId: string
  ) => {
    try {
      if (!uploadLink || !uploadId) {
        console.log({
          note: "uploadLink or uploadId is null",
          uploadLink,
          uploadId,
        });
        captureException(new Error("uploadLink or uploadId is null"), {
          tags: {
            source: "recorder",
            uploadLink,
            uploadId,
            uploadFilePath,
          },
        });
        return alert("Failed to upload file, contact support if this persists");
      }
      await window.electron.uploadVideo(uploadFilePath, uploadLink);
      const uploadUrl = `${baseUrl}/view/${uploadId}`;
      await window.electron.openInBrowser(uploadUrl);
    } catch (error) {
      console.error("Failed to upload file:", error);
      captureException(error, {
        tags: {
          source: "recorder",
          uploadLink,
          uploadId,
          uploadFilePath,
        },
      });
      alert("Failed to upload file, contact support if this persists");
    }
  };

  const handleStartRecording = async (): Promise<UploadLink> => {
    try {
      const sourceTitle = selectedSource?.name || "Screenlink Recording";
      const newUpload = await window.electron.getUploadLink(sourceTitle);
      const uploadLink = newUpload.uploadLink;
      const uploadId = newUpload.uploadId;
      setIsRecording(true);
      return { uploadLink, uploadId };
    } catch (error) {
      console.error("Failed to start recording:", error);
      captureException(error, {
        tags: {
          source: "recorder",
        },
      });
      cancelRecording();
      alert("Failed to start recording, contact support if this persists");
      throw error;
    }
  };

  useEffect(() => {
    if (!justStarted) return;
    const timer = setTimeout(() => setProgress(66), 500);
    const timer2 = setTimeout(() => setProgress(100), 1200);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [justStarted]);

  const cancelRecording = async () => {
    try {
      if (screenMedia) {
        screenMedia.stop();
        setScreenMedia(null);
      }
      if (cameraMedia) {
        cameraMedia.stop();
        setCameraMedia(null);
      }

      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }

      setIsRecording(false);
      setJustStarted(false);
      await window.electron.cancelRecording();
    } catch (error) {
      console.error("Failed to cancel recording:", error);
      captureException(error, {
        tags: {
          source: "recorder",
        },
      });
    }
  };

  const startRecording = async () => {
    try {
      const screenChunks: Blob[] = [];
      const cameraChunks: Blob[] = [];

      // Handles window recording when a camera is selected
      // Requirements: [Window, Camera]
      const processWindowRecord = async (
        uploadLink: string,
        uploadId: string
      ) => {
        try {
          if (screenChunks.length > 0 && cameraChunks.length > 0) {
            const screenBlob = new Blob(screenChunks, {
              type: `video/webm; codecs=vp9,opus`,
            });
            const cameraBlob = new Blob(cameraChunks, {
              type: `video/webm; codecs=vp9,opus`,
            });

            const screenConverted = await screenBlob.arrayBuffer();
            const cameraConverted = await cameraBlob.arrayBuffer();

            // Reset chunks and states
            screenChunks.length = 0;
            cameraChunks.length = 0;

            // Process the data
            const outputFile = await window.electron.saveScreenCameraBlob(
              screenConverted,
              cameraConverted
            );
            console.log({ outputFile });
            await uploadFile(outputFile, uploadLink, uploadId);
          }
        } catch (error) {
          console.error("Failed to process window record:", error);
          captureException(error, {
            tags: {
              source: "recorder",
            },
          });
          throw error;
        }
      };

      // Handles full screen recording and window recording when no camera is selected
      // Requirements: [Screen] or [Window, Camera]
      const processScreenRecord = async (
        uploadLink: string,
        uploadId: string
      ) => {
        try {
          if (screenChunks.length > 0) {
            const screenBlob = new Blob(screenChunks, {
              type: `video/webm; codecs=vp9,opus`,
            });

            const screenConverted = await screenBlob.arrayBuffer();

            // Reset chunks and states
            screenChunks.length = 0;

            // Process the data
            const outputFile = await window.electron.saveScreenBlob(
              screenConverted
            );
            console.log({ outputFile });
            await uploadFile(outputFile, uploadLink, uploadId);
          }
        } catch (error) {
          console.error("Failed to process screen record:", error);
          captureException(error, {
            tags: {
              source: "recorder",
            },
          });
          throw error;
        }
      };

      if (!selectedSource) return alert("Select a screen to record");
      if (selectedSource && !isRecording) {
        try {
          setJustStarted(true);
          // Create a new upload link
          const { uploadId, uploadLink } = await handleStartRecording();

          if (!uploadId || !uploadLink) {
            return cancelRecording();
          }
          // Capture the screen stream
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
          setScreenStream(screenStream);

          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: audioSource?.deviceId,
              echoCancellation: true,
              noiseSuppression: true,
            },
          });
          setAudioStream(audioStream);

          let localCameraStream: MediaStream | null = null;
          // Capture the camera stream
          if (cameraSource) {
            const cameraStream = await navigator.mediaDevices.getUserMedia({
              video: {
                deviceId: cameraSource?.deviceId,
                width: 240,
                height: 180,
                aspectRatio: 1,
                facingMode: "user",
                frameRate: 60,
              },
              audio: false,
            });
            localCameraStream = cameraStream;
            setCameraStream(cameraStream);
          } else {
            setCameraStream(null);
          }

          const combinedStream = new MediaStream([
            screenStream.getVideoTracks()[0],
          ]);
          if (audioSource) {
            combinedStream.addTrack(audioStream.getAudioTracks()[0]);
          }

          // Set up the recorder with the combined stream
          const screenRecorder = new MediaRecorder(combinedStream, {
            mimeType: "video/webm; codecs=vp9,opus",
          });

          // Development Environment: Set the video source to the screen stream
          if (!isProd && videoRef.current)
            videoRef.current.srcObject = screenStream;

          // Entire screen and a camera is selected
          if (
            selectedSource.sourceType === "window" &&
            cameraSource &&
            localCameraStream
          ) {
            const cameraRecorder = new MediaRecorder(localCameraStream, {
              mimeType: "video/webm; codecs=vp9,opus",
            });

            setScreenMedia(screenRecorder);
            setJustStarted(false);
            if (cameraSource) setCameraMedia(cameraRecorder);

            screenRecorder.start();
            if (cameraSource) cameraRecorder.start();

            // For screen recorder
            // screenRecorder.onstart = handleStartRecording;
            screenRecorder.onstop = () =>
              processWindowRecord(uploadLink, uploadId);

            // When the screen recorder has data available, push it to the chunks array
            screenRecorder.ondataavailable = ({ data }: BlobEvent) => {
              screenChunks.push(data);
            };

            // For camera recorder
            cameraRecorder.onstop = () =>
              processWindowRecord(uploadLink, uploadId);

            // When the camera recorder has data available, push it to the chunks array
            cameraRecorder.ondataavailable = ({ data }: BlobEvent) => {
              cameraChunks.push(data);
            };
          } else if (
            // Entire screen is selected
            selectedSource.sourceType === "screen" ||
            // Specific window is selected, but no camera
            (selectedSource.sourceType === "window" && !cameraSource) ||
            !localCameraStream
          ) {
            setScreenMedia(screenRecorder);
            screenRecorder.start();

            // For screen recorder
            // screenRecorder.onstart = handleStartRecording;
            screenRecorder.onstop = () =>
              processScreenRecord(uploadLink, uploadId);

            // When the screen recorder has data available, push it to the chunks array
            screenRecorder.ondataavailable = ({ data }: BlobEvent) => {
              screenChunks.push(data);
            };
          }
        } catch (error) {
          console.error("Failed to get media stream:", error);
          captureException(error, {
            tags: {
              source: "recorder",
            },
          });
          alert("Failed to get media stream, contact support if this persists");
          throw error;
        }

        // Notify the desktop application to start recording
        // await window.electron.startRecording(selectedSource.id);
        await window.electron.startRecording(selectedSource?.applicationName);
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      captureException(error, {
        tags: {
          source: "recorder-render",
        },
      });
      cancelRecording();
      alert("Failed to start recording, contact support if this persists");
    }
  };

  const stopRecording = () => {
    try {
      setIsRecording(false);

      if (screenMedia) {
        screenMedia.stop();
        setScreenMedia(null);
      }
      if (cameraMedia) {
        cameraMedia.stop();
        setCameraMedia(null);
      }

      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      captureException(error, {
        tags: {
          source: "recorder",
        },
      });
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
        className={`w-full h-10 group relative justify-center gap-2 transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 bg-sky-700 text-white hover:bg-sky-900 border border-transparent hover:border-sky-900 focus:border-sky-500 focus:ring focus:ring-sky-500 rounded-lg ${
          isRecording &&
          "bg-red-500 hover:bg-red-600 focus:border-red-400 focus:ring-red-400"
        }`}
      >
        {isRecording ? (
          <div className="flex items-center">
            <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 ml-3"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-red-400 ml-3"></div>
            <span className="text-md ml-3">Recording...</span>
          </div>
        ) : justStarted ? (
          <div className="flex items-center justify-center">
            <Progress value={progress} className="w-[60%]" />
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