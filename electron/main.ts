import { app, BrowserWindow, ipcMain, desktopCapturer, dialog, nativeImage, shell } from 'electron'
import { Tray, Menu } from 'electron'
import os from 'os';

import { createReadStream, unlink, writeFile } from 'node:fs'
import { writeFile as writeFilePromise, readFile as readFilePromise } from 'fs/promises';
import path from 'node:path'
import got from "got";
const isProd = process.env.NODE_ENV != "development";
const baseUrl = isProd ? 'https://screenlink.io' : 'http://localhost:3008';
const sessionDataPath = app.getPath('sessionData');
const deviceCodeFilePath = path.join(sessionDataPath, 'deviceCode.txt');
import cp from 'child_process';

function getComputerName() {
  switch (process.platform) {
    case "win32":
      return process.env.COMPUTERNAME;
    case "darwin":
      return cp.execSync("scutil --get ComputerName").toString().trim();
    case "linux":
      const prettyname = cp.execSync("hostnamectl --pretty").toString().trim();
      return prettyname === "" ? os.hostname() : prettyname;
    default:
      return os.hostname();
  }
}

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
    const deviceCode = await getDeviceCode();
    const account = await getAccount();

    // Define a temporary file path for storage
    const tempFilePath = path.join(app.getPath('home'), `temp-${Date.now()}.webm`);

    // Convert buffer to video file
    await writeFile(tempFilePath, buffer, () => console.log('Video file created successfully!'));

    // Make a request to get the upload URL
    const url = `${baseUrl}/api/uploads`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deviceCode}`
      },
      body: JSON.stringify({ sourceTitle })
    });
    if (response.status !== 200) {
      console.log(JSON.stringify({ e: "failed to get upload link", url }))
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (data.error) {
      console.log(JSON.stringify({ e: "failed to get upload link", url, error: data.error }))
      throw new Error(data.error);
    }
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
    }).catch((err) => {
      console.log(JSON.stringify({ e: "failed to upload video", err, uploadLink }))
      throw new Error(err);
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
    const deviceName = getComputerName();
    const appVersion = app.getVersion();
    const deviceType = os.type();
    const url = `${baseUrl}/app/devices/new?device=${deviceName}&appVersion=${appVersion}&deviceType=${deviceType}`;
    return await shell.openExternal(url);
  } catch (error) {
    console.log(error)
  }
});

const verifyDeviceCode = async (deviceCode: string) => {
  try {
    const url = `${baseUrl}/api/devices/verify`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ deviceCode })
    });
    if (response.status !== 200) {
      console.log(JSON.stringify({ e: "failed to verify device code", url }))
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (data.error) {
      console.log(JSON.stringify({ e: "failed to verify device code", url, error: data.error }))
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.log(error)
  }
}

const getDeviceCode = async () => {
  // Read the device code from the file (deviceCodeFilePath)
  // and send it to the renderer process
  const deviceCodeBuffer = await readFilePromise(deviceCodeFilePath);
  const deviceCode = deviceCodeBuffer.toString();
  return deviceCode;
}

const getAccount = async () => {
  try {
    const deviceCode = await getDeviceCode();
    console.log('Device code on get: ', deviceCode);
    if (deviceCode === '') {
      if (win) {
        win.webContents.send('device-code', 'Device code not available');
      }
      return;
    }

    // Verify the device code
    const device = await verifyDeviceCode(deviceCode);
    if (!device) {
      if (win) {
        win.webContents.send('device-code', 'Device code not available');
      }
      return;
    }
    return device;
  } catch (error) {
    console.log(error)
    if (win) {
      win.webContents.send('device-code', 'Device code not available');
    }
    return;
  }
}

ipcMain.handle('get-device-code', async (_) => {
  try {
    const deviceCode = await getDeviceCode();
    console.log('Device code on get: ', deviceCode);
    if (deviceCode === '') {
      return null;
    }

    // TODO: Update this logic as it does not need to check immediately on open, maybe 5 seconds later (UI purposes)
    // Verify the device code
    // const device = await verifyDeviceCode(deviceCode);
    // if (!device) {
    //   return null;
    // }
    return deviceCode;
  } catch (error) {
    console.log(error)
    return null;
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
  // assign the deep link url to a variable
  app.setAsDefaultProtocolClient('screenlinkDesktop');

  const applicationIconPath = path.join(process.env.VITE_PUBLIC, 'apple.icns');
  let applicationIcon = nativeImage.createFromPath(applicationIconPath);
  applicationIcon = applicationIcon.resize({
    height: 16,
    width: 16
  });

  win = new BrowserWindow({
    icon: applicationIconPath,
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

  // Read the device code from the file (deviceCodeFilePath)
  // and send it to the renderer process
  readFilePromise(deviceCodeFilePath).then((deviceCodeBuffer) => {
    const deviceCode = deviceCodeBuffer.toString();
    console.log('Device code on ready: ', deviceCode);
    if (win) {
      win.webContents.send('device-code', deviceCode);
    } else {
      console.log('No window to send device code to');
    }
  });

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

// This event will be emitted when your app is opened with a URL that uses your protocol
app.on('open-url', (event, url) => {
  // Prevent the default behavior
  event.preventDefault();

  // Parse the URL
  const parsedUrl = new URL(url);
  // deviceCode is in host (    host: 'deviceCode=8cda48126269f9bbc55bef2c7cf0300e8f1cbfe5',)
  const deviceCode = parsedUrl.host.split('=')[1];
  // Log the device code
  console.log(`Device code: ${deviceCode}`);
  // Send the device code to the renderer process
  // ipcMain.emit('device-code', deviceCode);

  // Write the device code to a file in the sessionData directory
  writeFilePromise(deviceCodeFilePath, deviceCode).then(() => {
    console.log('Device code saved successfully!');
  });


  // Send the device code to the renderer process
  if (win) {
    win.webContents.send('device-code', deviceCode);
  }
});

app.whenReady().then(createWindow)
