// =================================================================
// CONFIGURAÇÃO DO BACKEND (API NODE.JS + EXPRESS + SQLITE)
// =================================================================
const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;


// =================================================================
// 🎡 LÓGICA DO CARROSSEL (SUPORTA MÚLTIPLOS CARROSÉIS NA PÁGINA)
// =================================================================
// =================================================================
// 💧 CACHOEIRAS CADASTRADAS PELO PAINEL ADMIN (EXIBIÇÃO PÚBLICA)
// =================================================================
// =================================================================
// 🌿 TRILHAS CADASTRADAS PELO PAINEL ADMIN (EXIBIÇÃO PÚBLICA)
// =================================================================
// =================================================================
// 📅 EVENTOS CADASTRADOS PELO PAINEL ADMIN (EXIBIÇÃO PÚBLICA)
// =================================================================
async function carregarEventosPublico() {
    const grid = document.querySelector('.eventos-grid');
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}/eventos`);
        if (!response.ok) throw new Error('Falha ao buscar eventos.');

        const eventos = await response.json();

        eventos.forEach(e => {
            const card = document.createElement('div');
            card.className = 'evento-card card';
            card.innerHTML = `
                <div class="evento-img" style="background-image: url('${e.imagem || 'img/eventosq.jpeg'}')"></div>
                <div class="evento-content">
                    <h3>${e.titulo}</h3>
                    <p class="evento-data"><i class="fa-solid fa-calendar-day"></i> ${e.data_evento || 'A definir'}</p>
                    <p class="evento-local"><i class="fa-solid fa-location-dot"></i> ${e.local || 'A definir'}</p>
                    <p class="evento-descricao">${e.descricao || ''}</p>
                    <a href="#" class="evento-btn">Ver detalhes</a>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar eventos públicos:', error);
    }
}
async function carregarTrilhasPublico() {
    const containerTresPicos = document.getElementById('trilhas-tres-picos');
    const containerMontanhas = document.getElementById('trilhas-montanhas');
    const containerOutras = document.getElementById('trilhas-dinamicas');

    if (!containerTresPicos && !containerMontanhas && !containerOutras) return;

    try {
        const response = await fetch(`${API_URL}/trilhas`);
        if (!response.ok) throw new Error('Falha ao buscar trilhas.');

        const trilhas = await response.json();

        trilhas.forEach(t => {
            const imagensHtml = (t.imagens && t.imagens.length > 0)
                ? t.imagens.map(url => `<img src="${url}" alt="${t.titulo}" />`).join('')
                : '';

            const carrosselHtml = imagensHtml ? `
                <div class="carousel">
                    <div class="carousel-track">${imagensHtml}</div>
                    <button class="carousel-btn prev" aria-label="Imagem anterior">&#10094;</button>
                    <button class="carousel-btn next" aria-label="Próxima imagem">&#10095;</button>
                </div>
            ` : '';

            const dicasHtml = (t.dicas && t.dicas.length > 0)
                ? `<h3>Dicas</h3><ul class="dicas-lista">${t.dicas.map(d => `<li>${d}</li>`).join('')}</ul>`
                : '';

            const horariosHtml = (t.horarios && t.horarios.length > 0)
                ? `<h3>Horário de Funcionamento</h3><ul class="horarios-lista">${t.horarios.map(h => `<li>${h}</li>`).join('')}</ul>`
                : '';

            const descricaoHtml = (t.descricao || '')
                .split('\n\n')
                .map(paragrafo => paragrafo.trim())
                .filter(p => p.length > 0)
                .join('<br><br>');

            const bloco = document.createElement('section');
            bloco.className = 'trilha-section';
            bloco.innerHTML = `
                <h2>${t.titulo}</h2>
                ${carrosselHtml}
                <p class="descricao-trilha">${descricaoHtml}</p>
                <h3>Características Gerais</h3>
                <table>
                    <thead><tr><th>Item</th><th>Informação</th></tr></thead>
                    <tbody>
                        <tr><td>Localização</td><td>${t.localizacao || 'Não informado'}</td></tr>
                        <tr><td>Altitude</td><td>${t.altitude || 'Não informado'}</td></tr>
                        <tr><td>Extensão</td><td>${t.distancia || 'Não informado'}</td></tr>
                        <tr><td>Tempo médio</td><td>${t.duracao || 'Não informado'}</td></tr>
                        <tr><td>Nível de dificuldade</td><td>${t.dificuldade || 'Não informado'}</td></tr>
                        <tr><td>Tipo de atividade</td><td>${t.tipo_atividade || 'Não informado'}</td></tr>
                        <tr><td>Acesso</td><td>${t.acesso || 'Não informado'}</td></tr>
                        <tr><td>Ponto final</td><td>${t.ponto_final || 'Não informado'}</td></tr>
                        <tr><td>Ambiente natural</td><td>${t.ambiente_natural || 'Não informado'}</td></tr>
                        <tr><td>Sinalização</td><td>${t.sinalizacao || 'Não informado'}</td></tr>
                        <tr><td>Melhor época</td><td>${t.melhor_epoca || 'Não informado'}</td></tr>
                        <tr><td>Infraestrutura</td><td>${t.infraestrutura || 'Não informado'}</td></tr>
                        <tr><td>Administração</td><td>${t.administracao || 'Não informado'}</td></tr>
                        <tr><td>Indicação</td><td>${t.indicacao || 'Não informado'}</td></tr>
                    </tbody>
                </table>
                ${dicasHtml}
                ${horariosHtml}
            `;

            // Decide em qual parque essa trilha deve aparecer, com base no campo "Parque"
            const nomeParque = (t.parque || '').toLowerCase();
            let destino = containerOutras; // se não bater com nenhum parque conhecido, cai numa área reserva

            if (nomeParque.includes('três picos') || nomeParque.includes('tres picos')) {
                destino = containerTresPicos || containerOutras;
            } else if (nomeParque.includes('montanhas')) {
                destino = containerMontanhas || containerOutras;
            }

            if (destino) destino.appendChild(bloco);
        });

        // Reinicializa os carrosséis para as trilhas recém-inseridas
        inicializarCarrosseis();

    } catch (error) {
        console.error('Erro ao carregar trilhas públicas:', error);
    }
}

