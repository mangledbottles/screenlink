import { useEffect, useState } from "react";
import "./App.css";
import { ScreenSources, Source } from "./components/Sources";
import { Recorder } from "./components/Recorder";
import SignIn from "./components/SignIn";
import screenlinkLogo from "./assets/screenlink.svg";
import { Floating } from "./components/Floating";
import { Webcam } from "./components/Webcam";

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

  const params = new URLSearchParams(window.location.search);
  const windowType = params.get("window");
  console.log({ windowType });

  // Listen for the device code from the desktop application
  // @ts-ignore
  window.electron.on("device-code", (code: string) => {
    setDeviceCode(code);
  });

  useEffect(() => {
    refreshDeviceCode().then((newDeviceCode) => {
      setDeviceCode(newDeviceCode);
    });
  }, []);

  // If the device code is not present, show the sign in component
  if (!deviceCode) {
    return <SignIn />;
  }

  if (windowType === "floating") return <Floating />;
  if (windowType === "webcam") return <Webcam />;

  return (
    <>
      <div className="card">
        <img
          className="mx-auto h-10 w-auto"
          src={screenlinkLogo}
          alt="ScreenLink"
        />
        <Recorder selectedSource={selectedSource} />
        <ScreenSources
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
        />
      </div>
      <p className="read-the-docs">
        Screenlink is an open-source video capture tool that lets you record
        your screen and camera to share with your team, customers, and friends.
      </p>
    </>
  );
}

export default App;
