import { useEffect, useMemo, useState } from "react";
import * as Sentry from "@sentry/react";
import screenlinkLogo from "./assets/screenlink.svg";

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

import { Source } from "./utils";

import "./App.css";

Sentry.init({
  dsn: "https://03f0433ebb331913be9a44008d1bc6f8@o4506405451464704.ingest.sentry.io/4506405764530176",
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.5,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/screenlink\.io/],
    }),
  ],
  beforeSend(event, hint) {
    // Check if it is an exception, and if so, show the report dialog
    if (event.exception) {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },
});

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

  // Listen for the device code from the desktop application
  // @ts-ignore
  window.electron.on("device-code", (code: string) => {
    setDeviceCode(code);
  });

  // @ts-ignore
  window.electron.on("set-window", (window: string, message: string) => {
    // alert("set-window to " + window)
    setWindowType(window);
    setWindowMessage(message);
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
      const client = Sentry.getCurrentHub().getClient();
      if (!client || !client.addIntegration) return;
      if (client.getIntegration(Sentry.Replay)) return;
      client?.addIntegration(
        new Sentry.Replay({
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
        your screen and camera to share your ideas with your anyone.
      </p>
    </>
  );
}

export default App;
