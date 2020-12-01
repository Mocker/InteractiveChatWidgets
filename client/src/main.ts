const { app, BrowserWindow, remote, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

//hot reload setup for development
const env = process.env.NODE_ENV || 'development'; 

if (env === 'development') { 
  try { 
      require('electron-reloader')(module, { 
          debug: true, 
          watchRenderer: true
      }); 
  } catch (_) { console.log('Error'); }     
} 


//create temporary websocket server based off chalktalk server.js
//TODO:: instead of websockets this should use electron communication
/*
const ttDgram = require('dgram');
const ttServer = ttDgram.createSocket('udp4');
ttServer.on('listening', function () { });
ttServer.on('message', function (message: any, remote:any) { 
  ttData.push(message); 
});
ttServer.bind(9090, '127.0.0.1');
let ttData = [];
//TODO:: remove express requirement after moving communication to electron IPC
const express = require("express");
const expressApp: any = express();
const port = 11235;
*/
const httpserver = require('./lib/chalktalk/server/main.js');
//import httpserver from './lib/chalktalk/server/main.js';

//replacement for chalktalk server functions
//TODO:: these should be handled elsewhere
async function readDir(dirName: any, extension: any) {
  const fullPath = path.resolve(process.cwd(), 'src/lib/chalktalk/'+dirName);
  console.log("Read directory "+fullPath);
  return fs.promises.readdir(fullPath)
    .then( (files: any) => {
     let res = '';
     for (var i = 0; i < files.length; i++) {
        if (!extension || files[i].toLowerCase().endsWith(extension.toLowerCase())) {
           res += (files[i] + "\n");
        }
     }
     return res;
  }).catch( (err: any) => {
    console.log("ERROR READING DIRECTORY: ",fullPath);
    throw err;
  });
}



function init () {
  const win: any = createWindow();

  ipcMain.handle('sketches', async (event: any, filename: any) => {
    return await fs.readFileSync(path.resolve(process.cwd(), 'src/lib/chalktalk/sketches/'+filename), {encoding:'utf8', flag:'r'});
  });
  ipcMain.handle('ls_sketches', async (event: any, arg: any) => {
    return await readDir("sketches", ".js");
  });
  ipcMain.handle('ls_sketchlibs', async (event: any, arg: any) => {
    const list = await readDir("sketchlibs", ".js"); console.log(list);
    return list;
  });
  ipcMain.handle('ls_images', async (event: any, arg: any) => {
    return await readDir("images", ".js");
  });
  ipcMain.handle('ls_state', async (event: any, arg: any) => {
    return await readDir("state", ".js");
  });
  ipcMain.handle('get_collections', async (event: any, arg: any) => {
    console.log("GETTING COLLECTIONS");
  });
  ipcMain.handle('get_collection', async (event: any, name: any) => {
    console.log("GETTING COLLECTION", name);
    return await fs.readFileSync(path.resolve(process.cwd(), 'src/lib/chalktalk/state/collections/'+name+'.json'), {encoding:'utf8', flag:'r'});
  });
  //TODO:: need to actually save the collection
  ipcMain.handle('set_collections', async (event: any, collections: any) => {
    console.log("SET COLLECTION", collections);
    const filePath = path.resolve(process.cwd(), 'src/lib/chalktalk/state/collections/'+
      collections.key+'.json');
    fs.writeFileSync(filePath, collections.value);
  });

  console.log(path.resolve(process.cwd(), '..'),"working dir");
  win.loadFile('./lib/chalktalk/index.html')
  win.webContents.openDevTools()
}

//Electron browser window
function createWindow () {
  console.log("Opening browser window");
  return new BrowserWindow({
  width: 1600,
  height: 1000,
  frame: true,
  transparent: true,
  //fullscreen: true,
  webPreferences: {
    nodeIntegration: true
  }
});
  
}

app.whenReady().then(init)

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