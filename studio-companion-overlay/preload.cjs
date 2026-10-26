const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("studioCompanion", {
  setSize: (mode) => {
    if (mode === "open" || mode === "collapsed") {
      ipcRenderer.send("widget:set-size", mode)
    }
  },
  quit: () => ipcRenderer.send("widget:quit"),
})
