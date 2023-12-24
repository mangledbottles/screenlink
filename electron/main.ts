import { app, BrowserWindow, ipcMain, desktopCapturer, dialog, nativeImage, shell, systemPreferences, Tray } from 'electron'
import os from 'os';
import axios from 'axios';
const { getWindows, activateWindow } = require('mac-windows');
import * as logger from 'electron-log';
import { autoUpdater } from "electron-updater"
import * as Sentry from "@sentry/electron/main";
import { createReadStream, writeFile } from 'node:fs'
import { writeFile as writeFilePromise, readFile as readFilePromise, unlink as unlinkPromise } from 'fs/promises';
import path from 'node:path'
import got from "got";
import cp from 'child_process';
import { MacWindow, UploadLink, baseUrl, Account, Preference } from '../src/utils';
import { platform } from 'process';

const sessionDataPath = app.getPath('sessionData');
const deviceCodeFilePath = path.join(sessionDataPath, 'deviceCode.txt');
const userAccountFilePath = path.join(sessionDataPath, 'userAccount.txt');
const userPreferencesFilePath = path.join(sessionDataPath, 'userPreferences.txt');

autoUpdater.logger = logger
Sentry.init({
  dsn: import.meta.env.SENTRY_DSN_GLITCHTIP,
});

const getFile = async (filePath: string, defaultValue: any): Promise<any> => {
  try {
    // Check if the file exists before reading
    if (!existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return defaultValue;
    }

    const data = await readFilePromise(filePath, 'utf-8');
    // If defaultValue is {} or [], try to JSON parse, otherwise don't
    let parsed = (defaultValue instanceof Array || defaultValue instanceof Object) ? JSON.parse(data) : data;
    return parsed;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to read file: ${filePath} with default value: ${defaultValue}. Error: ${error?.message}`), {
      tags: { module: "readFile" },
      extra: { error, filePath, defaultValue }
    });
    return defaultValue;
  }
};

const getPreferences = async (): Promise<Preference[] | null> => {
  try {
    const preferences = await getFile(userPreferencesFilePath, []) as Preference[]
    if (!Array.isArray(preferences)) return [];

    // Remove duplicates based on Preference.name
    const uniquePreferences = Array.from(new Map(preferences.map(preference => [preference.name, preference])).values());
    return uniquePreferences;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to get preferences: ${error?.message}`), {
      tags: { module: "getPreferences" },
      extra: { error }
    });
    return null;
  }
};

const getPreference = async (key: string): Promise<Preference['value'] | null> => {
  try {
    const preferences = await getPreferences();
    console.log({ preferences })
    return preferences?.find(preference => preference.name === key)?.value ?? null
  } catch (error: any) {
    console.log(error);
    return null
  }
};

getPreference('errorLoggingEnabled').then((errorLoggingEnabled: string | boolean | null) => {
  // Disable error logging if the preference is set to false
  if (errorLoggingEnabled !== null && errorLoggingEnabled === false) {
    const client = Sentry.getCurrentHub().getClient();
    const options = client?.getOptions();
    if (options) {
      options.enabled = false;
    }
  }
});

logger.info('App starting...');

import ffmpeg from 'fluent-ffmpeg';
import { existsSync } from 'fs';
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

