"use strict";

import { app, protocol, BrowserWindow, ipcMain, shell, dialog } from "electron";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
const os = require("os");
const fs = require("fs");
const path = require("path");
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let workerWindow;
// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], { secure: true });
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });
  win.maximize();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
    workerWindow.removeAllListeners("close");
    app.quit();
    // workerWindow.close()
  });
  workerWindow = new BrowserWindow({ width: 800, height: 600 });
  // workerWindow.loadURL("file://" + __dirname+ "/../src" + "/worker.html");
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    workerWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    workerWindow.loadURL("app://./index.html");
  }
  workerWindow.hide();
  // workerWindow.webContents.openDevTools();
  workerWindow.on("close", (event) => {
    event.preventDefault();
    workerWindow.hide();
  });

  // workerWindow.on("focus",(event)=>{
  //   console.log("work")
  //   workerWindow.webContents.send("toPrint");
  // })
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("toPrint", (event) => {
  workerWindow.webContents.send("toPrint");
});
ipcMain.on("Refresh", (event) => {
  // workerWindow.reload()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    workerWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    workerWindow.loadURL("app://./index.html");
  }
});

ipcMain.on("printPDF", (event, content) => {
  // console.log(content);
  workerWindow.show();
  workerWindow.focus();
  workerWindow.webContents.send("printPDF", content);
});

ipcMain.on("showPDF", (event, content) => {
  // console.log(content);
  workerWindow.show();
  workerWindow.focus();
  workerWindow.webContents.send("showPDF", content);
});

ipcMain.on("savePDF", (event, content) => {
  workerWindow.show();
  workerWindow.webContents.send("savePDF", content);
});

ipcMain.on("readyToSave", (event) => {
  const savePath = dialog.showSaveDialog({
    filters: [
      {
        name: "Adobe PDF",
        extensions: ["pdf"],
      },
    ],
  });
  if (savePath != null)
    workerWindow.webContents.printToPDF({ pageSize: "A4" }, (error, data) => {
      if (error) throw error;
      fs.writeFile(savePath, data, (error) => {
        if (error) throw error;
        console.log("Write PDF successfully.");
      });
    });
  workerWindow.hide();
});
ipcMain.on("printStatement", (event, content) => {
  // console.log(content);

  workerWindow.show();
  workerWindow.focus();
  workerWindow.webContents.send("printStatement", content);
});

ipcMain.on("saveStatement", (event, content) => {
  workerWindow.show();
  workerWindow.webContents.send("saveStatement", content);
});

ipcMain.on("PrintSum", (event, content) => {
  workerWindow.show();
  workerWindow.focus();
  workerWindow.webContents.send("PrintSum", content);
});
ipcMain.on("ViewSum", (event, content) => {
  workerWindow.show();
  workerWindow.focus();
  workerWindow.webContents.send("ViewSum", content);
});

ipcMain.on("SaveSum", (event, content) => {
  workerWindow.show();
  workerWindow.webContents.send("SaveSum", content);
});

ipcMain.on("PrintInvoicesGroup", (event, content) => {
  workerWindow.show();
  workerWindow.focus();
  workerWindow.webContents.send("PrintInvoicesGroup", content);
});

ipcMain.on("ViewInvoicesGroup", (event, content) => {
  workerWindow.show();
  workerWindow.focus();
  workerWindow.webContents.send("ViewInvoicesGroup", content);
});

ipcMain.on("SaveInvoicesGroup", (event, content) => {
  workerWindow.show();
  workerWindow.webContents.send("SaveInvoicesGroup", content);
});

// when worker window is ready
ipcMain.on("readyToPrintPDF", (event) => {
  // workerWindow.webContents.printToPDF({}, (error, data) => {
  //   if (error) throw error
  //   fs.writeFile('./tmp/print.pdf', data, (error) => {
  //     if (error) throw error
  //     console.log('Write PDF successfully.')
  //   })
  // })
  workerWindow.webContents.print(
    { silent: false, printBackground: false, deviceName: "" },
    (success) => {
      // console.log(success)
    }
  );
});
