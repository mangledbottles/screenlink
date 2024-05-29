"use client";

import { Dialog, Transition } from "@headlessui/react";
import { getOS } from "@/app/utils";
import { Project } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import TeamSettings from "../../../public/images/team-settings.png";
import DesktopDemo from "../../../public/images/desktop-demo.png";
import RecordingDemo from "../../../public/images/recording-demo.jpg";
import { toast } from "sonner";
import {
  GitHubRelease,
  fetchReleases,
  getDownloadUrl,
} from "@/app/(default)/download/DownloadButton";
import { useRouter } from "next/navigation";
import { syncOnboarding } from "@/actions/syncOnboarding";

const onboardingSchema = z.object({
  persona: z.string().min(1, { message: "Please select an option" }),
  workspaceName: z
    .string()
    .min(3, "Workspace name must contain at least 3 characters")
    .optional(),
});

type OnboardingSchema = z.infer<typeof onboardingSchema>;

export default function OnboardingPageClient({
  project,
}: {
  project: Project | null;
}) {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(1);
  const methods = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      persona: "",
      workspaceName: project?.name || "",
    },
  });
  const { handleSubmit, watch } = methods;
  const [canContinue, setCanContinue] = useState(false);

  const watchPersona = watch("persona");
  const watchWorkspaceName = watch("workspaceName");

  const onSubmit = (data: OnboardingSchema) => {
    syncOnboarding({ persona: data.persona, workspaceName: data.workspaceName ?? "" });
    router.push("/app");
  };

  const syncChanges = ({ persona, workspaceName }: { persona: string, workspaceName: string }) => {
    // sync changes to database everytime user clicks continue tab
    syncOnboarding({ persona, workspaceName });
  };

  const handleNext = () => {
    syncChanges({ persona: watchPersona, workspaceName: watchWorkspaceName ?? "" });
    if (tabIndex < 4) {
      setTabIndex(tabIndex + 1);
      setCanContinue(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-2 gap-6 h-[calc(60vh-4rem)]">
        <div>
          <div aria-hidden="true">
            <div className="overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-600"
                style={{ width: `${tabIndex * 25}%` }}
              />
            </div>
          </div>

          {tabIndex === 1 && (
            <TabOne_Persona setCanContinue={setCanContinue} methods={methods} />
          )}
          {tabIndex === 2 && (
            <TabTwo_WorkspaceName
              setCanContinue={setCanContinue}
              methods={methods}
            />
          )}
          {tabIndex === 3 && (
            <TabThree_Download
              methods={methods}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            />
          )}

          {tabIndex < 3 && (
            <button
              type="button"
              disabled={!canContinue}
              onClick={handleNext}
              className="inline-flex items-center gap-x-2 mt-4 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-gray-400"
            >
              Continue
              <ArrowRight className="-mr-0.5 h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        <div>
          <div className="bg-gradient-to-l from-purple-900 to-blue-900 h-full flex items-center justify-center rounded-lg">
            <Image
              src={
                tabIndex === 1
                  ? RecordingDemo
                  : tabIndex === 2
                  ? TeamSettings
                  : tabIndex === 3
                  ? DesktopDemo
                  : RecordingDemo
              }
              alt="Background"
              priority={true}
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

const TabOne_Persona = ({
  methods,
  setCanContinue,
}: {
  methods: UseFormReturn<OnboardingSchema>;
  setCanContinue: Dispatch<SetStateAction<boolean>>;
}) => {
  const { watch, setValue } = methods;
  const persona = watch("persona");

  const handleRadioChange = (value: string) => {
    setValue("persona", value);
    setCanContinue(true);
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-4">
        How are you planning to use ScreenLink?
      </h1>
      <div className="mt-6 space-y-6">
        <div className="flex items-center gap-x-3 cursor-pointer select-none">
          <Controller
            name="persona"
            control={methods.control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                id="for-work"
                type="radio"
                value="work"
                checked={persona === "work"}
                className="h-4 w-4 border-gray-600 text-indigo-600 focus:ring-indigo-600"
                onChange={() => handleRadioChange("work")}
              />
            )}
          />
          <label
            htmlFor="for-work"
            className="block text-sm font-medium leading-6 text-gray-100 select-none cursor-pointer"
          >
            For work
          </label>
        </div>
        <div className="flex items-center gap-x-3 cursor-pointer select-none">
          <Controller
            name="persona"
            control={methods.control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                id="for-education"
                type="radio"
                value="education"
                checked={persona === "education"}
                className="h-4 w-4 border-gray-600 text-indigo-600 focus:ring-indigo-600"
                onChange={() => handleRadioChange("education")}
              />
            )}
          />
          <label
            htmlFor="for-education"
            className="block text-sm font-medium leading-6 text-gray-100 select-none cursor-pointer"
          >
            For education
          </label>
        </div>
        <div className="flex items-center gap-x-3 cursor-pointer select-none">
          <Controller
            name="persona"
            control={methods.control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                id="for-personal"
                type="radio"
                value="personal"
                checked={persona === "personal"}
                className="h-4 w-4 border-gray-600 text-indigo-600 focus:ring-indigo-600"
                onChange={() => handleRadioChange("personal")}
              />
            )}
          />
          <label
            htmlFor="for-personal"
            className="block text-sm font-medium leading-6 text-gray-100 select-none cursor-pointer"
          >
            For personal use
          </label>
        </div>
      </div>
    </>
  );
};

const TabTwo_WorkspaceName = ({
  methods,
  setCanContinue,
}: {
  methods: UseFormReturn<OnboardingSchema>;
  setCanContinue: Dispatch<SetStateAction<boolean>>;
}) => {
  const { control, setValue, watch } = methods;
  const workspaceName = watch("workspaceName");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("workspaceName", value);
    setCanContinue(value.trim() !== "");
  };

  useEffect(() => {
    setCanContinue(workspaceName?.trim() !== "");
  }, [workspaceName, setCanContinue]);

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-4">
        What would you like to name your workspace?
      </h1>
      <p className="mt-2 text-sm text-gray-300">
        Your workspace is where you will store all your recordings and share
        them with your team.
      </p>
      <div className="mt-6">
        <label
          htmlFor="workspaceName"
          className="ml-px block text-sm font-medium leading-6 text-gray-100"
        >
          Workspace Name
        </label>
        <div className="mt-1 mb-2">
          <Controller
            name="workspaceName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="workspaceName"
                className="block w-96 rounded-full border-0 px-4 py-1.5 text-white bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder=""
                onChange={handleInputChange}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

const TabThree_Download = ({
  methods,
  handleSubmit,
  onSubmit,
}: {
  methods: UseFormReturn<OnboardingSchema>;
  handleSubmit: (onSubmit: (data: OnboardingSchema) => void) => () => void;
  onSubmit: (data: OnboardingSchema) => void;
}) => {
  const [isMacOSDownloadOpen, setMacOSDownloadOpen] = useState(false);
  const [releases, setReleases] = useState<GitHubRelease[]>([]);

  const handleDesktopDownload = async () => {
    const operatingSystem = getOS();
    const releases = await fetchReleases();
    const url = getDownloadUrl(operatingSystem, releases);
    if (operatingSystem === "macOS") {
      setReleases(releases);
      setMacOSDownloadOpen(true);
    } else if (operatingSystem === "Windows") {
      if (url) {
        window.open(url);
      }
    }
  };

  const handleChromeDownload = () => {
    toast.info(
      "Coming Soon! We are working on a Chrome extension to record your screen directly in the browser. Download our desktop app!"
    );
  };

  return (
    <>
      <MacOSDownloadDialog
        open={isMacOSDownloadOpen}
        setOpen={setMacOSDownloadOpen}
        releases={releases}
      />
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            <div className="text-sm font-medium leading-6 text-gray-900">
              Chrome Recorder
            </div>
            <div className="relative ml-auto cursor-pointer">
              <div
                className="-m-2.5 block p-2.5 text-gray-400 hover:text-indigo-500"
                onClick={handleChromeDownload}
              >
                <span className="sr-only">Download</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 text-sm leading-6">
            <p>
              Record your screen directly in the browser. No downloads required.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            <div className="text-sm font-medium leading-6 text-gray-900">
              Desktop Application
            </div>
            <div className="relative ml-auto cursor-pointer">
              <div
                className="-m-2.5 block p-2.5 text-gray-400 hover:text-indigo-500"
                onClick={handleDesktopDownload}
              >
                <span className="sr-only">Download</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 text-sm leading-6">
            <p>
              Download our desktop app for advanced recording and editing
              features.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSubmit(onSubmit)()}
          className="mt-4 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Continue to workspace
        </button>
      </div>
    </>
  );
};

function MacOSDownloadDialog({
  open,
  setOpen,
  releases,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  releases: GitHubRelease[] | null;
}) {
  const handleDownloadClick = (os: string) => {
    if (os === "mac-intel") {
      window.open(
        intelMacRelease?.assets.find((asset) =>
          intelMacPattern.test(asset.name)
        )?.browser_download_url ?? "#"
      );
    } else if (os === "mac-arm") {
      window.open(
        armMacRelease?.assets.find((asset) => armMacPattern.test(asset.name))
          ?.browser_download_url ?? "#"
      );
    }
  };

  const intelMacPattern = /ScreenLink-\d+\.\d+\.\d+\.dmg/;
  const armMacPattern = /ScreenLink-\d+\.\d+\.\d+-arm64\.dmg/;

  const intelMacRelease = releases?.find((release) =>
    release.assets.find((asset) => intelMacPattern.test(asset.name))
  );

  const armMacRelease = releases?.find((release) =>
    release.assets.find((asset) => armMacPattern.test(asset.name))
  );

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={() => setOpen(false)}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-1/3 sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <div className="mt-2">
                    <div className="flex flex-col space-y-4">
                      {intelMacRelease && (
                        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <div className="flex-1 min-w-0">
                            <a
                              className="focus:outline-none cursor-pointer"
                              onClick={() => handleDownloadClick("mac-intel")}
                            >
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              ></span>
                              <p className="text-sm font-medium text-gray-900">
                                Download for Intel Macs
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                Compatible with MacBooks with Intel processors
                              </p>
                            </a>
                          </div>
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                      {armMacRelease && (
                        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <div className="flex-1 min-w-0">
                            <a
                              className="focus:outline-none cursor-pointer"
                              onClick={() => handleDownloadClick("mac-arm")}
                            >
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              ></span>
                              <p className="text-sm font-medium text-gray-900">
                                Download for Apple Silicon
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                Compatible with MacBooks with M1/M2 chips
                              </p>
                            </a>
                          </div>
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
