import { app, BrowserWindow, ipcMain, desktopCapturer, dialog, nativeImage, shell } from 'electron'
import { Tray, Menu } from 'electron'

import { createReadStream, unlink, writeFile } from 'node:fs'
import path from 'node:path'
import got from "got";
const isProd = process.env.NODE_ENV === "production";
const baseUrl = isProd ? 'https://screenlink.io' : 'http://localhost:3008';

ipcMain.handle('get-desktop-capturer-sources', async () => {
  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'], fetchWindowIcons: true, thumbnailSize: { width: 1920, height: 1080 } })
  const excludeTitles = ['ScreenLink.io', 'App Icon Window', 'App Icon Screens', 'Gesture Blocking Overlay', 'Touch Bar']
  return sources
    .filter(source => !excludeTitles.includes(source.name))
    .map(source => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL() ?? source.appIcon.toDataURL(),
    }))
})

// save video to file; show-save-dialog
ipcMain.handle('show-save-dialog', async (_, options: Electron.SaveDialogOptions) => {
  return await dialog.showSaveDialog({
    ...options,
    buttonLabel: 'Save video',
    defaultPath: `content-${Date.now()}.webm`
  });
});

// save video
ipcMain.handle('save-video', async (_, filePath, buffer: Buffer) => {
  await writeFile(filePath, buffer, () => console.log('video saved successfully!'));
});

// convert buffer to video file and upload to Mux
ipcMain.handle('upload-video', async (_, buffer: Buffer, sourceTitle: string) => {
  try {
    // Define a temporary file path for storage
    const tempFilePath = path.join(app.getPath('home'), `temp-${Date.now()}.webm`);

    // Convert buffer to video file
    await writeFile(tempFilePath, buffer, () => console.log('Video file created successfully!'));

    // Make a request to get the upload URL
    const url = isProd ? 'https://screenlink.io/api/uploads' : 'http://localhost:3008/api/uploads';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sourceTitle })
    });
    const data = await response.json();
    const uploadLink = data.uploadLink;
    const id = data.id;

    console.log({ uploadLink, id });

    got.put(uploadLink, {
      body: createReadStream(tempFilePath),
    }).then(async () => {
      console.log('Video uploaded successfully!');

      // Delete the temporary file after upload
      unlink(tempFilePath, (err) => {
        if (err) {
          console.error('Error deleting temporary file: ', err);
        } else {
          console.log('Temporary file deleted successfully!');
        }
      });
    });

    return id;
  } catch (error) {
    console.log(error)
  }
});

ipcMain.handle('open-in-browser', async (_, url: string) => {
  try {
    return await shell.openExternal(url);
  } catch (error) {
    console.log(error)
  }
});

ipcMain.handle('open-new-device', async (_) => {
  try {
    const deviceName = os.hostname();
    const url = `${baseUrl}/app/devices/new?device=${deviceName}&app=screenlink`;
    return await shell.openExternal(url);
  } catch (error) {
    console.log(error)
  }
});


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
let tray: Tray | null = null

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

  const iconPath = path.join(process.env.VITE_PUBLIC, 'tray-icon.png');
  let icon = nativeImage.createFromPath(iconPath);
  icon = icon.resize({
    height: 16,
    width: 16
  });
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
  console.log(tray)
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
