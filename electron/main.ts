import Mux from '@mux/mux-node';
import { app, BrowserWindow, ipcMain, desktopCapturer, dialog } from 'electron'
import { createReadStream, unlink, writeFile } from 'node:fs'
import path from 'node:path'
import got from "got";
// const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);
const { Video } = new Mux('1fe6f06e-8acb-42e3-bbde-712f3c4d06cf', 'dhKiW6mP9V/Qo5D2x4wPh+MMblSRSb6Htzt7HKNQaZjbVpQhN5g8t7rPiJMGMYcf1a+Q/p2bsep');


// type DesktopCapturerSource = Electron.DesktopCapturerSource

ipcMain.handle('get-desktop-capturer-sources', async (event) => {
  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'], fetchWindowIcons: true, thumbnailSize: { width: 1920, height: 1080 } })
  // const excludeTitles = ['ScreenLink.io', 'App Icon Window', 'App Icon Screens', 'Gesture Blocking Overlay', 'Touch Bar']
  const excludeTitles = ['App Icon Window', 'App Icon Screens', 'Gesture Blocking Overlay', 'Touch Bar']
  return sources
    .filter(source => !excludeTitles.includes(source.name))
    .map(source => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL() ?? source.appIcon.toDataURL(),
    }))
})

// save video to file; show-save-dialog
ipcMain.handle('show-save-dialog', async (events, options: Electron.SaveDialogOptions) => {
  return await dialog.showSaveDialog({
    ...options,
    buttonLabel: 'Save video',
    defaultPath: `content-${Date.now()}.webm`
  });
});

// save video
ipcMain.handle('save-video', async (event, filePath, buffer: Buffer) => {
  await writeFile(filePath, buffer, () => console.log('video saved successfully!'));
});

// convert buffer to video file and upload to Mux
ipcMain.handle('upload-video', async (event, buffer: Buffer) => {
  console.log('upload-video')

  // Define a temporary file path for storage
  // const tempFilePath = path.join(app.getPath('temp'), `temp-${Date.now()}.webm`);
  const tempFilePath = path.join(app.getPath('home'), `temp-${Date.now()}.webm`);

  console.log('tempFilePath: ' + tempFilePath)

  // Convert buffer to video file
  await writeFile(tempFilePath, buffer, () => console.log('Video file created successfully!'));

  // Create a new upload
  const upload = await Video.Uploads.create({
    cors_origin: '*',
    new_asset_settings: {
      playback_policy: 'public',
      max_resolution_tier: "1080p",
    },
    // file_path: tempFilePath
  });
  console.log('upload-video: ' + upload);


  // const response = await got.put(upload.url, {
  //   body: createReadStream(tempFilePath),
  // });

  got.put(upload.url, {
    body: createReadStream(tempFilePath),
  });

  // const fileStream = createReadStream(tempFilePath);
  // await fetch(upload.url, {
  //   method: 'PUT',
  //   body: fileStream,
  //   headers: {
  //     'Content-Type': 'application/octet-stream',
  //   },
  // });
  // return upload;
  console.log('Video uploaded successfully!');

  // Delete the temporary file after upload
  // unlink(tempFilePath, (err) => {
  //   if (err) {
  //     console.error('Error deleting temporary file: ', err);
  //   } else {
  //     console.log('Temporary file deleted successfully!');
  //   }
  // });
  return upload;
});


// screenlink-desktop/electron/main.ts
// ipcMain.handle('get-source-id', async (event) => {
//   const sources = await desktopCapturer.getSources({ types: ['window', 'screen'], fetchWindowIcons: true, thumbnailSize: { width: 1920, height: 1080 } })
//   const excludeTitles = ['ScreenLink.io', 'App Icon Window', 'App Icon Screens', 'Gesture Blocking Overlay', 'Touch Bar']
//   const source = sources.find(source => !excludeTitles.includes(source.name))
//   return source ? source.id : null
// })

// ipcMain.handle('get-media-stream', async (event, sourceId) => {
//   try {
//     const constraints = {
//       audio: false,
//       video: {
//         mandatory: {
//           chromeMediaSource: 'desktop',
//           chromeMediaSourceId: sourceId,
//           minWidth: 1280,
//           maxWidth: 1280,
//           minHeight: 720,
//           maxHeight: 720
//         }
//       }
//     }
//     return await navigator.mediaDevices.getUserMedia(constraints);
//   } catch (e) {
//     console.log(e)
//   }
// })

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
