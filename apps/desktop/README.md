<div align="center">
<h1 align="center">
<img src="./src/assets/screenlink.svg" width="100" />
<br>ScreenLink Desktop</h1>


<p align="center">
<img src="https://img.shields.io/badge/electronbuilder-FFFFFF.svg?style=flat-square&logo=electron-builder&logoColor=black" alt="electronbuilder" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat-square&logo=HTML5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat-square&logo=PostCSS&logoColor=white" alt="PostCSS" />
<img src="https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat-square&logo=Autoprefixer&logoColor=white" alt="Autoprefixer" />
<img src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat-square&logo=YAML&logoColor=white" alt="YAML" />
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat-square&logo=Vite&logoColor=white" alt="Vite" />

<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=React&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat-square&logo=Axios&logoColor=white" alt="Axios" />
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat-square&logo=ESLint&logoColor=white" alt="ESLint" />
<img src="https://img.shields.io/badge/Electron-47848F.svg?style=flat-square&logo=Electron&logoColor=white" alt="Electron" />
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat-square&logo=JSON&logoColor=white" alt="JSON" />
</p>
<img src="https://img.shields.io/github/license/mangledbottles/screenlink-desktop?style=flat-square&color=5D6D7E" alt="GitHub license" />
<img src="https://img.shields.io/github/last-commit/mangledbottles/screenlink-desktop?style=flat-square&color=5D6D7E" alt="git-last-commit" />
<img src="https://img.shields.io/github/commit-activity/m/mangledbottles/screenlink-desktop?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/languages/top/mangledbottles/screenlink-desktop?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

---

## 📖 Table of Contents

