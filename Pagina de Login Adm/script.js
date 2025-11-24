// ========================= FUNÇÃO: MOSTRAR TELA DE CADASTRO =========================
// Esconde o box de login e mostra o box de cadastro
function showRegister() {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('registerBox').style.display = 'block';
}

// ========================= FUNÇÃO: MOSTRAR TELA DE LOGIN =========================
// Faz o contrário da função acima: esconde o cadastro e mostra o login
function showLogin() {
  document.getElementById('registerBox').style.display = 'none';
  document.getElementById('loginBox').style.display = 'block';
}

// ========================= FUNÇÃO DE LOGIN =========================
// Verifica se usuário e senha foram preenchidos e redireciona para a painel
function login() {
  const user = document.getElementById('loginUser').value;  // Pega o usuário digitado
  const pass = document.getElementById('loginPass').value;  // Pega a senha digitada

  // Verifica se os campos não estão vazios
  if (user.trim() !== '' && pass.trim() !== '') {

    // ⚠️ IMPORTANTE:
    // Este redirecionamento deve apontar para o arquivo EXATO da sua painel.
    window.location.href = 'Pagina do Administrador.html';  

  } else {
    // Exibe o alerta se usuário ou senha estiver vazio.
    alert('Por favor, preencha o usuário e a senha para entrar.');
  }
}

// ========================= FUNÇÃO DE CADASTRO =========================
// Verifica campos e mostra alerta de sucesso ou erro
function register() {
  const name = document.getElementById('registerName').value;  // Nome completo
  const email = document.getElementById('registerEmail').value; // Email
  const user = document.getElementById('registerUser').value;   // Nome de usuário
  const pass = document.getElementById('registerPass').value;   // Senha

  // Verifica se nenhum campo está vazio
  if (name.trim() !== '' && email.trim() !== '' && user.trim() !== '' && pass.trim() !== '') {

    // Se tudo estiver preenchido, exibe mensagem de sucesso
    alert('Cadastro realizado com sucesso! Você já pode fazer login.');

    // Retorna automaticamente para a tela de login
    showLogin(); 
    
  } else {
    // Exibe alerta caso algum campo esteja vazio
    alert('Por favor, preencha todos os campos para realizar o cadastro.');
  }
}

// ========================= FUNÇÃO DE LOGOUT =========================
// Encerra a sessão e volta para a página de login
function logout() {
  window.location.href = 'Pagina de Login.html'; // Recarrega a página principal de login
}
