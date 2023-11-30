import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { ScreenSources } from "./components/Sources";
import { Recorder } from "./components/Recorder";
import SignIn from "./components/SignIn";
import screenlinkLogo from "./assets/screenlink.svg";
import { Floating } from "./components/Floating";
import { Webcam } from "./components/Webcam";
import CameraSources from "./components/CameraSources";
import { Source } from "./utils";
import AudioSources from "./components/AudioSources";
import { Permissions } from "./components/Permissions";

// Get the device code from the desktop application
export const refreshDeviceCode = async () => {
  const newDeviceCode = await window.electron.getDeviceCode();
  console.log("newDeviceCode", newDeviceCode);
  return newDeviceCode;
};

function App() {
  const [selectedSource, setSelectedSource] = useState<Source | any | null>(
    null
  );
  const [deviceCode, setDeviceCode] = useState<string | null>(null);

  const [cameraSource, setCameraSource] = useState<MediaDeviceInfo | null>(
    null
  );
  const [audioSource, setAudioSource] = useState<MediaDeviceInfo | null>(null);
  const [windowType, setWindowType] = useState<string | null>(null);

  // Listen for the device code from the desktop application
  // @ts-ignore
  window.electron.on("device-code", (code: string) => {
    setDeviceCode(code);
  });

  // @ts-ignore
  window.electron.on("set-window", (window: string) => {
    // alert("set-window to " + window)
    setWindowType(window);
  });

  useEffect(() => {
    refreshDeviceCode().then((newDeviceCode) => {
      setDeviceCode(newDeviceCode);
    });
  }, []);

  useMemo(() => {
    // When cameraSource changes, notify the desktop application
    (async () => {
      if (cameraSource) {
        console.log("cameraSource changed", cameraSource);
        // Assuming cameraSource is a MediaDeviceInfo object
        const cameraSourceInfo = {
          deviceId: cameraSource.deviceId,
          kind: cameraSource.kind,
          label: cameraSource.label,
          groupId: cameraSource.groupId,
        };
        // Send this plain object through IPC
        await window.electron.showCameraWindow(true);
        await window.electron.setUpdatedCameraSource(cameraSourceInfo);
      } else {
        await window.electron.showCameraWindow(false);
      }
    })();
  }, [cameraSource]);

  if (!windowType) {
    return <div></div>;
  }

  if (windowType === "permissions") {
    return <Permissions />;
  }

  // If the device code is not present, show the sign in component
  if (!deviceCode) {
    return <SignIn />;
  }

  if (windowType === "floating") return <Floating />;
  if (windowType === "webcam") return <Webcam />;

  return (
    <>
      <div className="card">
        <div className="flex justify-center">
          <img
            className="h-10 w-auto mb-2 -mt-4 cursor-pointer"
            src={screenlinkLogo}
            alt="ScreenLink"
            onClick={() => {
              window.electron.openInBrowser("https://screenlink.io/app");
            }}
          />
        </div>
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
      <p className="read-the-docs mb-4">
        Screenlink is an open-source video capture tool that lets you record
        your screen and camera to share with your team, customers, and friends.
      </p>
    </>
  );
}

export default App;
