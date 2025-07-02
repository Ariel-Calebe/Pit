const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Importando as rotas

const app = express();

// Usar JSON e arquivos estáticos
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir a página de login e cadastro
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html')); // Página de login e cadastro
});

// Rota de sucesso após cadastro
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'success.html')); // Página de sucesso
});

// Rota para a página home após login bem-sucedido
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html')); // Página de home
});

// Usar as rotas de login e cadastro
app.use('/', authRoutes); // Definindo as rotas de login e cadastro

// Inicializando o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
