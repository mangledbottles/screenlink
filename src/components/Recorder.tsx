// screenlink-desktop/src/components/Recorder.tsx
import { useEffect, useState, useRef } from "react";
// import { writeFile } from "fs";
import path from "path";

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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async (): Promise<void> => {
    setIsCompleted(false);
    setChunks([]);

    if (selectedSource) {
      try {
        const constraints = {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: selectedSource.id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720,
            },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        setStream(stream);

        // Create a MediaRecorder instance after getting the stream
        const mediaRecorder = new MediaRecorder(stream);
        setRecorder(mediaRecorder);

        // Event listener for when data is available
        mediaRecorder.ondataavailable = (e) => {
          console.log(e);
          // if (e.data.size > 0) {
          // setChunks((prev) => [...prev, e.data]);
          setChunks((prevChunks) => {
            const newChunks = [...prevChunks, e.data];
            // console.log(
            //   "[UPDATING CHUNK STATE] New chunks state:",
            //   newChunks,
            //   "e.data:",
            //   e.data
            // );
            return newChunks;
          });

          // Debugging: Check the chunks
          // console.log("Chunks state:", chunks, "e.data:", e.data);
          // }
        };

        mediaRecorder.onstop = async () => {
          setIsCompleted(true);
          // if (!chunks.length) return alert("No chunks recorded");
          // const blob = new Blob(chunks, { type: "video/webm" });
          // const buffer: Buffer = await window.electron.blobToBuffer(blob);

          // // Debugging: Check the buffer
          // console.log("Buffer:", buffer);

          // const link = await window.electron.uploadVideo(buffer);
          // console.log({ link });
          //   alert(`Video uploaded to ${link}`);

          //   const { canceled, filePath } = await window.electron.showSaveDialog();
          //   if (canceled) return;

          //   console.log({ filePath });

          //   await window.electron.saveFile(filePath, buffer);
        };

        // Start recording
        mediaRecorder.start();
      } catch (e) {
        console.error("Failed to get media stream:", e);
      }
    }
  };

  useEffect(() => {
    if (!isCompleted) return console.log("Not completed yet");
    else console.log("Completed");
    const upload = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const buffer: Buffer = await window.electron.blobToBuffer(blob);

      // Debugging: Check the buffer
      console.log("Buffer:", buffer);

      const link = await window.electron.uploadVideo(buffer);
      console.log({ link });
    };

    upload();
  }, [setIsCompleted]);

  // const stopRecording = (): void => {
  //   recorder?.stop();
  //   if (stream) {
  //     stream.getTracks().forEach((track) => {
  //       if (typeof track.stop === "function") {
  //         track.stop();
  //       }
  //     });
  //     setStream(null);
  //   }
  // };

  const stopRecording = (): void => {
    recorder?.stop();
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (typeof track.stop === "function") {
          track.stop();
        }
      });
      setStream(null);
    } else {
      alert("No stream to stop");
    }
  };

  // const stopRecording = (): void => {
  //   setTimeout(() => {
  //     recorder?.stop();
  //     if (stream) {
  //       stream.getTracks().forEach((track) => {
  //         if (typeof track.stop === "function") {
  //           track.stop();
  //         }
  //       });
  //       setStream(null);
  //     }
  //   }, 1000); // Delay stopping the MediaRecorder by 1 second
  // };

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log(`Setting video srcObject to stream: ${stream}`);
      console.log(stream.getTracks());
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <button onClick={startRecording} disabled={!!stream}>
        Start Recording
      </button>
      <button
        onClick={stopRecording}
        disabled={!stream || recorder?.state === "inactive"}
      >
        Stop Recording
      </button>
      <video autoPlay ref={videoRef} />
      <video
        autoPlay
        ref={videoRef}
        onLoadedMetadata={() => console.log("Video loaded")}
      />
    </div>
  );
}