async function carregarCachoeirasPublico() {
    const containerTresPicos = document.getElementById('cachoeiras-tres-picos');
    const containerSerraOrgaos = document.getElementById('cachoeiras-serraorgaos');
    const containerOutras = document.getElementById('cachoeiras-dinamicas');

    if (!containerTresPicos && !containerSerraOrgaos && !containerOutras) return;

    try {
        const response = await fetch(`${API_URL}/cachoeiras`);
        if (!response.ok) throw new Error('Falha ao buscar cachoeiras.');

                const cachoeiras = await response.json();

        cachoeiras.forEach(c => {
            const imagensHtml = (c.imagens && c.imagens.length > 0)
                ? c.imagens.map(url => `<img src="${url}" alt="${c.titulo}" />`).join('')
                : '';

            const carrosselHtml = imagensHtml ? `
                <div class="carousel">
                    <div class="carousel-track">${imagensHtml}</div>
                    <button class="carousel-btn prev" aria-label="Imagem anterior">&#10094;</button>
                    <button class="carousel-btn next" aria-label="Próxima imagem">&#10095;</button>
                </div>
            ` : '';

            const dicasHtml = (c.dicas && c.dicas.length > 0)
                ? `<h3>Dicas</h3><ul class="dicas-lista">${c.dicas.map(d => `<li>${d}</li>`).join('')}</ul>`
                : '';

            const horariosHtml = (c.horarios && c.horarios.length > 0)
                ? `<h3>Horário de Funcionamento</h3><ul class="horarios-lista">${c.horarios.map(h => `<li>${h}</li>`).join('')}</ul>`
                : '';

            const bloco = document.createElement('section');
            bloco.className = 'trilha-section';
            bloco.innerHTML = `
                <h2>${c.titulo}</h2>
                ${carrosselHtml}
                <p class="descricao-trilha">${c.descricao || ''}</p>
                <h3>Características Gerais</h3>
                <table>
                    <thead><tr><th>Item</th><th>Informação</th></tr></thead>
                    <tbody>
                        <tr><td>Localização</td><td>${c.localizacao || 'Não informado'}</td></tr>
                        <tr><td>Altitude média</td><td>${c.altitude_media || 'Não informado'}</td></tr>
                        <tr><td>Extensão da trilha</td><td>${c.extensao_trilha || 'Não informado'}</td></tr>
                        <tr><td>Tempo médio</td><td>${c.tempo_medio || 'Não informado'}</td></tr>
                        <tr><td>Nível de dificuldade</td><td>${c.dificuldade || 'Não informado'}</td></tr>
                        <tr><td>Tipo de atrativo</td><td>${c.tipo_atrativo || 'Não informado'}</td></tr>
                        <tr><td>Acesso</td><td>${c.acesso || 'Não informado'}</td></tr>
                        <tr><td>Ambiente</td><td>${c.ambiente || 'Não informado'}</td></tr>
                        <tr><td>Destaque</td><td>${c.destaque || 'Não informado'}</td></tr>
                        <tr><td>Estrutura de apoio</td><td>${c.estrutura || 'Não informado'}</td></tr>
                        <tr><td>Melhor época</td><td>${c.melhor_epoca || 'Não informado'}</td></tr>
                    </tbody>
                </table>
                ${dicasHtml}
                ${horariosHtml}
            `;
                        // Decide em qual parque essa cachoeira deve aparecer, com base no campo "Parque"
            const nomeParque = (c.parque || '').toLowerCase();
            let destino = containerOutras; // se não bater com nenhum parque conhecido, cai numa área reserva

            if (nomeParque.includes('três picos') || nomeParque.includes('tres picos')) {
                destino = containerTresPicos || containerOutras;
            } else if (nomeParque.includes('serra dos órgãos') || nomeParque.includes('serra dos orgaos') || nomeParque.includes('parnaso')) {
                destino = containerSerraOrgaos || containerOutras;
            }

            if (destino) destino.appendChild(bloco);
        });

        // Reinicializa os carrosséis para as cachoeiras recém-inseridas
        inicializarCarrosseis();

    } catch (error) {
        console.error('Erro ao carregar cachoeiras públicas:', error);
        container.innerHTML = '<p class="descricao-trilha">Não foi possível carregar as novas cachoeiras no momento.</p>';
    }
}
function inicializarCarrosseis() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const images = carousel.querySelectorAll('.carousel-track img');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');

        if (!track || images.length === 0 || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const totalImages = images.length;

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateCarousel();
        });
    });
}


