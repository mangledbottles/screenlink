import { Account, Preference, UploadLink } from "./src/utils";

type EventCallback<T> = (value: T) => void;

// types.d.ts
declare global {
    interface Window {
        deviceCode: string;
        electron: {
            getDesktopCapturerSources: () => Promise<Electron.DesktopCapturerSource[]>;
            showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>;
            saveFile: (filePath: string, buffer: Buffer) => Promise<void>;
            blobToBuffer: (blob: Blob) => Promise<Buffer>;
            startRecording: (applicationName?: string) => Promise<void>;
            stopRecording: () => Promise<void>;
            cancelRecording: () => Promise<void>;
            openInBrowser: (url: string) => Promise<void>;
            openNewDevice: () => Promise<void>;
            getDeviceCode: () => Promise<string>;
            on: (channel: string, func: EventCallback<any> | ((...args: any[]) => void) | ((event: Electron.IpcRendererEvent, ...args: any[]) => void)) => void;
            showCameraWindow: (show: boolean) => Promise<void>;
            setUpdatedCameraSource: (previousSource: MediaDeviceInfo | null, source: MediaDeviceInfo | null) => Promise<void>;
            setPermissionsMissing: (missing: boolean) => Promise<void>;
            saveScreenBlob: (blob: ArrayBuffer) => Promise<string>;
            saveScreenCameraBlob: (screenBlob: ArrayBuffer, cameraBlob: ArrayBuffer) => Promise<string>;
            getUploadLink: (sourceTitle: string) => Promise<UploadLink>;
            uploadVideo: (uploadFilePath: string, sourceTitle: string) => Promise<string>;
            logout: () => Promise<void>;
            getAccount: () => Promise<Account>;
            getPreferences: () => Promise<Preference[]>;
            updatePreferences: (preferences: Preference[]) => Promise<void>;
            requestPermission: (permission: string) => Promise<boolean>;
            getVersion: () => Promise<string>;
        };
    }
}

declare module '@sentry/electron/preload';

export { };