const refreshWindows = () => {
  try {
    if (mainWindow) mainWindow?.webContents.send('set-window', 'main')
    if (floatingWindow) floatingWindow?.webContents.send('set-window', 'floating')
    if (webcamWindow) webcamWindow?.webContents.send('set-window', 'webcam')
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to refresh: ${error?.message}`), {
      tags: { module: "refreshWindows" },
      extra: { error }
    });
  }
};

ipcMain.handle('get-desktop-capturer-sources', async () => {
  const screenSources = await desktopCapturer.getSources({ types: ['screen'], fetchWindowIcons: true, thumbnailSize: { width: 1920, height: 1080 } })
  const windowSources = await desktopCapturer.getSources({ types: ['window',], fetchWindowIcons: true, thumbnailSize: { width: 1920, height: 1080 } })

  const screenSourcesList = screenSources.map(source => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL() ?? source.appIcon.toDataURL(),
    dimensions: {
      width: source.thumbnail.getSize().width,
      height: source.thumbnail.getSize().height,
    },
  }));

  if (platform === 'darwin') {
    console.log('mac')
    const macWindows = await getWindows() as MacWindow[];
    const macWindowSources = macWindows.map(window => {
      const sourceMatched = windowSources.find(source => source.name === window.name);
      if (!sourceMatched) return;
      const sourceThumbnail = sourceMatched?.thumbnail.toDataURL() ?? '';
      const sourceId = sourceMatched?.id ?? '';
      if (!sourceThumbnail || !sourceId || !window.ownerName || window.ownerName === 'ScreenLink' || window.ownerName === 'Electron') return;

      return {
        id: sourceId,
        thumbnail: sourceThumbnail,
        dimensions: {
          width: window.width,
          height: window.height,
        },
        ...window,
        name: window.name,
        applicationName: window.ownerName,
      };
    }).filter(source => source !== undefined); // Filter out undefined entries

    return [...screenSourcesList, ...macWindowSources];

  } else {
    const excludeTitles = ['ScreenLink.io', 'App Icon Window', 'App Icon Screens', 'Gesture Blocking Overlay', 'Touch Bar']
    return [...screenSourcesList, ...windowSources
      .filter(source => !excludeTitles.includes(source.name))
      .map(source => ({
        id: source.id,
        name: source.name,
        thumbnail: source.thumbnail.toDataURL() ?? source.appIcon.toDataURL(),
        dimensions: {
          width: source.thumbnail.getSize().width,
          height: source.thumbnail.getSize().height,
        },
      }))]
  }
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

ipcMain.handle('start-recording', async (_, applicationName?: string) => {
  try {
    if (mainWindow) mainWindow.minimize();
    if (applicationName && platform === 'darwin') activateWindow(applicationName);
    if (webcamWindow && showCameraWindow) {
      toggleCameraWindow(true);
      webcamWindow.setAlwaysOnTop(true);
    }
    if (floatingWindow) {
      floatingWindow.show();
      floatingWindow.webContents.send('started-recording', true);
    }
  } catch (error: any) {
    console.error(error)
    Sentry.captureException(new Error(`Failed to start recording: ${error?.message}`), {
      tags: { module: "start-recording" },
      extra: { error }
    });
  }
});

ipcMain.handle('stop-recording', async (_) => {
  if (floatingWindow) floatingWindow.hide();
  if (webcamWindow) {
    toggleCameraWindow(false);
    webcamWindow.setAlwaysOnTop(false);
    webcamWindow.minimize();
    webcamWindow.hide();
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
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to get upload link: ${error?.message}`), {
      tags: { module: "getUploadLink" },
      extra: { error }
    });
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

      // Send a message to the renderer process to update the UI
      mainWindow?.webContents.send('set-window', 'loading', 'Processing video...');

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

    } catch (error: any) {
      console.log(error)
      Sentry.captureException(new Error(`Failed to save screen camera blob: ${error?.message}`), {
        tags: { module: "saveScreenCameraBlob" },
        extra: { error }
      });
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
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to save screen blob: ${error?.message}`), {
      tags: { module: "saveScreenBlob" },
      extra: { error }
    });
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
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to get upload link: ${error?.message}`), {
      tags: { module: "getUploadLink" },
    });
    throw new Error(JSON.stringify({ e: "failed to get upload link", error }))
  }
});

