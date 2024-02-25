declare global {
    interface Window {
        electron: {
            getDesktopCapturerSources: (options: Electron.DesktopCapturerSourceFetchOptions) => Promise<Electron.DesktopCapturerSource[]>
        }
    }
}