import { app, BrowserWindow, ipcMain, desktopCapturer, dialog, nativeImage, shell, systemPreferences } from 'electron'
import { Tray, Menu } from 'electron'
import os from 'os';
import axios from 'axios';

const logger = require('electron-log');
import { autoUpdater } from "electron-updater"
autoUpdater.logger = logger

logger.info('App starting...');
import ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked'
)
ffmpeg.setFfmpegPath(ffmpegPath)


let mainWindow: BrowserWindow | null
let floatingWindow: BrowserWindow | null
let webcamWindow: BrowserWindow | null
let tray: Tray | null = null

// recording state
let showCameraWindow = false;

import { createReadStream, writeFile } from 'node:fs'
import { writeFile as writeFilePromise, readFile as readFilePromise, unlink as unlinkPromise } from 'fs/promises';
import path from 'node:path'
import got from "got";
const sessionDataPath = app.getPath('sessionData');
const deviceCodeFilePath = path.join(sessionDataPath, 'deviceCode.txt');
import cp from 'child_process';
import { UploadLink, baseUrl } from '../src/utils';

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
  // const sources = await desktopCapturer.getSources({ types: ['screen'], fetchWindowIcons: true, thumbnailSize: { width: 1920, height: 1080 } })
  const excludeTitles = ['ScreenLink.io', 'App Icon Window', 'App Icon Screens', 'Gesture Blocking Overlay', 'Touch Bar']
  return sources
    .filter(source => !excludeTitles.includes(source.name))
    .map(source => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL() ?? source.appIcon.toDataURL(),
      dimensions: {
        width: source.thumbnail.getSize().width,
        height: source.thumbnail.getSize().height,
      },
    }))
})

ipcMain.handle('get-webcam-sources', async () => {
  const webcam = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  });
  return webcam;
});

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


ipcMain.handle('set-camera-source', async (_, source: Partial<MediaDeviceInfo> | null) => {
  if (webcamWindow) {
    webcamWindow.webContents.send('new-camera-source', source);
  }
});

ipcMain.handle('start-recording', async (_) => {
  if (mainWindow) mainWindow.minimize();
  if (webcamWindow && showCameraWindow) {
    toggleCameraWindow(true);
    webcamWindow.setAlwaysOnTop(true);
  }
  if (floatingWindow) {
    floatingWindow.show();
    floatingWindow.webContents.send('started-recording', true);
  }
});

ipcMain.handle('stop-recording', async (_) => {
  if (floatingWindow) floatingWindow.hide();
  if (webcamWindow) {
    toggleCameraWindow(true);
    webcamWindow.setAlwaysOnTop(false);
  }
  if (mainWindow) {
    console.log("finsihed recoridng, opening mainwindow")
    mainWindow.webContents.send('finished-recording', true);
    mainWindow.maximize();
    mainWindow.focus();
  }
});