// Upload video to server
ipcMain.handle('upload-video', async (_, uploadFile, uploadLink: string) => {
  try {
    // Send a message to the renderer process to update the UI
    mainWindow?.webContents.send('set-window', 'loading', 'Uploading video...');

    await getAccount();

    got.put(uploadLink, {
      body: createReadStream(uploadFile),
    }).then(async () => {
      console.log('Video uploaded successfully!');

      // Delete the upload file after uploading
      await unlinkPromise(uploadFile)

      // When the upload is complete, send a message to the renderer process to update the UI
      mainWindow?.webContents.send('set-window', 'main');

    }).catch((err) => {
      console.log(JSON.stringify({ e: "failed to upload video", err, uploadLink }))
      throw new Error(err);
    });

    return;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to upload video: ${error?.message}`), {
      tags: { module: "uploadVideo" },
      extra: { error }
    });
  }
});

ipcMain.handle('open-in-browser', async (_, url: string) => {
  try {
    return await shell.openExternal(url);
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to open in browser: ${error?.message}`), {
      tags: { module: "openInBrowser" },
      extra: { error }
    });
  }
});

ipcMain.handle('open-new-device', async (_) => {
  try {
    const deviceName = getComputerName();
    const appVersion = app.getVersion();
    const deviceType = os.type();
    const url = `${baseUrl}/app/devices/new?device=${deviceName}&appVersion=${appVersion}&deviceType=${deviceType}`;
    return await shell.openExternal(url);
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to open new device: ${error?.message}`), {
      tags: { module: "openNewDevice" },
      extra: { error }
    });
  }
});

ipcMain.handle('show-camera-window', async (_, show: boolean) => {
  try {
    toggleCameraWindow(show);
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to show camera window: ${error?.message}`), {
      tags: { module: "showCameraWindow" },
      extra: { error }
    });
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
    if (!deviceCode || deviceCode === "{}") return null;

    const url = `${baseUrl}/api/devices/verify`;
    const response = await axios.post(url, { deviceCode });
    if (response.status !== 200) {
      console.log(JSON.stringify({ e: "failed to verify device code", url }))
      throw new Error(response.statusText);
    }
    const data = response.data;
    Sentry.setUser({ userId: data?.id, deviceName: data?.name, projectId: data?.user?.currentProjectId, name: data?.user?.name, email: data?.user?.email })

    if (data.error) {
      console.log(JSON.stringify({ e: "failed to verify device code", url, error: data.error }))
      Sentry.captureException(new Error(data.error));
      throw new Error(data.error);
    }
    return data;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to verify device code: ${error?.message}`), {
      tags: { module: "verifyDeviceCode" },
      extra: { error }
    });
    throw new Error(JSON.stringify({ e: "failed to verify device code", error }))
  }
}

const getDeviceCode = async () => {
  try {
    // Read the device code from the file (deviceCodeFilePath)
    // and send it to the renderer process
    const deviceCodeBuffer = await getFile(deviceCodeFilePath, '');
    const deviceCode = deviceCodeBuffer.toString();

    if (!deviceCode) {
      if (mainWindow) {
        mainWindow.webContents.send('device-code', '');
      }
      return;
    }
    return deviceCode;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to get device code: ${error?.message}`), {
      tags: { module: "getDeviceCode" },
      extra: { error }
    });
    throw new Error(JSON.stringify({ e: "failed to get device code", error }))
  }
}

const getAccount = async (): Promise<Account | null> => {
  try {
    // Check if user has a device code (login status)
    const deviceCode = await getDeviceCode();
    if (deviceCode === '' || !deviceCode) {
      if (mainWindow) {
        mainWindow.webContents.send('device-code', '');
      }
      return null;
    }

    // Auth cache stored for 5 minutes
    const userAccount = await getFile(userAccountFilePath, {});

    // Check if the user account was updated less than 5 minutes ago
    const currentTime = new Date().getTime();
    const lastUpdatedTime = new Date(userAccount.lastUpdated).getTime();
    const timeDifferenceInMinutes = (currentTime - lastUpdatedTime) / (1000 * 60);
    if (timeDifferenceInMinutes < 5) {
      return userAccount;
    }

    // Verify the device code
    const device: Account = await verifyDeviceCode(deviceCode);
    if (!device) {
      if (mainWindow) {
        mainWindow.webContents.send('device-code', '');
        Sentry.captureException(new Error(`Failed to get account: device not found`), {
          tags: { module: "getAccount", deviceCode },
        });
      }
      return null;
    }

    // Write the response to userAccountFilePath
    await writeFilePromise(userAccountFilePath, JSON.stringify({ ...device, lastUpdated: new Date() }));

    return device;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to get account: ${error?.message}`), {
      tags: { module: "getAccount" },
      extra: { error }
    });
    return null;
  }
}

ipcMain.handle('get-account', async (_) => {
  try {
    const account = await getAccount();
    return account;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to get account: ${error?.message}`), {
      tags: { module: "getAccount" },
      extra: { error }
    });
    return null;
  }
});