// =================================================================
// 🔍 FUNÇÃO DE BUSCA UNIVERSAL COM DESTAQUE (Para todas as páginas)
// =================================================================

// Função auxiliar para escapar caracteres especiais de Regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Limpa os grifados (<mark>) feitos anteriormente
function limparDestaques(elemento) {
    const marcas = elemento.querySelectorAll('mark.highlight');
    marcas.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize(); // Reúne os nós de texto picados
    });
}

// Aplica a tag <mark> apenas nos nós de texto do HTML
function destacarTexto(node, regex) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (regex.test(node.nodeValue)) {
            const span = document.createElement('span');
            span.innerHTML = node.nodeValue.replace(regex, '<mark class="highlight">$1</mark>');
            node.parentNode.replaceChild(span, node);
        }
    } else if (
        node.nodeType === Node.ELEMENT_NODE && 
        !['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'MARK'].includes(node.tagName)
    ) {
        Array.from(node.childNodes).forEach(child => destacarTexto(child, regex));
    }
}

// Função principal disparada ao digitar na barra de busca
function filterContent() {
    const input = document.getElementById('searchInput') || document.querySelector('.search-bar input');
    if (!input) return;

    const termoBusca = input.value.trim();

    // Seleciona os contêineres e cartões principais da página
    const items = document.querySelectorAll(
        '.trilha-section, .hero-icon-card, .card, .evento-card, .item, li, article, section > div'
    );

    items.forEach(item => {
        // 1. Remove destaques da busca anterior
        limparDestaques(item);

        if (termoBusca === '') {
            // Se o campo estiver vazio, exibe tudo normalmente
            item.style.display = '';
            return;
        }

        // Regex para buscar a palavra (case-insensitive)
        const regex = new RegExp(`(${escapeRegExp(termoBusca)})`, 'gi');
        const textoItem = item.textContent;

        // 2. Verifica se o texto pesquisado existe neste item
        if (regex.test(textoItem)) {
            item.style.display = '';
            // 3. Aplica o grifado amarelo na palavra encontrada
            destacarTexto(item, regex);
        } else {
            // Se for um bloco individual, oculta
            if (
                item.tagName === 'LI' || 
                item.tagName === 'ARTICLE' || 
                item.classList.contains('trilha-section') ||
                item.classList.contains('hero-icon-card') || 
                item.classList.contains('card') ||
                item.classList.contains('evento-card') ||
                (item.parentElement && item.parentElement.tagName === 'SECTION')
            ) {
                item.style.display = 'none';
            }
        }
    });
}