- [📖 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [📦 Features](#-features)
- [⚙️ Modules](#️-modules)
- [🚀 Getting Started](#-getting-started)
  - [🔧 Installation](#-installation)
  - [🤖 Running screenlink-desktop](#-running-screenlink-desktop)
- [🤝 Contributing](#-contributing)
    - [*Contributing Guidelines*](#contributing-guidelines)

---


## 📍 Overview

ScreenLink is the Open Source Loom Alternative. Get started at [ScreenLink.io](https://screenlink.io/) or checkout this Github repo!

Screenlink Desktop is an Electron-based desktop application that offers user-friendly screen and webcam recording capabilities. The application provides device code retrieval, updates management, permissions handling, screen recording, webcam handling, and selection of audio and camera sources. Users can additionally manage audio and camera settings conveniently within the app. Written in TypeScript and employing React JS for the frontend, it features efficient linting with ESLint, and uses PostCSS and Tailwind CSS for polished presentation and interactivity, making it a feature-packed solution for screen recording needs.

---

## 📦 Features

|    | Feature                     | Description                                                                                                        |
|----|-----------------------------|--------------------------------------------------------------------------------------------------------------------|
| 🖥️ | **Screen Capture**          | The application provides robust screen capturing capabilities, allowing users to select and record their screen activities seamlessly. |
| 🎙️ | **Audio Recording**         | Accompanying the screen capture, the app can record audio from various sources, ensuring a comprehensive recording experience. |
| 🎥 | **Webcam Recording**        | Users can record webcam footage in sync with the screen and audio, perfect for presentations or tutorials. |
| 🛠️ | **Post-Processing**         | Leveraging FFMPEG, the app offers post-processing features to enhance the final video output, such as format conversion and compression. |
| 📹 | **High-Quality Recording**  | The application ensures high-quality video recording, providing clear and crisp visuals for professional-grade screencasts. |
| ☁️ | **Instant Upload**          | Recorded videos can be instantly uploaded to the ScreenLink server, facilitating easy sharing and management of video content. |

---

## ⚙️ Modules

<details closed><summary>Root</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                                             | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [.cursorignore](https://github.com/mangledbottles/screenlink-desktop/blob/main/.cursorignore)                   | The given codebase represents the structure of a desktop application called screenlink-desktop. This application, developed with Electron and React, includes functionalities for sign-in, recording, audio and camera sources, permissions, loading and updates. It uses TypeScript, PostCSS, and Tailwind CSS for development. The.cursorignore file specifies SVG files to be ignored, presumably during linting or version control processes.                                                                                                                                     |
| [tsconfig.node.json](https://github.com/mangledbottles/screenlink-desktop/blob/main/tsconfig.node.json)         | The directory tree represents a project structure for a desktop application named Screenlink, built using Electron and Tsx (a TypeScript version for React JS). It includes development configuration files (e.g., tsconfig.node.json, eslint), source files with React components (App.tsx, various components under src/components/), utility scripts (utils.ts), and styling (App.css, tailwind.config.js). The tsconfig.node.json file sets specific TypeScript compiler options for bundling and transforming ESNext modules and includes the vite.config.ts configuration file. |
| [index.html](https://github.com/mangledbottles/screenlink-desktop/blob/main/index.html)                         | The code entails a directory structure for the ScreenLink desktop application developed using Electron and TypeScript. It consists of configuration, utility files, index.HTML to load main.TSX as the primary module, package.JSON for dependencies, and src folder with TypeScript components, including various functionalities like AudioSources, CameraSources, and Recorder. Electron-specific codes are present in electron folder. Configuration files for ESLint, PostCSS, Vite, and TailwindCSS are included.                                                               |
| [tailwind.config.js](https://github.com/mangledbottles/screenlink-desktop/blob/main/tailwind.config.js)         | The code presents a directory structure for the screenlink-desktop project, which includes various customization, setup, and source files for TypeScript, JavaScript, Electron, PostCSS, and Tailwind CSS. The configuration file for Tailwind CSS (tailwind.config.js) determines which.js,.jsx,.ts, and.tsx files in the src directory Tailwind should scan for class names to build out its utility classes, extending their themes and managing plugins without impacting the global theme.                                                                                       |
| [types.d.ts](https://github.com/mangledbottles/screenlink-desktop/blob/main/types.d.ts)                         | The code provides type definitions for global variables in a Screenlink desktop application. It imports and refines a set of operations related to Electron desktop capturer, file saving and handling, screen recording management, browser interaction, camera source setting, permission handling, and video uploading. It also extends the Window interface under TypeScript for using these operations globally across the application.                                                                                                                                          |
| [.eslintrc.cjs](https://github.com/mangledbottles/screenlink-desktop/blob/main/.eslintrc.cjs)                   | The given project appears to be an Electron-based desktop application using React and TypeScript. It uses ESLint for linting the code, ensuring consistency and error checking. The ESLint configuration file.eslintrc.cjs sets the environment for browser and es2020, extends several recommended configurations, specifies directories to ignore, and sets a custom rule for React refresher. The application contains components for managing audio, camera sources, sign-in, updates, and webcam among other features.                                                           |
| [yarn.lock](https://github.com/mangledbottles/screenlink-desktop/blob/main/yarn.lock)                           | The code comprises the directory structure for a desktop application built on Electron and Vite. It features configurations for TypeScript, ESLint, PostCSS and Electron Builder. The src directory contains React components, CSS and utility files for the application's logic and user interface. The Electron directory includes the file for electron environment setup. Additionally, there's a yarn.lock file, an auto-generated file that ensures consistent installation of dependency packages across environments.                                                         |
| [package.json](https://github.com/mangledbottles/screenlink-desktop/blob/main/package.json)                     | The code represents a configuration for a desktop application named screenlink-desktop. The application is built with Electron, React, and TypeScript. The package.json shows scripts for development, build, linting, and preview, along with various dependencies such as axios, electron-log, and electron-updater. The directory tree represents the application structure, including the electron, public, and src directories, the latter of which holds the various components and utilities of the React app.                                                                 |
| [dev-app-update.yml](https://github.com/mangledbottles/screenlink-desktop/blob/main/dev-app-update.yml)         | The codebase comprises an Electron app, Screenlink-Desktop, coded in TypeScript with a React frontend. It contains configurations for development tools like ESLint, PostCSS, and TailwindCSS. Components such as audio, camera, and recorder indicate multimedia functionalities. A Github provider is set for updates. File types suggest utilization of Vite as a build tool and Yarn package manager. Overall, this project appears to be a desktop application with version updates and interactive multimedia features.                                                         |
| [tsconfig.json](https://github.com/mangledbottles/screenlink-desktop/blob/main/tsconfig.json)                   | The provided code is the configuration for a TypeScript-enabled project contained within a screenlink-desktop directory. Its key functionalities mainly revolve around setting up TypeScript compiler options like ES2020 as the target library with linting functions and establishing bundler-based module resolution. It also includes options to accommodate react-JSX files. Moreover, it delineates included sources for compilation and references to other configuration files, affirming its collaboration with other project setup mechanisms.                              |
| [electron-builder.json5](https://github.com/mangledbottles/screenlink-desktop/blob/main/electron-builder.json5) | The provided code is configuration for an Electron app named ScreenLink, which serves as a setup for building the app across Mac, Windows, and Linux platforms. It configures file directories, icons, and artefact names and targets. For the Mac version, it incorporates enhanced security privileges requiring access to camera and microphone. The Windows setup uses nsis for x64 architecture, while the Linux setup uses AppImage. Various user interface details are also defined.                                                                                           |
| [vite.config.ts](https://github.com/mangledbottles/screenlink-desktop/blob/main/vite.config.ts)                 | The code is a Vite configuration for a screenlink-desktop, an Electron-based desktop application developed using React. The configuration defines build steps for three parts: main, preload, and renderer. It manages React, Electron main process, and Electron preload process with their respective plugins. It also sets up an alias for the fluent-ffmpeg library, replacing defunct coverage version with the actual library during the build process for Electron's main thread.                                                                                              |
| [postcss.config.js](https://github.com/mangledbottles/screenlink-desktop/blob/main/postcss.config.js)           | The directory structure represents a TypeScript-based Electron application. It includes configuration files for Tailwind CSS, PostCSS, ESLint, Vite, and Electron Builder. The src directory contains the main application files with various components like AudioSources, SignIn, Recorder etc. The electron directory comprises files that handle Electron-specific functionality. The postcss.config.js file configures Tailwind CSS and Autoprefixer plugins, which manage CSS utility generation and vendor prefix addition respectively.                                       |

</details>

<details closed><summary>Build</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---                                                                                                                   | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [entitlements.mac.plist](https://github.com/mangledbottles/screenlink-desktop/blob/main/build/entitlements.mac.plist) | The code represents a directory structure for a desktop application-based project using Electron, TypeScript, and Vite. It includes Electron's main and preload scripts, source code with multiple UI components, style files, configuration files, and a package.json for managing dependencies. The specific code snippet is a MacOS entitlements file, granting the app permission to access system-level functionalities like execution of JIT-compiled code, unsigned memory execution, dyld variables, microphone, audio-input, and camera. |

</details>

<details closed><summary>Electron</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                            | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [main.ts](https://github.com/mangledbottles/screenlink-desktop/blob/main/electron/main.ts)                     | The code is for a desktop application that provides screen and webcam recording capabilities. It handles permissions for accessing screen, camera, and microphone. It fetches desktop sources for recording, starts/stops recording, processes and stores video files, and handles video uploads. It also triggers automatic updates. It interacts with the renderer process by sending various application status updates. It creates multiple Windows for different application views. The code also provides tray interaction and device verification functionality. |
| [electron-env.d.ts](https://github.com/mangledbottles/screenlink-desktop/blob/main/electron/electron-env.d.ts) | The provided code is a part of a TypeScript-based Electron desktop application, named Screenlink-Desktop. Its main features include recording, permission handling, and source selection for audio, camera, and webcam. It uses packages like Electron, Node.js, Vite and PostCSS, with TypeScript for static typing. The code snippet shown declares an extended global namespace for Node.js' process environment variables (i.e., built directory structure) to manage different outputs, and extends the Window interface for IPC rendering in Electron.            |
| [preload.ts](https://github.com/mangledbottles/screenlink-desktop/blob/main/electron/preload.ts)               | The provided code is for a desktop application using the Electron framework and TypeScript. It exposes a secure bridge between the application's renderer and main processes, exposing selected Electron APIs in the renderer process. The code provides functions for application utilities such as recording, saving, and uploading video. The file also includes functions to manipulate the Document Object Model (DOM) and display loading animation effects on the application's front-end.                                                                       |

</details>

<details closed><summary>Src</summary>

| File                                                                                              | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---                                                                                               | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [App.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/App.tsx)             | The code provided is a React functional component serving as the main application for a desktop screen recording software called ScreenLink. It incorporates various React hooks for state management and interaction with the Electron main process through IPC. The primary features include device code retrieval, updates management, permissions handling, screen recording, webcam handling, and selection of audio and camera sources. Additionally, it renders different components based on some conditions such as device code existence or window type.          |
| [main.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/main.tsx)           | The code depicts a directory structure for a Screenlink Desktop application, developed with Electron and Node.js. It incorporates components like audio, webcam, recorder, and more. The main TypeScript excerpt (main.tsx) initializes the React application, rendering the App component within a StrictMode wrapper. It facilitates preload script removal and implements a contextBridge to handle IPC (inter-process communication) with the main process, logging received messages.                                                                                  |
| [utils.ts](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/utils.ts)           | The code is part of a larger system for a desktop app named Screenlink, built with Electron and TypeScript. Key features include screen/window recording, permissions management, updating, and sign-in. This particular script, utils.ts, defines essential data types and constants for the app, highlighting an interface for recording sources, UploadLink, and constants determining the app's working environment (production or development) and setting the corresponding base URL.                                                                                 |
| [App.css](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/App.css)             | The provided code is part of a directory structure for a desktop application, utilizing Electron and React (tsx files). It includes several TypeScript (ts, tsx) files defining the application's main workflow, components, and utilities. The App.css file contains styles for UI elements like logo, buttons, and cards. It uses Tailwind CSS for styling and features including animation, drag functionality, and hover effects. Additionally, it includes configuration files like package.json, vite.config.ts, and dev-app-update.yml for app settings and updates. |
| [index.css](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/index.css)         | The code presented is a Cascading Style Sheet (CSS) within a comprehensive directory structure for a desktop application called Screenlink. This CSS file determines the aesthetic presentation of the application, setting styles for elements such as the body, headings, links, and buttons. There are color schemes for both light and dark modes. The code also imports utilities and components from the Tailwind CSS framework, demonstrating strong emphasis on customizability and responsiveness.                                                                 |
| [vite-env.d.ts](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/vite-env.d.ts) | The provided directory tree outlines the structure for a screenlink-desktop application. This Electron app is constructed using TypeScript and React (tsx files). Its key functionalities include handling sound and camera sources, recording, user authentication (SignIn), and updates. Configuration files indicate utilization of ESlint for linting, PostCSS and Tailwind for styling, and Vite for bundling. vite-env.d.ts file references Vite module types, establishing type checking and autocompletion features for Vite's client-side API.                     |
| [global.d.ts](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/global.d.ts)     | The provided codebase is for a desktop application called Screenlink, built using Electron and TypeScript, with a frontend constructed in React (tsx files). The app includes components for handling audio, camera sources, recording, sign in, updates, and permissions. The declared interface in the code snippet extends the Window object to include an electron property for fetching desktop capture sources, facilitating screen recording features.                                                                                                               |

</details>

<details closed><summary>Components</summary>

| File                                                                                                                 | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---                                                                                                                  | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [Sources.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/Sources.tsx)             | The provided source code is of a React component that fetches desktop screen sources and displays them in a grid format. The getScreenSources function asynchronously retrieves data sources from Electron's desktop capturer and handles potential errors. The ScreenSources function uses these sources to display quick links for selected sources. It also provides a skeleton loading screen. The QuickLink function defines the structure and functionality of each quick link, including a hover effect and onClick event handler. |
| [Webcam.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/Webcam.tsx)               | The code is a React component named Webcam that manages a web camera source. It responds to the event new-camera-source, updating the current camera source if different from the previous one. Upon updating, it stops the current camera (if active) and starts the new one, applying specific configuration properties. Errors during camera access are caught and logged. If no camera source is available, it returns null; otherwise, it outputs a video HTML element with autoplay enabled.                                        |
| [Recorder.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/Recorder.tsx)           | The provided code is a component in a video recording app built with Electron and React. It includes functionalities to handle recording from both screen and camera, and optionally an audio source. The video recording can be started, stopped and uploaded to an external server. It interacts with the system hardware to control the streams from selected sources, and processes the captured content before upload. Recording instances and source selection are managed through React states and effects.                        |
| [Update.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/Update.tsx)               | The code is a component in a TypeScript React application ScreenLink, for displaying update messages. When rendered, it generates a full-page div with an image and a heading, under which the update message will be shown. The image source and the update message are provided via props. The design of each component is based on CSS classes, probably utilizing Tailwind CSS for styling.                                                                                                                                           |
| [CameraSources.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/CameraSources.tsx) | The provided code defines a React component for selecting camera input in an electron application. It retrieves a list of video input devices, allows the user to select their preferred input, and manages related permissions. If permission is denied, it prompts the user to grant camera access. The camera selection is displayed in a drop-down menu with options dynamically populated from video devices detected by the application.                                                                                            |
| [Permissions.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/Permissions.tsx)     | The code is for a React component (Permissions.tsx) of a desktop application built with Electron. The component displays a card with ScreenLink logo, a message prompting the user to enable camera, microphone, and screen recording permissions, and a brief description of ScreenLink. Clicking the logo opens a web URL. The app appears to support screen and camera recording, suggesting it's a video capture tool.                                                                                                                |
| [AudioSources.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/AudioSources.tsx)   | The given code provides a dropdown menu interface for audio input device selection in a web application. It uses Media Devices API to retrieve a list of all audio input devices available when the component mounts. The list is presented to the user in a dropdown menu, enabling selection of a preferred audio device. Additionally, it offers the option for users to select No Audio, setting the audio input device to null. Alert notification is activated if camera access is denied.                                          |
| [Floating.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/Floating.tsx)           | The given code is a part of a React application that functions as a video recording screen. The Floating.tsx component contains functionalities for starting and stopping desktop recording. It provides the user interface for a recording timer and buttons with icons to control the recording status, one of which is a pause/stop button. The timing function increments by one second when recording is active. All rendering and styling is achieved using React and Tailwind CSS respectively.                                    |
| [Loading.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/Loading.tsx)             | The given code is a loading component in a desktop application built with Electron and React. It displays a spinning icon, a logo which links to the app's website, and accepts an optional custom loading message. If no custom message is provided, it defaults to saying Loading.... The component uses Tailwind CSS for styling and handles user interactions. This is part of a larger set of components designed to manage app functionality like audio sources, updates, sign in, and recording.                                   |
| [Button.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/Button.tsx)               | The provided code defines a customizable button component for a React application, using TypeScript. The component offers two visual styles (primary and secondary), each styled according to Tailwind CSS utility classes. By extending the HTMLButtonElement attributes, it allows additional customization through props. If no variant is specified, the button defaults to the primary style. The className prop allows for further CSS customization.                                                                               |
| [SignIn.tsx](https://github.com/mangledbottles/screenlink-desktop/blob/main/src/components/SignIn.tsx)               | The provided code forms a part of the ScreenLink Desktop application, specifically the SignIn component of the UI. The component renders a sign-in form where the user can initiate the login process via an Sign in on web button. It also provides an option to create a new account. The architecture of this application appears to have been created with Electron, Vite, and TypeScript, with TailwindCSS for styling, and uses components, reusable code pieces for constructing the UI.                                           |

</details>

---

## 🚀 Getting Started

### 🔧 Installation

1. Clone the screenlink-desktop repository:
```sh
git clone https://github.com/mangledbottles/screenlink
```

2. Change to the project directory:
```sh
cd screenlink/apps/desktop
```

3. Install the dependencies:
```sh
yarn
```

### 🤖 Running screenlink-desktop

Development
```sh
yarn dev
```

Production Build
```sh
yarn build
```

---

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/mangledbottles/screenlink-desktop/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/mangledbottles/screenlink-desktop/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github.com/mangledbottles/screenlink-desktop/issues)**: Submit bugs found or log feature requests for MANGLEDBOTTLES.

#### *Contributing Guidelines*

<details closed>
<summary>Click to expand</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone <your-forked-repo-url>
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear and concise message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---