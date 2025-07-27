// Cadastro
document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('cadastro-nome').value;
  const email = document.getElementById('cadastro-email').value;
  const senha = document.getElementById('cadastro-senha').value;

  const resultado = await window.electronAPI.cadastrar(nome, email, senha);

  if (resultado.sucesso) {
    alert('Cadastro realizado com sucesso!');
  } else {
    alert('Erro ao cadastrar: ' + resultado.mensagem);
  }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  const resultado = await window.electronAPI.login(email, senha);

  if (resultado.sucesso) {
    alert('Login bem-sucedido! Bem-vindo, ' + resultado.nome);
    // Aqui você pode redirecionar para outra página futuramente
  } else {
    alert('Falha no login: ' + resultado.mensagem);
  }
});

document.getElementById('btn-google').addEventListener('click', async () => {
  const resultado = await window.electronAPI.loginGoogle();

  if (resultado.sucesso) {
    alert(`Login Google bem-sucedido! Bem-vindo, ${resultado.nome}`);
    // redirecionar ou abrir nova tela futuramente
  } else {
    alert('Falha no login com Google: ' + resultado.mensagem);
  }
});
