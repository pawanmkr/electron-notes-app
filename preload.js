const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveNotes: (notes) => ipcRenderer.invoke("save-notes", notes),
  loadNotes: () => ipcRenderer.invoke("load-notes"),
});
