import { useMemo, useState } from "react";
import AudioSources from "./components/AudioSources";
import CameraSources from "./components/CameraSources";
import { NavBar } from "./components/NavBar";
import { Recorder } from "./components/Recorder";
import { ScreenSources } from "./components/Sources";
import { Source } from "./utils";
import "./index.css";

export const Landing = () => {
  const [cameraSource, setCameraSource] = useState<MediaDeviceInfo | null>(
    null
  );
  const [selectedSource, setSelectedSource] = useState<Source | any | null>(
    null
  );
  const [audioSource, setAudioSource] = useState<MediaDeviceInfo | null>(null);

  useMemo(() => {
    // When cameraSource changes, notify the desktop application
    (async () => {
      if (cameraSource) {
        // Assuming cameraSource is a MediaDeviceInfo object
        const cameraSourceInfo = {
          deviceId: cameraSource.deviceId,
          kind: cameraSource.kind,
          label: cameraSource.label,
          groupId: cameraSource.groupId,
        };
        // Send this plain object through IPC
        // await window.electron.showCameraWindow(true);
        await window.electron.setUpdatedCameraSource(cameraSourceInfo);
      }
      //   } else {
      // await window.electron.showCameraWindow(false);
      //   }
    })();
  }, [cameraSource]);

  window.electron.on("new-camera-source", (source: any) => {
    console.log(`new cam source in landing ${source}`);
    if (
      source?.deviceId === cameraSource?.deviceId ||
      (!source && !cameraSource)
    )
      return;
    setCameraSource(source);
  });

  return (
    <>
      <div className="card main bg-background text-foreground">
        <NavBar />
        <div className="flex flex-col space-y-4 w-4/6 mx-auto">
          <CameraSources
            cameraSource={cameraSource}
            setCameraSource={setCameraSource}
          />
          <AudioSources
            audioSource={audioSource}
            setAudioSource={setAudioSource}
          />
          <Recorder
            selectedSource={selectedSource}
            cameraSource={cameraSource}
            audioSource={audioSource}
          />
        </div>
        <ScreenSources
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
        />
      </div>
    </>
  );
};
