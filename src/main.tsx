import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { init, BrowserTracing, showReportDialog } from "@sentry/react";
import { ThemeProvider } from "./components/theme-provider.tsx";

// Initialize Sentry with specific configuration
init({
  // Sentry Data Source Name (DSN)
  dsn: "https://03f0433ebb331913be9a44008d1bc6f8@o4506405451464704.ingest.sentry.io/4506405764530176",
  // Sample rate for session replays
  replaysSessionSampleRate: 0.5,
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
  ],
  // Function to be called before sending the event
  beforeSend(event) {
    // If the event is an exception, show a report dialog
    if (event.exception) {
      showReportDialog({ eventId: event.event_id });
    }
    // Return the event to be sent
    return event;
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
