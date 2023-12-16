import { useEffect, useMemo, useState } from "react";
import { ScreenSources } from "./components/Sources";
import { Recorder } from "./components/Recorder";
import SignIn from "./components/SignIn";
import { Floating } from "./components/Floating";
import { Webcam } from "./components/Webcam";
import CameraSources from "./components/CameraSources";
import AudioSources from "./components/AudioSources";
import { Permissions } from "./components/Permissions";
import Update from "./components/Update";
import { Loading } from "./components/Loading";

import { Account, Source } from "./utils";

import "./App.css";
import { NavBar } from "./components/NavBar";
import { Replay, getCurrentHub, setContext, setUser } from "@sentry/react";

// Get the device code from the desktop application
export const refreshDeviceCode = async () => {
  const newDeviceCode = await window.electron.getDeviceCode();
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
  const [windowMessage, setWindowMessage] = useState<string | null>(null);
  const [_, setAccount] = useState<Account | null>(null);

  // Listen for the device code from the desktop application
  // @ts-ignore
  window.electron.on("device-code", (code: string) => {
    setDeviceCode(code);
  });

  // @ts-ignore
  window.electron.on("set-window", (window: string, message: string) => {
    setWindowType(window);
    setWindowMessage(message);
  });

  useEffect(() => {
    refreshDeviceCode().then((newDeviceCode) => {
      setDeviceCode(newDeviceCode);
    });

    const getAccount = async () => {
      const account = await window.electron.getAccount();
      setAccount(account);
      // Set user context in Sentry
      setUser({
        email: account?.user?.email,
        name: account?.user?.name,
        id: account?.id,

      });
    };
    getAccount();

    const getPreferences = async () => {
      const preferences = await window.electron.getPreferences();
      // Set user context in Sentry
      setContext("Preferences", {
        preferences,
      });

      if (
        preferences?.find((preference) => preference.name === "error-logging")
          ?.value === false
      ) {
        const client = getCurrentHub().getClient();
        const options = client?.getOptions();
        if (options) {
          options.enabled = false;
        }
      }
    };
    getPreferences();
  }, []);

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
        await window.electron.showCameraWindow(true);
        await window.electron.setUpdatedCameraSource(cameraSourceInfo);
      } else {
        await window.electron.showCameraWindow(false);
      }
    })();
  }, [cameraSource]);

  useEffect(() => {
    if (windowType === "main") {
      const client = getCurrentHub().getClient();
      if (!client || !client.addIntegration) return;
      if (client.getIntegration(Replay)) return;
      client?.addIntegration(
        new Replay({
          maskAllText: false,
          blockAllMedia: false,
        })
      );
    }
  }, [windowType]);

  if (!windowType) {
    return <div></div>;
  }

  if (windowType === "update") {
    return (
      <Update
        updateMessage={
          windowMessage || "There is an update available for ScreenLink"
        }
      />
    );
  }

  if (windowType === "permissions") {
    return <Permissions />;
  }

  if (windowType === "loading") {
    return <Loading loadingMessage={windowMessage} />;
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
      <p className="read-the-docs mb-4">
        Screenlink is an open-source video capture tool that lets you record
        your screen and camera to share your ideas with your anyone.
      </p>
    </>
  );
}

export default App;
