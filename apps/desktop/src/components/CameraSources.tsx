import { Fragment, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Camera, CameraOff, ChevronDown } from "lucide-react";

export default function CameraSources({
  cameraSource,
  setCameraSource,
}: {
  cameraSource: MediaDeviceInfo | null;
  setCameraSource: (device: MediaDeviceInfo | null) => void;
}) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useMemo(() => {
    const getDevices = async () => {
      try {
        // Get the list of video devices
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices
          .reverse()
          .filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);
        setCameraSource(videoDevices[0] || null);
      } catch (e) {
        setPermissionDenied(true);
        await window.electron.setPermissionsMissing(true);
      }
    };
    getDevices();
  }, []);

  if (permissionDenied) {
    return <div>Please allow camera access.</div>;
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-between rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
          <span className="h-5 w-5 opacity-0 pointer-events-none">
            <ChevronDown />
          </span>
          <span className="text-center flex-grow">
            {cameraSource ? cameraSource.label : "Select Camera"}
          </span>
          <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-200" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {devices.map((device) => (
              <Menu.Item key={device.deviceId}>
                {({ active }) => (
                  <a
                    className={`${
                      active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"
                    } group flex items-center px-4 py-2 text-sm cursor-pointer`}
                    onClick={() => setCameraSource(device)}
                  >
                    <span className="flex-shrink-0">
                      <Camera
                        className="h-5 w-5 text-gray-400 dark:text-gray-200 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-3 line-clamp-2 flex-grow">
                      {device.label}
                    </span>
                  </a>
                )}
              </Menu.Item>
            ))}
            <Menu.Item>
              {({ active }) => (
                <a
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"
                  } group flex items-center px-4 py-2 text-sm cursor-pointer`}
                  onClick={() => {
                    setCameraSource(null);
                  }}
                  id="no-camera"
                >
                  <span className="flex-shrink-0">
                    <CameraOff
                      className="h-5 w-5 text-gray-400 dark:text-gray-200 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="ml-3 line-clamp-2 flex-grow">No Camera</span>
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
