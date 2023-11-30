// types.d.ts
declare global {
    interface Window {
        deviceCode: string;
        electron: {
            getDesktopCapturerSources: () => Promise<Electron.DesktopCapturerSource[]>;
            showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>;
            saveFile: (filePath: string, buffer: Buffer) => Promise<void>;
            blobToBuffer: (blob: Blob) => Promise<Buffer>;
            startRecording: (sourceId: string) => Promise<void>;
            stopRecording: () => Promise<void>;
            uploadVideo: (buffer: Buffer, sourceTitle: string) => Promise<string>;
            openInBrowser: (url: string) => Promise<void>;
            openNewDevice: () => Promise<void>;
            getDeviceCode: () => Promise<string>;
            on: (channel: string, func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
            showCameraWindow: (show: boolean) => Promise<void>;
            setUpdatedCameraSource: (source: any) => Promise<void>;
            setPermissionsMissing: (missing: boolean) => Promise<void>;
        };
    }
}
export { };