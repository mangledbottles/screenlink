import { createContext, useContext, useMemo, useState } from "react";

type RecordingContextType = {
  selectedCamera: MediaDeviceInfo | null;
  setSelectedCamera: (camera: MediaDeviceInfo | null) => void;
};

const defaultRecordingContext: RecordingContextType = {
  selectedCamera: null,
  setSelectedCamera: () => {},
};

export const RecordingContext = createContext<RecordingContextType>(
  defaultRecordingContext
);

export const useRecordingContext = () => useContext(RecordingContext);

export const RecordingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedCamera, setSelectedCamera] = useState<MediaDeviceInfo | null>(
    null
  );
  const [previousCameraSource, setPreviousCameraSource] =
    useState<MediaDeviceInfo | null>(null);

  useMemo(async () => {
    // @ts-ignore
    const cameraSourceInfo: MediaDeviceInfo | null = selectedCamera
      ? {
          deviceId: selectedCamera.deviceId,
          kind: selectedCamera.kind,
          label: selectedCamera.label,
          groupId: selectedCamera.groupId,
        }
      : null;

    // @ts-ignore
    const previousSourceInfo: MediaDeviceInfo | null = previousCameraSource
      ? {
          deviceId: previousCameraSource.deviceId,
          kind: previousCameraSource.kind,
          label: previousCameraSource.label,
          groupId: previousCameraSource.groupId,
        }
      : null;

    if (
      cameraSourceInfo?.deviceId != previousCameraSource?.deviceId &&
      (cameraSourceInfo || previousSourceInfo)
    ) {
      await window.electron.setUpdatedCameraSource(
        previousSourceInfo,
        cameraSourceInfo
      );
      setPreviousCameraSource(selectedCamera);
    }
  }, [selectedCamera, previousCameraSource]);

  const updateCameraSource = (source: MediaDeviceInfo | null) => {
    //   if (source?.deviceId !== previousCameraSource?.deviceId) {
    setSelectedCamera(source);
    //   }
  };

  window.electron.on("new-camera-source", updateCameraSource);

  return (
    <RecordingContext.Provider value={{ selectedCamera, setSelectedCamera }}>
      {children}
    </RecordingContext.Provider>
  );
};
