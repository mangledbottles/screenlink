import { useEffect, useState } from "react";
import styles from "../styles/Floating.module.css";
import { StopCircle } from "lucide-react";

const DragIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-grip-horizontal"
    >
      <circle cx="12" cy="9" r="1" />
      <circle cx="19" cy="9" r="1" />
      <circle cx="5" cy="9" r="1" />
      <circle cx="12" cy="15" r="1" />
      <circle cx="19" cy="15" r="1" />
      <circle cx="5" cy="15" r="1" />
    </svg>
  );
};

const stopRecording = async () => {
  console.log("stop recording");
  await window.electron.stopRecording();
};

export const Floating = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isRecording && timer !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  // Listen for recording to start
  // @ts-ignore
  window.electron.on("started-recording", (status: boolean) => {
    setTimer(0);
    setIsRecording(status);
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={`${styles.draggableArea} h-screen w-screen m-0 p-0 bg-white dark:bg-gray-800 overflow-hidden`}
    >
      <div className="h-full divide-y divide-gray-300 dark:divide-gray-600 rounded-md shadow-md md:flex md:divide-y-0 bg-gray-50 dark:bg-gray-700">
        <button
          className="group flex w-full items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          onClick={() => {
            setTimer(0);
            stopRecording();
          }}
        >
          <span className="flex items-center px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
            <StopCircle className={"text-red-400"} />
          </span>
        </button>
        <span className="group flex w-full items-center justify-center border-t border-b border-gray-300 dark:border-gray-600">
          <span className="flex items-center justify-center px-6 py-4 text-sm font-medium">
            <span
              className={`text-sm font-medium ${
                timer >= 60 * 5
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-gray-200"
              }`}
            >
              {timer < 60 && timer}
              {timer >= 60 &&
                new Intl.DateTimeFormat("en", {
                  minute: "numeric",
                  second: "2-digit",
                }).format(timer * 1000)}
            </span>
          </span>
        </span>
        <span className="group flex w-full items-center justify-center cursor-move">
          <DragIcon />
        </span>
      </div>
    </div>
  );
};
