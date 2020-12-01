var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, remote = _a.remote, ipcMain = _a.ipcMain;
var path = require('path');
var fs = require('fs');
//hot reload setup for development
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    try {
        require('electron-reloader')(module, {
            debug: true,
            watchRenderer: true
        });
    }
    catch (_) {
        console.log('Error');
    }
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
var httpserver = require('./lib/chalktalk/server/main.js');
//import httpserver from './lib/chalktalk/server/main.js';
//replacement for chalktalk server functions
//TODO:: these should be handled elsewhere
function readDir(dirName, extension) {
    return __awaiter(this, void 0, void 0, function () {
        var fullPath;
        return __generator(this, function (_a) {
            fullPath = path.resolve(process.cwd(), 'src/lib/chalktalk/' + dirName);
            console.log("Read directory " + fullPath);
            return [2 /*return*/, fs.promises.readdir(fullPath)
                    .then(function (files) {
                    var res = '';
                    for (var i = 0; i < files.length; i++) {
                        if (!extension || files[i].toLowerCase().endsWith(extension.toLowerCase())) {
                            res += (files[i] + "\n");
                        }
                    }
                    return res;
                })["catch"](function (err) {
                    console.log("ERROR READING DIRECTORY: ", fullPath);
                    throw err;
                })];
        });
    });
}
function init() {
    var _this = this;
    var win = createWindow();
    ipcMain.handle('sketches', function (event, filename) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFileSync(path.resolve(process.cwd(), 'src/lib/chalktalk/sketches/' + filename), { encoding: 'utf8', flag: 'r' })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    ipcMain.handle('ls_sketches', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readDir("sketches", ".js")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    ipcMain.handle('ls_sketchlibs', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
        var list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readDir("sketchlibs", ".js")];
                case 1:
                    list = _a.sent();
                    console.log(list);
                    return [2 /*return*/, list];
            }
        });
    }); });
    ipcMain.handle('ls_images', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readDir("images", ".js")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    ipcMain.handle('ls_state', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readDir("state", ".js")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    ipcMain.handle('get_collections', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("GETTING COLLECTIONS");
            return [2 /*return*/];
        });
    }); });
    ipcMain.handle('get_collection', function (event, name) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("GETTING COLLECTION", name);
                    return [4 /*yield*/, fs.readFileSync(path.resolve(process.cwd(), 'src/lib/chalktalk/state/collections/' + name + '.json'), { encoding: 'utf8', flag: 'r' })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    //TODO:: need to actually save the collection
    ipcMain.handle('set_collections', function (event, collections) { return __awaiter(_this, void 0, void 0, function () {
        var filePath;
        return __generator(this, function (_a) {
            console.log("SET COLLECTION", collections);
            filePath = path.resolve(process.cwd(), 'src/lib/chalktalk/state/collections/' +
                collections.key + '.json');
            fs.writeFileSync(filePath, collections.value);
            return [2 /*return*/];
        });
    }); });
    console.log(path.resolve(process.cwd(), '..'), "working dir");
    win.loadFile('./lib/chalktalk/index.html');
    win.webContents.openDevTools();
}
//Electron browser window
function createWindow() {
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
app.whenReady().then(init);
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
