const userModel = require('../models/userModel');

function login(email, senha) {
  const usuario = userModel.getUserByEmail(email);
  if (!usuario) {
    return { sucesso: false, mensagem: 'Usuário não encontrado.' };
  }
  if (usuario.senha !== senha) {
    return { sucesso: false, mensagem: 'Senha incorreta.' };
  }
  return { sucesso: true, nome: usuario.nome };
}

function cadastrar(nome, email, senha) {
  const existe = userModel.getUserByEmail(email);
  if (existe) {
    return { sucesso: false, mensagem: 'E-mail já cadastrado.' };
  }

  const novoUsuario = { nome, email, senha };
  userModel.addUser(novoUsuario);

  return { sucesso: true };
}

// NOVA FUNÇÃO: login com Google
function loginOuCadastroViaGoogle(perfil) {
  const { name, email } = perfil;
  let usuario = userModel.getUserByEmail(email);

  if (!usuario) {
    userModel.addUser({
      nome: name,
      email: email,
      senha: 'GOOGLE_AUTH' // senha simbólica
    });
    return { sucesso: true, nome: name };
  }

  return { sucesso: true, nome: usuario.nome };
}

module.exports = {
  login,
  cadastrar,
  loginOuCadastroViaGoogle
};
