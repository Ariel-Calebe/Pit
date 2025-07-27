const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'users.json');

// Garante que o arquivo existe
function garantirArquivo() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
}

// Lê todos os usuários
function getAllUsers() {
  garantirArquivo();
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Busca por e-mail
function getUserByEmail(email) {
  const users = getAllUsers();
  return users.find(u => u.email === email);
}

// Adiciona novo usuário
function addUser(user) {
  const users = getAllUsers();
  users.push(user);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

module.exports = {
  getUserByEmail,
  addUser,
};
