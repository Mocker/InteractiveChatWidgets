const { app, BrowserWindow, remote} = require('electron');
const path = require('path');

function createWindow () {
  console.log("Opening browser window");
   const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  console.log(path.resolve(process.cwd(), '..'),"working dir");
  win.loadFile('./src/views/welcome.html')
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})