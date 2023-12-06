import { contextBridge, ipcRenderer } from 'electron'
import { UploadLink } from '../src/utils';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))

contextBridge.exposeInMainWorld('electron', {
  // @ts-ignore
  on: (channel, func) => {
    console.log('preload.ts: electron.on', channel, func)
    ipcRenderer.on(channel, (_, ...args) => func(...args));
  },
  getDeviceCode: async (): Promise<string> => {
    return await ipcRenderer.invoke('get-device-code')
  },
  getDesktopCapturerSources: async (): Promise<Electron.DesktopCapturerSource> => {
    return await ipcRenderer.invoke('get-desktop-capturer-sources')
  },
  getWebcamSources: async (): Promise<Electron.DesktopCapturerSource> => {
    return await ipcRenderer.invoke('get-webcam-sources')
  },
  showSaveDialog: async (options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue> => {
    return await ipcRenderer.invoke('show-save-dialog', options)
  },
  saveFile: async (filePath: string, buffer: Buffer): Promise<void> => {
    return await ipcRenderer.invoke('save-video', filePath, buffer)
  },
  saveScreenBlob: async (blob: ArrayBuffer): Promise<string> => {
    return await ipcRenderer.invoke('save-screen-blob', blob)
  },
  saveScreenCameraBlob: async (screenBlob: ArrayBuffer, cameraBlob: ArrayBuffer): Promise<string> => {
    return await ipcRenderer.invoke('save-screen-camera-blob', screenBlob, cameraBlob)
  },
  blobToBuffer: async (blob: Blob): Promise<Buffer> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const buffer = Buffer.from(reader.result as ArrayBuffer)
        resolve(buffer)
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    })
  },
  startRecording: async (applicationName?: string): Promise<void> => {
    return await ipcRenderer.invoke('start-recording', applicationName)
  },
  stopRecording: async (): Promise<void> => {
    return await ipcRenderer.invoke('stop-recording')
  },
  getUploadLink: async (sourceTitle: string): Promise<UploadLink> => {
    return await ipcRenderer.invoke('get-upload-link', sourceTitle)
  },
  uploadVideo: async (uploadFilePath: string, uploadLink: string): Promise<void> => {
    return await ipcRenderer.invoke('upload-video', uploadFilePath, uploadLink)
  },
  openInBrowser: async (url: string): Promise<void> => {
    return await ipcRenderer.invoke('open-in-browser', url)
  },
  openNewDevice: async (): Promise<void> => {
    return await ipcRenderer.invoke('open-new-device')
  },
  showCameraWindow: async (show: boolean = true): Promise<void> => {
    return await ipcRenderer.invoke('show-camera-window', show)
  },
  // setUpdatedCameraSource: async (_: any, source: MediaDeviceInfo | null): Promise<void> => {
  setUpdatedCameraSource: async (cameraSource: any): Promise<void> => {
    console.log({ cameraSource, in: 'preload.ts' })
    // console.log({ source, in: 'preload.ts' })
    return await ipcRenderer.invoke('set-camera-source', cameraSource)
  },
  setPermissionsMissing: async (missing: boolean): Promise<void> => {
    return await ipcRenderer.invoke('permissions-missing', missing)
  },
  // setUpdatedAudioSource: async (audioSource: any): Promise<void> => {
  //   console.log({ audioSource, in: 'preload.ts' })
  //   return await ipcRenderer.invoke('set-audio-source', audioSource)
  // },
})

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
