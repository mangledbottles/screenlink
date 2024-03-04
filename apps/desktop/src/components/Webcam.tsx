import { useEffect, useRef, useState } from "react";
import styles from "../Webcam.module.css"; // Import the styles
import { RefreshCwIcon, XIcon } from "lucide-react";
import { useRecordingContext } from "@/contexts/RecordingContext";
import { captureException } from "@sentry/react";

export const Webcam = ({}): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { selectedCamera, setSelectedCamera } = useRecordingContext();

  useEffect(() => {
    const startCam = async () => {
      if (!selectedCamera) return;
      setIsLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera.deviceId,
            width: 200,
            height: 200,
            echoCancellation: true,
            noiseSuppression: true,
            frameRate: 30,
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          console.error("videoRef.current is null");
        }
      } catch (error: any) {
        closeCamera();
        captureException(
          new Error(`Error accessing the webcam ${error?.message}`),
          {
            tags: {
              error: "webcam",
            },
            extra: {
              error,
            },
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCamera) {
      startCam();
    }
  }, [selectedCamera]);

  const stopCam = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const refreshCamera = async () => {
    setIsLoading(true);
    await stopCam();
    // Temporarily set selectedCamera to null to ensure useEffect triggers startCam again.
    await setSelectedCamera(null);
    // Re-select the camera after a brief delay to allow the stopCam operation to complete.
    setTimeout(() => setSelectedCamera(selectedCamera), 500);
  };

  const closeCamera = () => {
    stopCam();
    setSelectedCamera(null);
  };

  if (!selectedCamera && !isLoading) {
    closeCamera();
  }

  if (isLoading)
    return (
      <>
        <MenuBar refreshCamera={refreshCamera} closeCamera={closeCamera} />
        <div
          className={`${styles.draggableArea} animate-spin top-0 object-cover cursor-move rounded-full h-32 w-32 border-b-4 border-white-600`}
        />
      </>
    );

  return (
    <>
      <MenuBar refreshCamera={refreshCamera} closeCamera={closeCamera} />
      <video
        ref={videoRef}
        autoPlay
        className={`${styles.draggableArea} top-0 left-0 w-full h-full object-cover cursor-move rounded-full`}
      />
    </>
  );
};

const MenuBar = ({ refreshCamera, closeCamera }: any) => {
  return (
    <div className={`${styles.notDraggable} space-x-4 h-8`}>
      <div
        className="top-0 right-0 mb-8 mr-8 flex justify-center items-center"
      >
        <>
          <button
            onClick={refreshCamera}
            className="flex items-center justify-center p-2 bg-gray-900 rounded-lg cursor-pointer"
          >
            <RefreshCwIcon className="w-4 h-4 text-gray-200" />
          </button>
          <button
            onClick={closeCamera}
            className="flex items-center justify-center p-2 bg-gray-900 rounded-lg cursor-pointer"
          >
            <XIcon className="w-4 h-4 text-gray-200" />
          </button>
        </>
      </div>
    </div>
  );
};
