import { useState } from "react";
import screenlinkLogo from "./assets/screenlink.svg";
import "./App.css";
import { ScreenSources } from "./components/Sources";
import { Recorder } from "./components/Recorder";

function App() {
  const [count, setCount] = useState(0);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  return (
    <>
      <div>
        <a href="https://screenlink.io" target="_blank">
          <img src={screenlinkLogo} className="logo react" alt="Screenlink" />
        </a>
      </div>
      <h2 style={{ marginBottom: "0em" }}>Get started with</h2>
      <h1 style={{ marginTop: "0em" }}>ScreenLink</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
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
