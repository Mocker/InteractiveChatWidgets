"use strict";
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, remote = _a.remote;
var path = require('path');
function createWindow() {
    console.log("Opening browser window");
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    console.log(path.resolve(process.cwd(), '..'), "working dir");
    win.loadFile('./src/views/welcome.html');
    win.webContents.openDevTools();
}
app.whenReady().then(createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