// =================================================================
// ⬆️ LÓGICA DO BOTÃO VOLTAR AO TOPO (SUAVE E FLEXÍVEL)
// =================================================================
function verificarBotaoTopo() {
    const btnTopo = document.querySelector('.voltar-topo') || document.getElementById('voltarTopo');
    
    if (btnTopo) {
        const limiteFinal = document.documentElement.scrollHeight - window.innerHeight;
        const pertoDoFim = window.scrollY >= (limiteFinal - 150);
        const rolouBastante = window.scrollY > 300;

        // Aparece se rolou mais de 300px OU se estiver pertinho do final da página
        if (pertoDoFim || rolouBastante) {
            btnTopo.classList.add('ativo');
        } else {
            btnTopo.classList.remove('ativo');
        }
    }
}


// =================================================================
// FUNÇÕES DE CONTROLE DE TELA (HTML: login.html)
// =================================================================

function resetLoginView(subtitle) {
    const uBox = document.getElementById('userLoginBox');
    const aBox = document.getElementById('adminLoginBox');
    const rBox = document.getElementById('registerBox');
    const urBox = document.getElementById('userRegisterBox');
    const sub = document.getElementById('login-subtitle');

    if (uBox) uBox.style.display = 'none';
    if (aBox) aBox.style.display = 'none';
    if (rBox) rBox.style.display = 'none';
    if (urBox) urBox.style.display = 'none';
    if (sub) sub.textContent = subtitle;
}

function showUserLogin() {
    resetLoginView("Acesso de Usuário");
    const uBox = document.getElementById('userLoginBox');
    if (uBox) uBox.style.display = 'block';
}

function showAdminLogin() {
    resetLoginView("Painel Administrativo");
    const aBox = document.getElementById('adminLoginBox');
    if (aBox) aBox.style.display = 'block';
}

function showUserRegister() {
    resetLoginView("Cadastro de Usuário");
    const urBox = document.getElementById('userRegisterBox');
    if (urBox) urBox.style.display = 'block';
}

function showRegister() { // Cadastro de Administrador
    resetLoginView("Cadastro de Administrador");
    const rBox = document.getElementById('registerBox');
    if (rBox) rBox.style.display = 'block';
}




// Verifica se o texto tem um formato válido de e-mail (ex: nome@dominio.com)
function isEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

async function registerUser() {

    const nameEl = document.getElementById('userRegisterName');
    const emailEl = document.getElementById('userRegisterEmail');
    const passEl = document.getElementById('userRegisterPass');

    if (!nameEl || !emailEl || !passEl) return;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass = passEl.value.trim();

        if (!name || !email || !pass) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (!isEmailValido(email)) {
        alert("Por favor, digite um e-mail válido (ex: nome@exemplo.com).");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass, role: 'user' })
        });

        const data = await response.json();

                if (response.ok) {
            alert("Cadastro de Usuário realizado com sucesso! Faça login.");
            nameEl.value = '';
            emailEl.value = '';
            passEl.value = '';
            showUserLogin();
        } else {
            alert("❌ Erro: " + (data.error || "Não foi possível realizar o cadastro."));
        }
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
        alert("❌ Erro ao conectar ao servidor backend. Verifique se ele está rodando!");
    }
}

