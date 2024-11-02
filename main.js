const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let notesFile = path.join(app.getPath("userData"), "notes.json");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("load-notes", async () => {
  try {
    const data = fs.readFileSync(notesFile);
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
});

ipcMain.handle("save-notes", async (_, notes) => {
  try {
    fs.writeFileSync(notesFile, JSON.stringify(notes));
    return notes;
  } catch (error) {
    console.error("Error saving notes:", error);
    return [];
  }
});
