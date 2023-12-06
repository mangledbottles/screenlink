import { Fragment, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown, Mic, MicOff } from "lucide-react";

export default function AudioSources({
  audioSource,
  setAudioSource,
}: {
  audioSource: MediaDeviceInfo | null;
  setAudioSource: (device: MediaDeviceInfo | null) => void;
}) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useMemo(() => {
    const getDevices = async () => {
      try {
        // Get the list of audio devices
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = mediaDevices.filter(
          (device) => device.kind === "audioinput"
        );

        setDevices(audioDevices);
        setAudioSource(audioDevices[0] || null);
      } catch (e) {
        alert("Please allow camera access.");
      }
    };

    getDevices();
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-between rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <span className="h-5 w-5 opacity-0 pointer-events-none">
            <ChevronDown />
          </span>
          <span className="text-center flex-grow">
            {audioSource ? audioSource.label : "Select Audio"}
          </span>
          <ChevronDown className="h-5 w-5 text-gray-400" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {devices.map((device) => (
              <Menu.Item key={device.deviceId}>
                {({ active }) => (
                  <a
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex items-center px-4 py-2 text-sm cursor-pointer`}
                    onClick={() => setAudioSource(device)}
                  >
                    <span className="flex-shrink-0">
                      <Mic
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
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
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex items-center px-4 py-2 text-sm`}
                  onClick={() => {
                    setAudioSource(null);
                  }}
                  id="no-camera"
                >
                  <span className="flex-shrink-0">
                    <MicOff
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="ml-3 line-clamp-2 flex-grow">No Audio</span>
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