// Cadastro de Administrador
async function register() {
    const nameEl = document.getElementById('registerName');
    const userEl = document.getElementById('registerUser');
    const passEl = document.getElementById('registerPass');

    if (!nameEl || !userEl || !passEl) return;

    const name = nameEl.value.trim();
    const user = userEl.value.trim();
    const pass = passEl.value.trim();

      if (!name || !user || !pass) {
        alert("Por favor, preencha todos os campos para realizar o cadastro.");
        return;
    }

    if (!isEmailValido(user)) {
        alert("Por favor, digite um e-mail válido no campo de usuário (ex: nome@exemplo.com).");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email: user, password: pass, role: 'admin' })
        });

        const data = await response.json();

                if (response.ok) {
            alert("Cadastro de Administrador realizado com sucesso! Você já pode fazer login.");
            nameEl.value = '';
            userEl.value = '';
            passEl.value = '';
            showAdminLogin();
        } else {
            alert("❌ Erro: " + (data.error || "Não foi possível cadastrar o administrador."));
        }
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
        alert("❌ Erro ao conectar ao servidor backend.");
    }
}


// =================================================================
// LÓGICA DE LOGIN (CONECTADO COM O BACKEND)
// =================================================================

// Login do Usuário Comum
async function loginUser() {
    const inputEl = document.getElementById('userLoginUser');
    const passEl = document.getElementById('userLoginPass');

    if (!inputEl || !passEl) return;

    const input = inputEl.value.trim();
    const pass = passEl.value.trim();

    if (!input || !pass) {
        alert('Por favor, preencha o usuário/email e a senha.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userOrEmail: input, password: pass })
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('isUserLoggedIn', 'true');
            sessionStorage.setItem('userName', data.user.name);

            // Redireciona para o index.html
            window.location.href = 'index.html';
        } else {
            alert("❌ " + (data.error || "Credenciais de Usuário inválidas."));
        }
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
        alert("❌ Servidor indisponível ou fora do ar!");
    }
}

// Login do Administrador
async function loginAdmin() {
    const userEl = document.getElementById('loginUser');
    const passEl = document.getElementById('loginPass');

    if (!userEl || !passEl) return;

    const user = userEl.value.trim();
    const pass = passEl.value.trim();

    if (!user || !pass) {
        alert('Por favor, preencha o usuário e a senha para entrar.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userOrEmail: user, password: pass })
        });

        const data = await response.json();

        if (response.ok) {
            // Verifica se o usuário autenticado é realmente um admin
            if (data.user.role === 'admin') {
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                sessionStorage.setItem('adminName', data.user.name);
                localStorage.setItem('adminToken', data.token);

                window.location.href = 'login-adm.html';
            } else {
                alert("❌ Acesso negado! Este usuário não tem privilégios de administrador.");
            }
        } else {
            alert("❌ " + (data.error || "Credenciais de Administrador inválidas."));
        }
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
        alert("❌ Servidor indisponível ou fora do ar!");
    }
}


// =================================================================
// 👤 GESTÃO DE USUÁRIOS NO PAINEL ADMINISTRATIVO (INTEGRAÇÃO COM BD)
// =================================================================

// Busca a lista de usuários cadastrados no backend e preenche a tabela
async function carregarUsuarios() {
    const tabela = document.getElementById('lista-usuarios');
    if (!tabela) return;

    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Falha ao carregar usuários.');

        const usuarios = await response.json();
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (usuarios.length === 0) {
            tabela.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum usuário cadastrado.</td></tr>';
            return;
        }

        usuarios.forEach(user => {
            const tr = document.createElement('tr');
            tr.id = `user-${user.id}`;

            const badgeClass = user.role === 'admin' ? 'badge-admin' : 'badge-user';
            const roleText = user.role === 'admin' ? 'Admin' : 'Cliente';
            const dataCadastro = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A';

            tr.innerHTML = `
                <td>#${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="${badgeClass}">${roleText}</span></td>
                <td>${dataCadastro}</td>
                <td>
                    <button class="btn-delete" onclick="deletarUsuario(${user.id}, '${user.name.replace(/'/g, "\\'")}')">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </td>
            `;
            tabela.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar lista de usuários:", error);
    }
}

// Exclui o usuário no backend (database.db) e remove da tabela no front
async function deletarUsuario(userId, nome) {
    const confirmar = confirm(`Tem certeza que deseja apagar permanentemente o usuário "${nome}" do banco de dados?`);

    if (!confirmar) return;

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            // Remove a linha da tabela na interface imediatamente
            const linhaUsuario = document.getElementById(`user-${userId}`);
            if (linhaUsuario) {
                linhaUsuario.remove();
            }
            alert(`✅ Usuário "${nome}" foi removido com sucesso do banco de dados!`);
        } else {
            alert("❌ Erro ao excluir: " + (data.error || "Não foi possível apagar o usuário."));
        }
    } catch (error) {
        console.error("Erro ao enviar solicitação de exclusão:", error);
        alert("❌ Erro de conexão com o servidor ao tentar excluir o usuário.");
    }
}


