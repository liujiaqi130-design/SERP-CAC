const path = require("node:path")
const { app, BrowserWindow, ipcMain, screen } = require("electron")

let widgetWindow
const sizes = {
  collapsed: { width: 186, height: 48 },
  open: { width: 414, height: 590 },
}

function placeAtBottomLeft(size) {
  const { workArea } = screen.getPrimaryDisplay()
  return {
    x: workArea.x + 20,
    y: workArea.y + workArea.height - size.height - 20,
    ...size,
  }
}

function resizeWidget(mode) {
  if (!widgetWindow || !sizes[mode]) return
  const current = widgetWindow.getBounds()
  const workArea = screen.getDisplayMatching(current).workArea
  const size = sizes[mode]
  const maxX = workArea.x + workArea.width - size.width
  const maxY = workArea.y + workArea.height - size.height
  const x = Math.max(workArea.x, Math.min(current.x, maxX))
  const bottom = current.y + current.height
  const y = Math.max(workArea.y, Math.min(bottom - size.height, maxY))
  widgetWindow.setBounds({ x, y, ...size })
}

function keepWidgetOnScreen() {
  if (!widgetWindow) return
  const bounds = widgetWindow.getBounds()
  const { workArea } = screen.getDisplayMatching(bounds)
  const maxX = workArea.x + workArea.width - bounds.width
  const maxY = workArea.y + workArea.height - bounds.height
  const x = Math.max(workArea.x, Math.min(bounds.x, maxX))
  const y = Math.max(workArea.y, Math.min(bounds.y, maxY))
  if (x !== bounds.x || y !== bounds.y) widgetWindow.setPosition(x, y)
}

function createWidget() {
  const initialBounds = placeAtBottomLeft(sizes.collapsed)
  widgetWindow = new BrowserWindow({
    ...initialBounds,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })

  widgetWindow.on("move", keepWidgetOnScreen)
  widgetWindow.setAlwaysOnTop(true, "screen-saver")
  widgetWindow.loadFile(path.join(__dirname, "index.html"))
}

ipcMain.on("widget:set-size", (event, mode) => {
  if (!widgetWindow || event.sender !== widgetWindow.webContents) return
  if (mode !== "open" && mode !== "collapsed") return
  resizeWidget(mode)
})

ipcMain.on("widget:quit", (event) => {
  if (widgetWindow && event.sender === widgetWindow.webContents) app.quit()
})

app.whenReady().then(createWidget)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
