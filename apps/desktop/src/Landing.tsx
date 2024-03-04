import { useEffect, useState } from "react";
import AudioSources from "./components/AudioSources";
import CameraSources from "./components/CameraSources";
import { NavBar } from "./components/NavBar";
import { Recorder } from "./components/Recorder";
import { ScreenSources } from "./components/Sources";
import { Account, Source, Status, refreshDeviceCode } from "./utils";
import "./index.css";
import { useRecordingContext } from "./contexts/RecordingContext";
import { Permissions } from "./components/Permissions";
import { Loading } from "./components/Loading";
import Update from "./components/Update";
import { getCurrentHub, setContext, setUser } from "@sentry/react";
import SignIn from "./components/SignIn";

export const Landing = () => {
  const [status, setStatus] = useState<Status | null>({
    message: null,
    type: null,
  });
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [_, setAccount] = useState<Account | null>(null);

  const { selectedCamera, setSelectedCamera } = useRecordingContext();

  const [selectedSource, setSelectedSource] = useState<Source | any | null>(
    null
  );
  const [audioSource, setAudioSource] = useState<MediaDeviceInfo | null>(null);

  // Listen for the device code from the desktop application
  window.electron.on("device-code", (code: string) => {
    setDeviceCode(code);
  });

  window.electron.on("set-window", (window: string, message: string) => {
    console.log({ window, message, where: "here2398" });
    setStatus({
      type: window,
      message,
    });
    // setWindowType(window);
    // setWindowMessage(message);
  });

  useEffect(() => {
    refreshDeviceCode().then((newDeviceCode: string) => {
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

  if (status?.type === "update") {
    return (
      <Update
        updateMessage={
          status.message || "There is an update available for ScreenLink"
        }
      />
    );
  }

  if (status?.type === "permissions") {
    return <Permissions permissionsMessage={status?.message} />;
  }

  if (status?.type === "loading") {
    return <Loading loadingMessage={status?.message} />;
  }

  // If the device code is not present, show the sign in component
  if (!deviceCode) {
    return <SignIn />;
  }

  return (
    <>
      <div className="card main bg-background text-foreground p-4">
        <NavBar />
        <div className="flex flex-col space-y-4 w-4/6 mx-auto">
          <CameraSources
            cameraSource={selectedCamera}
            setCameraSource={setSelectedCamera}
          />
          <AudioSources
            audioSource={audioSource}
            setAudioSource={setAudioSource}
          />
          <Recorder
            selectedSource={selectedSource}
            cameraSource={selectedCamera}
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
