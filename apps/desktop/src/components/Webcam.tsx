import { useEffect, useRef, useState } from "react";

export const Webcam = ({}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraSource, setCameraSource] = useState<MediaDeviceInfo | null>(
    null
  );

  window.electron.on("new-camera-source", (source: any) => {
    if (!source || source?.deviceId === cameraSource?.deviceId) return;
    setCameraSource(source);
  });

  useEffect(() => {
    stopCam();
    if (cameraSource) {
      startCam();
    }
  }, [cameraSource]);

  const startCam = async () => {
    if (
      cameraSource &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: cameraSource.deviceId,
            width: 200,
            height: 150,
            echoCancellation: true,
            noiseSuppression: true,
            frameRate: 30,
          },
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        alert(`Error accessing the webcam: ${error}`);
        console.error("Error accessing the webcam", error);
      }
    }
  };

  const stopCam = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  if (!cameraSource) return null;

  return (
    <video ref={videoRef} autoPlay style={{ width: "100%", height: "100%" }} />
  );
};