const getUploadLink = async (sourceTitle: string) => {
  try {
    const deviceCode = await getDeviceCode();
    const url = `${baseUrl}/api/uploads`
    console.log({ url, sourceTitle, deviceCode })
    const response = await axios.post(url,
      { sourceTitle: sourceTitle ?? 'Recording' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deviceCode}`
        }
      }
    );
    if (response.status !== 200) {
      console.log(response.data);
      throw new Error(response.statusText);
    }
    const data = response.data;

    return data;
  } catch (error) {
    console.log(error)
    throw new Error(JSON.stringify({ e: "failed to get upload link", error }))
  }
}

ipcMain.handle('save-screen-camera-blob', async (_, screenBlob: ArrayBuffer, cameraBlob: ArrayBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Define a temporary file path for storage
      const screenPath = await path.join(app.getPath('home'), `temp-${Date.now()}-screen.webm`);
      const cameraPath = await path.join(app.getPath('home'), `temp-${Date.now()}-camera.webm`);
      const outputPath = path.join(app.getPath('home'), `temp-${Date.now()}.webm`);

      // Save blobs to files
      await writeFile(screenPath, Buffer.from(screenBlob), () => console.log('Screen file created successfully!'));
      await writeFile(cameraPath, Buffer.from(cameraBlob), () => console.log('Webcam file created successfully!'));

      const command = ffmpeg(screenPath)
        .input(cameraPath)
        .complexFilter([
          // Create a circular mask for the webcam stream
          {
            filter: 'colorkey',
            options: { color: '#000000', similarity: '0.1', blend: '0' },
            inputs: '1:v', // Assuming the webcam is the second input
            outputs: 'webcamMasked'
          },

          // Crop and zoom the webcam stream
          {
            filter: 'crop',
            options: {
              out_w: 'iw/1.5', // Crop width (desired zoom level)
              out_h: 'ih/1.5', // Crop height (desired zoom level)
              x: '(iw-out_w)/2', // Center the crop horizontally
              y: '(ih-out_h)/2' // Center the crop vertically
            },
            inputs: 'webcamMasked',
            outputs: 'webcamCropped'
          },

          // Scale the cropped webcam stream to half its size
          {
            filter: 'scale',
            options: { w: 'iw/1.5', h: 'ih/1.5' }, // This scales the webcam to a quarter of its original size, which is half the size of the cropped version
            inputs: 'webcamCropped',
            outputs: 'webcamZoomed'
          },

          // Overlay the zoomed and scaled webcam on the main video stream
          {
            filter: 'overlay',
            options: {
              x: 'main_w-overlay_w-10', // Position on the bottom right corner
              y: 'main_h-overlay_h-10'
            },
            inputs: ['0:v', 'webcamZoomed']
          }
        ])
        .videoCodec('libx264')
        .videoBitrate('8000k')
        .fps(60)
        .format('mp4')
        .output(outputPath)
        .on('error', (err) => console.error('Error:', err))
        .on('end', async () => {
          // Delete the screen and webcam temporary files after processing
          await unlinkPromise(screenPath)
          await unlinkPromise(cameraPath)
          // Return the output path
          resolve(outputPath);
        });

      command.run();

    } catch (error) {
      console.log(error)
      reject(error);
      throw new Error(JSON.stringify({ e: "failed to save blob", error }))
    }
  });
});

ipcMain.handle('save-screen-blob', async (_, blob: ArrayBuffer) => {
  try {
    // Define a temporary file path for storage
    const tempFilePath = path.join(app.getPath('home'), `temp-${Date.now()}.webm`);

    // Convert buffer to video file
    await writeFile(tempFilePath, Buffer.from(blob), () => console.log('Video file created successfully!'));
    return tempFilePath;
  } catch (error) {
    console.log(error)
    throw new Error(JSON.stringify({ e: "failed to save blob", error }))
  }
});

ipcMain.handle('get-upload-link', async (_, sourceTitle: string): Promise<UploadLink> => {
  try {
    // Make a request to get the upload URL
    const upload = await getUploadLink(sourceTitle);
    const uploadLink = upload.uploadLink;
    const id = upload.id;
    return { uploadLink, uploadId: id };
  } catch (error) {
    console.log(error)
    throw new Error(JSON.stringify({ e: "failed to get upload link", error }))
  }
});

// Upload video to server
ipcMain.handle('upload-video', async (_, uploadFile, uploadLink: string) => {
  try {
    await getAccount();

    got.put(uploadLink, {
      body: createReadStream(uploadFile),
    }).then(async () => {
      console.log('Video uploaded successfully!');

      // Delete the upload file after uploading
      await unlinkPromise(uploadFile)
    }).catch((err) => {
      console.log(JSON.stringify({ e: "failed to upload video", err, uploadLink }))
      throw new Error(err);
    });

    return;
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

ipcMain.handle('show-camera-window', async (_, show: boolean) => {
  try {
    toggleCameraWindow(show);
  } catch (error) {
    console.log(error)
  }
});

const toggleCameraWindow = (show: boolean) => {
  if (webcamWindow) {
    showCameraWindow = show;
    if (show) webcamWindow.show();
    else webcamWindow.hide();
  }
}

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
    throw new Error(JSON.stringify({ e: "failed to verify device code", error }))
  }
}

const getDeviceCode = async () => {
  try {
    // Read the device code from the file (deviceCodeFilePath)
    // and send it to the renderer process
    const deviceCodeBuffer = await readFilePromise(deviceCodeFilePath);
    const deviceCode = deviceCodeBuffer.toString();

    if (!deviceCode) {
      if (mainWindow) {
        mainWindow.webContents.send('device-code', '');
      }
      return;
    }
    return deviceCode;
  } catch (error) {
    console.log(error)
    throw new Error(JSON.stringify({ e: "failed to get device code", error }))
  }
}

const log = async (data: object) => {
  const webhookUrl = 'https://webhook.site/ce05f4c4-7d74-4013-a954-356b11d11873';
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Failed to send log:', error);
  }
}

const getAccount = async () => {
  try {
    const deviceCode = await getDeviceCode();
    console.log('Device code on get: ', deviceCode);
    if (deviceCode === '' || !deviceCode) {
      log({ e: 'device code not found', location: "get device code" })
      if (mainWindow) {
        mainWindow.webContents.send('device-code', '');
      }
      return;
    }

    // Verify the device code
    const device = await verifyDeviceCode(deviceCode);
    if (!device) {
      if (mainWindow) {
        log({ e: 'device not found', location: "verify device code" })
        mainWindow.webContents.send('device-code', '');
      }
      return;
    }
    return device;
  } catch (error) {
    console.log(error)
    log({ e: 'failed to get account', error, location: "catch error" })
    // if (mainWindow) {
    //   mainWindow.webContents.send('device-code', '');
    // }
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

ipcMain.handle('permissions-missing', async (_) => {
  try {
    if (mainWindow) {
      mainWindow.webContents.send('set-window', 'permissions');
    }
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


// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const missingPermissions = async () => {
  const screenStatus = await systemPreferences.getMediaAccessStatus('screen')
  const cameraStatus = await systemPreferences.getMediaAccessStatus('camera')
  const microphoneStatus = await systemPreferences.getMediaAccessStatus('microphone')

  let missingList = [];
  if (cameraStatus != 'granted') missingList.push('camera');
  if (microphoneStatus != 'granted') missingList.push('microphone');
  if (screenStatus != 'granted') missingList.push('screen');

  return missingList;
}

const requestPermissions = async (permission: string): Promise<boolean> => {
  try {
    if (permission === 'camera' || permission === 'microphone') {
      const status = await systemPreferences.askForMediaAccess(permission);
      return status;
    } else if (permission === 'screen') {
      if (process.platform === 'darwin') {
        const screenAccessStatus = systemPreferences.getMediaAccessStatus('screen');
        if (screenAccessStatus !== 'granted') {
          dialog.showMessageBox({
            type: 'info',
            message: 'Please grant screen recording permissions in System Preferences.',
            buttons: ['Open System Preferences', 'Cancel']
          }).then(({ response }) => {
            if (response === 0) {
              // Open the Security & Privacy section of System Preferences
              shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture');
            }
          });
        } else {
          // already granted
          return true;
        }
      } else {
        // return true if other than macOS for screen
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error)
    return false;
  }

}

function createFloatingWindow() {
  const floatingWindow = new BrowserWindow({
    width: 60,
    height: 150,
    x: 0,
    y: 0,
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    frame: false, // This makes the window frameless
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    // floatingWindow.loadURL(`${VITE_DEV_SERVER_URL}?window=floating`);
    floatingWindow.loadURL(`${VITE_DEV_SERVER_URL}`).then(() => {
      // Once the file is loaded, send a message to the renderer with the parameter
      if (!floatingWindow) return console.log('No floating window to send set-window to');
      floatingWindow?.webContents.send('set-window', 'floating');
    });

  } else {
    // floatingWindow.loadFile(path.join(process.env.DIST, 'index.html?window=floating')).then(() => {
    floatingWindow.loadFile(path.join(process.env.DIST, 'index.html')).then(() => {
      // Once the file is loaded, send a message to the renderer with the parameter
      if (!floatingWindow) return console.log('No floating window to send set-window to');
      floatingWindow?.webContents.send('set-window', 'floating');
    });
  }
  return floatingWindow;
}


const createWebcamWindow = () => {
  const webcamWindow = new BrowserWindow({
    width: 200,
    height: 150,
    x: 1920 - 200,
    y: 1080,
    resizable: false,
    movable: true,
    // alwaysOnTop: true,
    frame: false, // This makes the window frameless
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    // webcamWindow.loadURL(`${VITE_DEV_SERVER_URL}?window=webcam`);
    webcamWindow.loadURL(`${VITE_DEV_SERVER_URL}`).then(() => {
      // Once the file is loaded, send a message to the renderer with the parameter
      if (!webcamWindow) return console.log('No webcam window to send set-window to');
      webcamWindow?.webContents.send('set-window', 'webcam');
    });

  } else {
    // webcamWindow.loadFile(path.join(process.env.DIST, 'index.html?window=webcam'));
    webcamWindow.loadFile(path.join(process.env.DIST, 'index.html')).then(() => {
      // Once the file is loaded, send a message to the renderer with the parameter
      if (!webcamWindow) return console.log('No webcam window to send set-window to');
      webcamWindow?.webContents.send('set-window', 'webcam');
    });
  }
  return webcamWindow;
}

function createWindow() {
  // assign the deep link url to a variable (screenlinkDesktop://xxx)
  app.setAsDefaultProtocolClient('screenlinkDesktop');
  autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.checkForUpdates();

  const applicationIconPath = path.join(process.env.VITE_PUBLIC, 'apple.icns');
  let applicationIcon = nativeImage.createFromPath(applicationIconPath);
  applicationIcon = applicationIcon.resize({
    height: 16,
    width: 16
  });

  mainWindow = new BrowserWindow({
    icon: applicationIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  })

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', (new Date).toLocaleString())
  })


  // Create the floating window and hide it
  floatingWindow = createFloatingWindow();
  floatingWindow.hide();

  // Create the webcam window and hide it
  webcamWindow = createWebcamWindow();
  webcamWindow.hide();

  if (VITE_DEV_SERVER_URL) {
    // mainWindow.loadURL(`${VITE_DEV_SERVER_URL}?window=main`);
    mainWindow.loadURL(`${VITE_DEV_SERVER_URL}`).then(async () => {
      const permissionsMissing = await missingPermissions();
      if (permissionsMissing.length > 0) {
        mainWindow?.webContents.send('set-window', 'permissions');
        console.log({ permissionsMissing })
        permissionsMissing.forEach(async (permission: string) => {
          const wasApproved = await requestPermissions(permission);
          if (wasApproved) permissionsMissing.splice(permissionsMissing.indexOf(permission), 1);
        });

      } else {
        // Once the file is loaded, send a message to the renderer with the parameter
        if (!mainWindow) return console.log('No main window to send set-window to');
        mainWindow?.webContents.send('set-window', 'main');
      }
    })
      .catch(e => console.error('Failed to load index.html', e));
  } else {
    // mainWindow.loadFile(path.join(process.env.DIST, 'index.html?window=main'));
    // Load the file directly without URL parameters
    mainWindow.loadFile(path.join(process.env.DIST, 'index.html'))
      .then(async () => {
        const permissionsMissing = await missingPermissions();
        if (permissionsMissing.length > 0) {
          mainWindow?.webContents.send('set-window', 'permissions');
          console.log({ permissionsMissing })
          permissionsMissing.forEach(async (permission: string) => {
            const wasApproved = await requestPermissions(permission);
            if (wasApproved) permissionsMissing.splice(permissionsMissing.indexOf(permission), 1);
          });

        } else {
          // Once the file is loaded, send a message to the renderer with the parameter
          if (!mainWindow) return console.log('No main window to send set-window to');
          mainWindow?.webContents.send('set-window', 'main');
        }
      })
      .catch(e => console.error('Failed to load index.html', e));
  }

  // Auto Updater
  autoUpdater.on('update-available', () => {
    mainWindow?.webContents.send('set-window', 'update', 'Update available.');
  })
  autoUpdater.on('error', (err) => {
    mainWindow?.webContents.send('set-window', 'update', 'Error in auto-updater. Contact support if this continues. ' + err);
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    mainWindow?.webContents.send('set-window', 'update', log_message);
  })
  autoUpdater.on('update-downloaded', () => {
    mainWindow?.webContents.send('set-window', 'main');
  });



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
    if (mainWindow) {
      mainWindow.webContents.send('device-code', deviceCode);
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
    mainWindow = null
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
  if (mainWindow) {
    mainWindow.webContents.send('device-code', deviceCode);
  }
});

app.whenReady().then(createWindow)