const updatePreferences = async (newPreferences: Preference[]): Promise<boolean> => {
  try {
    // Write upserted preferences back to file
    await writeFilePromise(userPreferencesFilePath, JSON.stringify(newPreferences));
    return true;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to upsert preferences: ${error?.message}`), {
      tags: { module: "upsertPreferences" },
      extra: { error }
    });
    return false;
  }
};

ipcMain.handle('get-preferences', async (_) => {
  try {
    const preferences = await getPreferences();
    return preferences;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to get preferences: ${error?.message}`), {
      tags: { module: "getPreferences" },
      extra: { error }
    });
    return null;
  }
});

ipcMain.handle('update-preferences', async (_event, newPreferences: Preference[]) => {
  try {
    await updatePreferences(newPreferences);
    return true;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to set preferences: ${error?.message}`), {
      tags: { module: "setPreferences" },
      extra: { error }
    });
    return false;
  }
});

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
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to get device code: ${error?.message}`), {
      tags: { module: "getDeviceCode" },
      extra: { error }
    });
    return null;
  }
});

ipcMain.handle('logout', async (_) => {
  try {
    // Clear the user account, device code and preferences
    await writeFilePromise(userAccountFilePath, JSON.stringify({}));
    await writeFilePromise(deviceCodeFilePath, '');
    await writeFilePromise(userPreferencesFilePath, JSON.stringify([]));

    // Send a logout event to the renderer process
    if (mainWindow) mainWindow.webContents.send('device-code', '');
    if (floatingWindow) floatingWindow.hide();
    if (webcamWindow) webcamWindow.hide();
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to logout: ${error?.message}`), {
      tags: { module: "logout" },
      extra: { error }
    });
  }
});

ipcMain.handle('permissions-missing', async (_) => {
  try {
    const permissionsMissing = await missingPermissions();

    if (mainWindow) {
      const permissions = permissionsMissing.join(', ');
      mainWindow.webContents.send('set-window', 'permissions', permissions);
    }
  } catch (error: any) {
    Sentry.captureException(new Error(`Failed to get device code: ${error?.message}`), {
      tags: { module: "getDeviceCode" },
      extra: { error }
    });
    console.log(error)
  }
});

ipcMain.handle('request-permission', async (_, permission: string) => {
  try {
    const wasApproved = await requestPermissions(permission);
    console.log({ wasApproved })
    const missing = await missingPermissions();
    if (wasApproved && mainWindow && missing.length > 0) mainWindow.webContents.send('set-window', 'permissions', missing.join(', '));

    return wasApproved;
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to request permissions: ${error?.message}`), {
      tags: { module: "requestPermissionsIPC" },
      extra: { error }
    });
    return false;
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
  if (cameraStatus != 'granted') missingList.push('Camera');
  if (microphoneStatus != 'granted') missingList.push('Microphone');
  if (screenStatus != 'granted') missingList.push('Screen');

  return missingList;
}