// =================================================================
// FUNÇÕES DE LOGOUT
// =================================================================

function logoutUser() {
    sessionStorage.removeItem('isUserLoggedIn');
    sessionStorage.removeItem('userName');
    window.location.href = 'login.html';
}

function logout() { // Chamado pelo botão SAIR do dashboard do Administrador
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('adminName');
    window.location.href = 'login.html';
}


// =================================================================
// CARREGAMENTO E VERIFICAÇÃO DE PÁGINAS (DOM CONTENT LOADED)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 0. Inicializa os carrosséis presentes na página
    inicializarCarrosseis();
    // 0. Inicializa os carrosséis presentes na página
    inicializarCarrosseis();

    // 0.1 Carrega as cachoeiras cadastradas pelo painel administrativo (se a página tiver o container)
    carregarCachoeirasPublico();

    // 0.2 Carrega as trilhas cadastradas pelo painel administrativo (se a página tiver o container)
    carregarTrilhasPublico();

    // 0.3 Carrega os eventos cadastrados pelo painel administrativo (se a página tiver o grid)
    carregarEventosPublico();


    // Monitora a rolagem para exibir o botão de voltar ao topo
    window.addEventListener('scroll', verificarBotaoTopo);

    // Vincular evento de busca à barra de pesquisa em tempo real
    const searchInput = document.getElementById('searchInput') || document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', filterContent);
    }

    // 1. Inicia na tela de login de usuário ao abrir login.html
    if (document.getElementById('login-view')) {
        showUserLogin();
    }

    // 2. Lógica para a página do Dashboard (login-adm.html)
    const adminNameDisplay = document.getElementById('adminNameDisplay');
    if (adminNameDisplay) {
        const loggedIn = sessionStorage.getItem('isAdminLoggedIn');
        const adminName = sessionStorage.getItem('adminName');

        if (loggedIn === 'true' && adminName) {
            adminNameDisplay.textContent = adminName;
        } else {
            alert('Acesso negado! Por favor, faça login como Administrador.');
            window.location.href = 'login.html';
        }

        // Carrega automaticamente a lista de usuários do SQLite na primeira vez
        carregarUsuarios();

        // Alternar abas/seções no painel administrativo
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                document.querySelectorAll('.nav-menu a').forEach(item => item.classList.remove('active'));
                document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

                this.classList.add('active');
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) targetSection.classList.add('active');

                // 🚀 CARREGA OS USUÁRIOS SEMPRE QUE O ADMIN CLICAR NA ABA 'GESTAO DE USUARIOS':
                if (targetId === 'usuarios') {
                    carregarUsuarios();
                }
            });
        });
    }

    // 3. Lógica para Manter o Usuário Logado (Páginas: index.html, eventos.html, trilhas.html, etc.)
    const userNameDisplay = document.getElementById('userNameDisplay');
    const loginIcon = document.getElementById('loginIcon');
    const userGreeting = document.getElementById('userGreeting');

    const loggedInUser = sessionStorage.getItem('isUserLoggedIn');
    const userName = sessionStorage.getItem('userName');

    if (loggedInUser === 'true') {
        if (userNameDisplay) userNameDisplay.textContent = userName || "Usuário";
        if (loginIcon) loginIcon.style.display = 'none'; // Esconde o ícone simples de login
        if (userGreeting) userGreeting.style.display = 'inline-flex'; // Exibe a saudação + botão de sair
    }
});