import { useEffect, useRef } from "react";

export const Webcam = () => {
  const videoRef = useRef(null);

  const startCam = async () => {
    const videoSources = await navigator.mediaDevices.enumerateDevices();

    console.log({ videoSources });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId:
            "150fb4461cea54bc0d5a3ae8268f9f11b0edff97bfbbeaf9354ef242654ee490",
          width: 200,
          height: 150,
          echoCancellation: true,
          noiseSuppression: true,
          frameRate: 30,
        },
      });
      console.log({ stream });
      // @ts-ignore
      if (videoRef.current) videoRef.current.srcObject = stream;
    }
  };

  useEffect(() => {
    startCam();
  }, []);

  return <video ref={videoRef} autoPlay />;
};