const requestPermissions = async (permission: string): Promise<boolean> => {
  try {
    if (webcamWindow) webcamWindow.hide();

    console.log('Requesting permissions: ', permission)

    if (permission.toLowerCase() === 'camera' || permission.toLowerCase() === 'microphone') {
      console.log(`Requesting ${permission} permission`)
      const status = await systemPreferences.askForMediaAccess(permission.toLowerCase() as 'camera' | 'microphone');
      if (!status && process.platform === 'darwin') {
        shell.openExternal(`x-apple.systempreferences:com.apple.preference.security?Privacy_${permission}`);
      }
      return status;
    } else if (permission.toLowerCase() === 'screen') {
      if (process.platform === 'darwin') {
        const screenAccessStatus = systemPreferences.getMediaAccessStatus('screen');
        console.log(`Requesting ${permission} permission: ${screenAccessStatus}`)
        if (screenAccessStatus !== 'granted') {
          shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture');
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
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to request permissions: ${error?.message}`), {
      tags: { module: "requestPermissions" },
      extra: { error }
    });
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
    webcamWindow.loadURL(`${VITE_DEV_SERVER_URL}`).then(() => {
      // Once the file is loaded, send a message to the renderer with the parameter
      if (!webcamWindow) return console.log('No webcam window to send set-window to');
      webcamWindow?.webContents.send('set-window', 'webcam');
    });

  } else {
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
        const permissions = permissionsMissing.join(', ');
        mainWindow?.webContents.send('set-window', 'permissions', permissions);
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
          const permissions = permissionsMissing.join(', ');
          mainWindow?.webContents.send('set-window', 'permissions', permissions);
        } else {
          // Once the file is loaded, send a message to the renderer with the parameter
          if (!mainWindow) return console.log('No main window to send set-window to');
          mainWindow?.webContents.send('set-window', 'main');
        }
      })
      .catch((e) => {
        Sentry.captureException(new Error(`Failed to load index.html: ${e?.message}`), {
          tags: { module: "createWindow" },
          extra: { e }
        });
        console.error('Failed to load index.html', e)
      });
  }

  // Auto Updater
  autoUpdater.on('update-available', () => {
    mainWindow?.webContents.send('set-window', 'update', 'Update available.');
  })
  autoUpdater.on('error', (err) => {
    mainWindow?.webContents.send('set-window', 'update', 'Error in auto-updater. You may need to reinstall ScreenLink. \n Contact support if this continues. \n' + err);
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let downloadSpeedInMBps = (progressObj.bytesPerSecond / (1024 * 1024)).toFixed(2);
    let transferredInMB = (progressObj.transferred / (1024 * 1024)).toFixed(2);
    let totalInMB = (progressObj.total / (1024 * 1024)).toFixed(2);
    let log_message = "Download speed: " + downloadSpeedInMBps + " MB/s";
    log_message = log_message + ' - Downloaded ' + Math.round(progressObj.percent) + '%';
    log_message = log_message + ' (' + transferredInMB + "MB/" + totalInMB + 'MB)';
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

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  // Read the device code from the file (deviceCodeFilePath)
  // and send it to the renderer process
  getFile(deviceCodeFilePath, '').then((deviceCodeBuffer) => {
    const deviceCode = deviceCodeBuffer.toString();
    console.log('Device code on ready: ', deviceCode);
    if (mainWindow) {
      mainWindow.webContents.send('device-code', deviceCode);
      refreshWindows();
    } else {
      console.log('No window to send device code to');
    }
  });

  getAccount();

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
  try {
    // Prevent the default behavior
    event.preventDefault();

    // Parse the URL
    const parsedUrl = new URL(url);
    const deviceCode = parsedUrl.host.split('=')[1];
    // Log the device code
    console.log(`Device code: ${deviceCode}`);
    Sentry.captureMessage(`Device code added: ${deviceCode}, parsedUrl: ${JSON.stringify(parsedUrl)}`);

    // Write the device code to a file in the sessionData directory
    writeFilePromise(deviceCodeFilePath, deviceCode).then(() => {
      console.log('Device code saved successfully!');
    });

    // Send the device code to the renderer process
    if (mainWindow) {
      mainWindow.webContents.send('device-code', deviceCode);
    }
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(new Error(`Failed to open url: ${error?.message}`), {
      tags: { module: "openUrl" },
      extra: { error }
    });
  }
});

app.whenReady().then(createWindow)
