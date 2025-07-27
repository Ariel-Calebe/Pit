const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  login: (email, senha) => ipcRenderer.invoke('login', email, senha),
  cadastrar: (nome, email, senha) => ipcRenderer.invoke('cadastrar', nome, email, senha),
  loginGoogle: () => ipcRenderer.invoke('login-google')
});
