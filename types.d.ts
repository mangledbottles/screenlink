// types.d.ts
declare global {
    interface Window {
        electron: {
            getDesktopCapturerSources: () => Promise<Electron.DesktopCapturerSource[]>;
            showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>;
            saveFile: (filePath: string, buffer: Buffer) => Promise<void>;
            blobToBuffer: (blob: Blob) => Promise<Buffer>;
            uploadVideo: (buffer: Buffer, sourceTitle: string) => Promise<string>;
            openInBrowser: (url: string) => Promise<void>;
        };
    }
}
export {};