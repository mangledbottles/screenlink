"use client";
import { ChevronDown, StopCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Demo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sourceSelected, setSourceSelected] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const demoRef = useRef<HTMLDivElement>(null);

  const startRecording = async () => {
    if (!sourceSelected) {
      return toast.error("Select a Source to Record");
    }
    toast.success("Demo recording started!");
    setIsRecording(!isRecording);
  };

  const stopRecording = async () => {
    console.log("stop recording");
    setIsRecording(false);
    setShowDialog(true);

    // Scroll to the demo element
    demoRef?.current && demoRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {showDialog && (
        <RecordingCompletedDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
        />
      )}

      {isRecording && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 text-white px-4 pl-8 py-2 rounded-r w-10 z-50">
          <div className="flex justify-center items-center bg-white dark:bg-gray-800">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="divide-y divide-gray-300 dark:divide-gray-600 rounded-md shadow-md md:flex md:divide-y-0 bg-gray-50 dark:bg-gray-700">
                    <button
                      className="group flex w-full items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        stopRecording();
                      }}
                    >
                      <span className="flex items-center px-4 py-4 text-sm font-medium text-red-500 dark:text-red-500">
                        <StopCircle />
                      </span>
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to stop recording</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      <div className="w-4/5 mx-auto">
        {/* Demo Nav bar */}
        <div className="bg-gray-800 p-2 rounded-tl rounded-t" ref={demoRef}>
          <div className="flex items-center justify-start h-4">
            <div
              className="flex space-x-2"
              onClick={() => {
                downloadToast();
              }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            <div className="flex-grow text-gray-500 font-bold text-center select-none">
              <span>ScreenLink Demo</span>
            </div>
          </div>
        </div>

        <div className="justify-center">
          <div className="card h-4/6 bg-[#020912]">
            {/* Demo Audio and Webcam Sources */}
            <div className="grid items-center gap-1.5 pt-8">
              <div className="flex flex-col justify-center items-center space-y-4">
                <div
                  className="w-5/12 bg-gray-800 text-white py-2 px-4 rounded flex items-center justify-between text-center"
                  onClick={() => {
                    downloadToast();
                  }}
                >
                  <span className="text-center select-none">
                    FaceTime HD Camera
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </div>

                <div
                  className="w-5/12 bg-gray-800 text-white py-2 px-4 rounded flex items-center justify-between text-center"
                  onClick={() => {
                    downloadToast();
                  }}
                >
                  <span className="text-center select-none">
                    MacBook Pro Microphone
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </div>

                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className={`w-5/12 md:h-10 sm:h-auto group relative justify-center gap-2 transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 bg-sky-700 text-white hover:bg-sky-900 border border-transparent hover:border-sky-900 focus:border-sky-500 focus:ring focus:ring-sky-500 rounded-lg ${
                    isRecording &&
                    "bg-red-500 hover:bg-red-600 focus:border-red-400 focus:ring-red-400"
                  }`}
                >
                  <div className="flex items-center justify-center w-full">
                    {isRecording ? (
                      <>
                        <div className="relative flex items-center justify-center">
                          <div className="absolute h-3 w-3 rounded-full bg-red-400"></div>
                          <div className="absolute animate-ping h-3 w-3 rounded-full bg-red-400 opacity-75"></div>
                        </div>
                        <span className="text-md ml-3">Recording...</span>
                      </>
                    ) : (
                      <span className="text-md ml-2">Start Recording</span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Sources */}
            <div className="flex justify-between items-center space-x-2 mt-4 p-4">
              <div className="not-prose mb-6 mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div
                  className={`group relative rounded-xl border-transparent border-2 -inset-px overflow-hidden ${
                    isHovered || sourceSelected
                      ? "[background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]"
                      : ""
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() =>
                    !isRecording && setSourceSelected(!sourceSelected)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={"https://cdn.screenlink.io/demo-link-2.webp"}
                    alt={"title"}
                    className="w-full h-auto object-cover rounded-lg hover:scale-105"
                    style={{ aspectRatio: "1920 / 1080" }}
                  />
                  <div className="space-y-1 text-sm pt-2 pl-1">
                    <h3 className="font-medium leading-none">
                      {"ScreenLink Demo"}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate overflow-ellipsis overflow-hidden max-h-[3.5em]">
                      {"Mock demo of ScreenLink Desktop" ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const downloadToast = () => {
  return toast(
    `This is just a demo of the Desktop app, you can't change the source`,
    {
      action: {
        label: "Download",
        onClick: () => (window.location.href = "/download"),
      },
    }
  );
};

const RecordingCompletedDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Demo Recording Complete 🚀</AlertDialogTitle>
          <AlertDialogDescription>
            This was just a demo of how the ScreenLink Desktop app works! You
            can download and get started
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Link href="/download">Download</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
