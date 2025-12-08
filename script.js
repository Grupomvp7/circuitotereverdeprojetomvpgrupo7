// ========================= ARMAZENAMENTO LOCAL (SIMULA O BACKEND) =========================
const ADMINS_KEY = 'adminUsers';
const USERS_KEY = 'commonUsers';

// Inicializa o localStorage com usuários/admins padrão se estiver vazio
function initializeStorage() {
    if (!localStorage.getItem(ADMINS_KEY)) {
        localStorage.setItem(ADMINS_KEY, JSON.stringify([
            { user: 'admin', pass: 'admin123', name: 'Admin Principal' }
        ]));
    }
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([
            { user: 'user@teste.com', pass: '1234', name: 'Usuário Teste' }
        ]));
    }
}
initializeStorage();


// ========================= FUNÇÕES DE CONTROLE DE TELA (HTML: login.html) =========================

function resetLoginView(subtitle) {
    // Esconde todas as caixas de login/cadastro na página de login
    document.getElementById('userLoginBox').style.display = 'none';
    document.getElementById('adminLoginBox').style.display = 'none';
    document.getElementById('registerBox').style.display = 'none'; // Cadastro Admin
    document.getElementById('userRegisterBox').style.display = 'none'; // Cadastro Usuário
    
    // Atualiza o subtítulo
    document.getElementById('login-subtitle').textContent = subtitle;
}

function showUserLogin() {
    resetLoginView("Acesso de Usuário");
    document.getElementById('userLoginBox').style.display = 'block';
}

function showAdminLogin() {
    resetLoginView("Painel Administrativo");
    document.getElementById('adminLoginBox').style.display = 'block';
}

function showUserRegister() {
    resetLoginView("Cadastro de Usuário");
    document.getElementById('userRegisterBox').style.display = 'block';
}

function showRegister() { // Cadastro de Administrador
    resetLoginView("Cadastro de Administrador");
    document.getElementById('registerBox').style.display = 'block';
}

// Inicia na tela de login de usuário ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na página de login antes de chamar showUserLogin
    if (document.getElementById('login-view')) {
        showUserLogin();
    }
});


// ========================= LÓGICA DE CADASTRO =========================

function registerUser() {
    const name = document.getElementById('userRegisterName').value.trim();
    const email = document.getElementById('userRegisterEmail').value.trim();
    const pass = document.getElementById('userRegisterPass').value.trim();

    if (!name || !email || !pass) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    if (users.some(u => u.user === email)) {
        alert("E-mail já cadastrado. Tente fazer login.");
        return;
    }

    users.push({ user: email, pass: pass, name: name });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    alert("Cadastro de Usuário realizado com sucesso! Faça login.");
    showUserLogin(); 
}

function register() { // Cadastro de Administrador
    const name = document.getElementById('registerName').value.trim();
    const user = document.getElementById('registerUser').value.trim();
    const pass = document.getElementById('registerPass').value.trim();

    if (!name || !user || !pass) {
        alert("Por favor, preencha todos os campos para realizar o cadastro.");
        return;
    }

    const admins = JSON.parse(localStorage.getItem(ADMINS_KEY));
    if (admins.some(a => a.user === user)) {
        alert("Nome de usuário administrativo já existe.");
        return;
    }

    admins.push({ user: user, pass: pass, name: name });
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));

    alert("Cadastro realizado com sucesso! Você já pode fazer login.");
    showAdminLogin(); 
}


// ========================= LÓGICA DE LOGIN (AUTENTICAÇÃO COM REDIRECIONAMENTO) =========================

function loginUser() {
    const input = document.getElementById('userLoginUser').value.trim();
    const pass = document.getElementById('userLoginPass').value.trim();
    
    if (!input || !pass) {
        alert('Por favor, preencha o usuário/email e a senha.');
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const userFound = users.find(u => u.user === input && u.pass === pass);

    if (userFound) {
        // SUCESSO: Salva o nome e status no sessionStorage e redireciona para a Home
        sessionStorage.setItem('isUserLoggedIn', 'true');
        sessionStorage.setItem('userName', userFound.name);
        
        // Redireciona para o index.html (ou a página inicial do usuário)
        window.location.href = 'index.html'; 
    } else {
        alert("Credenciais de Usuário inválidas. Verifique o e-mail/usuário e a senha.");
    }
}

function loginAdmin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    
    if (!user || !pass) {
        alert('Por favor, preencha o usuário e a senha para entrar.');
        return;
    }

    const admins = JSON.parse(localStorage.getItem(ADMINS_KEY));
    const adminFound = admins.find(a => a.user === user && a.pass === pass);

    if (adminFound) {
        // SUCESSO: Salva o nome e status no sessionStorage e REDIRECIONA para o Dashboard
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        sessionStorage.setItem('adminName', adminFound.name);
        
        window.location.href = 'login-adm.html'; 
    } else {
        alert("Credenciais de Administrador inválidas. Verifique o usuário e a senha.");
    }
}


// ========================= FUNÇÕES DE LOGOUT =========================

function logoutUser() {
    // Limpa o status de login e redireciona para a página de login
    sessionStorage.removeItem('isUserLoggedIn');
    sessionStorage.removeItem('userName');
    window.location.href = 'login.html'; 
}

function logout() { // Chamado pelo botão SAIR do dashboard do Administrador
    // Limpa o status de login e redireciona para a página de login
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('adminName');
    window.location.href = 'login.html'; 
}

// ----------------------------------------------------
// Novo script para a página do Dashboard (login-adm.html)
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Se estivermos na página do Dashboard (login-adm.html)
    const adminNameDisplay = document.getElementById('adminNameDisplay');
    
    if (adminNameDisplay) {
        const loggedIn = sessionStorage.getItem('isAdminLoggedIn');
        const adminName = sessionStorage.getElementById('adminName');

        if (loggedIn === 'true' && adminName) {
            // Exibe o nome do admin no Dashboard
            adminNameDisplay.textContent = adminName;
            
        } else {
            // Se não estiver logado, redireciona para a página de login
            alert('Acesso negado! Por favor, faça login.');
            window.location.href = 'login.html';
        }
        
        // Código para alternar as seções (Trilhas, Cachoeiras, etc.)
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); 
                
                document.querySelectorAll('.nav-menu a').forEach(item => item.classList.remove('active'));
                document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

                this.classList.add('active');
                const targetId = this.getAttribute('href').substring(1);
                document.getElementById(targetId).classList.add('active');
            });
        });
    }
    
    // Se estiver na página inicial do usuário (index.html, deve ser ajustado lá)
    if (document.getElementById('userNameDisplay')) {
        const loggedInUser = sessionStorage.getItem('isUserLoggedIn');
        const userName = sessionStorage.getItem('userName');
        const userNameDisplay = document.getElementById('userNameDisplay');

        if (loggedInUser === 'true' && userName) {
            userNameDisplay.textContent = userName;
        } else if (loggedInUser === 'true') {
            userNameDisplay.textContent = "Usuário"; // Pelo menos mostra que está logado
        }
        // Nota: A proteção de acesso da página inicial é menos comum, mas pode ser adicionada se necessário.
    }
});
