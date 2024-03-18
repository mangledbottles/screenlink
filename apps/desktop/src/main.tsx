import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { init, BrowserTracing, Replay } from "@sentry/react";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { RecordingProvider } from "./contexts/RecordingContext.tsx";
// Initialize Sentry with specific configuration
init({
  // Sentry Data Source Name (DSN)
  dsn: "https://03f0433ebb331913be9a44008d1bc6f8:2537ecc9c382cd0b53bb1dbe440b5dcd@o4506405451464704.ingest.sentry.io/4506405764530176",
  // Sample rate for session replays
  replaysSessionSampleRate: 1,
  // Sample rate for error replays
  replaysOnErrorSampleRate: 1.0,
  // Sample rate for traces
  tracesSampleRate: 1.0,

  // Integrations to be used
  integrations: [
    // Browser tracing integration
    new BrowserTracing({
      // Propagate traces to these targets
      tracePropagationTargets: ["localhost", /^https:\/\/screenlink\.io/],
    }),
    new Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Function to be called before sending the event
  beforeSend(event) {
    // If the event is an exception, show a report dialog
    // Return the event to be sent
    return event;
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RecordingProvider>
        <App />
      </RecordingProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
