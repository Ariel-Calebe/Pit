// electron-main.js
import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'; // dev only

// __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Caminhos estáveis, não dependem de process.cwd()
const FRONTEND_DIR = path.join(__dirname, 'frontend');
const PRELOAD_PATH = path.join(__dirname, 'electron-preload.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 820,
    show: true,
    webPreferences: {
      preload: PRELOAD_PATH,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      nativeWindowOpen: true
    }
  });

  // abrir links http/https no navegador padrão
  win.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const u = new URL(url);
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        shell.openExternal(url);
        return { action: 'deny' };
      }
    } catch (_) {}
    return { action: 'deny' };
  });

  // carrega o login.html do frontend (caminho absoluto)
  win.loadFile(path.join(FRONTEND_DIR, 'login.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
