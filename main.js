const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const fetch = require('node-fetch');
require('dotenv').config();

const authController = require('./controllers/authController');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'login.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Funções padrão
ipcMain.handle('login', (e, email, senha) => authController.login(email, senha));
ipcMain.handle('cadastrar', (e, nome, email, senha) => authController.cadastrar(nome, email, senha));

// Login com Google via servidor local
ipcMain.handle('login-google', async () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = 'http://localhost:51739/callback';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&prompt=consent`;

  // Abrir navegador padrão
  require('electron').shell.openExternal(authUrl);

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith('/callback')) {
        const url = new URL(`http://localhost:51739${req.url}`);
        const code = url.searchParams.get('code');

        if (!code) {
          res.writeHead(400);
          res.end('Código não encontrado.');
          server.close();
          return reject({ sucesso: false, mensagem: 'Código ausente.' });
        }

        // Troca o código por token
        try {
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
              grant_type: 'authorization_code'
            })
          });

          const tokenData = await tokenRes.json();

          const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`
            }
          });

          const perfil = await userRes.json();

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`<h1>Login com Google bem-sucedido!</h1><p>Você pode fechar esta janela.</p>`);

          server.close();
          resolve(authController.loginOuCadastroViaGoogle(perfil));
        } catch (err) {
          res.writeHead(500);
          res.end('Erro ao autenticar com Google.');
          server.close();
          reject({ sucesso: false, mensagem: 'Erro ao autenticar com Google.' });
        }
      }
    });

    server.listen(51739, () => {
      console.log('Servidor escutando na porta 51739...');
    });
  });
});
