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
// Verifica se o usuário está logado antes de mostrar os detalhes de um evento
async function verDetalhesEvento(id) {
    const logado = sessionStorage.getItem('isUserLoggedIn') === 'true';

    if (!logado) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        sessionStorage.setItem('eventoPendente', id);
        await avisarEAguardar('Você precisa estar logado para ver os detalhes deste evento.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/eventos/${id}`);
        if (!response.ok) throw new Error('Evento não encontrado.');

        const evento = await response.json();
        mostrarDetalheEvento(evento);
    } catch (error) {
        console.error('Erro ao carregar detalhes do evento:', error);
        alert('Não foi possível carregar os detalhes desse evento.');
    }
}

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
                    <button type="button" class="evento-btn" onclick="verDetalhesEvento(${e.id})">Ver detalhes</button>
                </div>
            `;
                       grid.appendChild(card);
        });

        // Se a pessoa tinha tentado ver um evento antes de logar, reabre ele automaticamente agora
        const idPendente = sessionStorage.getItem('eventoPendente');
        if (idPendente) {
            sessionStorage.removeItem('eventoPendente');
            verDetalhesEvento(idPendente);
        }

    } catch (error) {
        console.error('Erro ao carregar eventos públicos:', error);
    }
}
// =================================================================
// 🧩 COMPONENTES DE TRILHAS E CACHOEIRAS (layout organizado)
// =================================================================
function atrativoCarrosselHtml(imagens, titulo) {
    if (!imagens || imagens.length === 0) return '';
    const slides = imagens.map(url => `<img src="${url}" alt="${titulo}" />`).join('');
    return `
        <div class="carousel" tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Fotos de ${titulo}">
            <div class="carousel-track">${slides}</div>
            <button type="button" class="carousel-btn prev" aria-label="Imagem anterior">&#10094;</button>
            <button type="button" class="carousel-btn next" aria-label="Próxima imagem">&#10095;</button>
        </div>`;
}

function atrativoParagrafosHtml(texto) {
    return (texto || '')
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

function atrativoNivelClasse(texto) {
    const t = (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (/leve|facil|baix/.test(t)) return 'nivel-leve';
    if (/moder|medi/.test(t)) return 'nivel-moderado';
    if (/alt|pesad|dific|extrem|forte/.test(t)) return 'nivel-alto';
    return '';
}

// itens: [{ rotulo, valor, icone, classe }] — itens sem valor não aparecem
function atrativoResumoHtml(itens) {
    const chips = itens
        .filter(i => i.valor && String(i.valor).trim())
        .map(i => `<div class="chip ${i.classe || ''}"><i class="${i.icone}"></i><span><small>${i.rotulo}</small>${i.valor}</span></div>`)
        .join('');
    return chips ? `<div class="atrativo-resumo">${chips}</div>` : '';
}

// pares: [[rotulo, valor], ...] — linhas sem valor não aparecem
function atrativoFichaHtml(pares) {
    const linhas = pares
        .filter(([, valor]) => valor && String(valor).trim())
        .map(([rotulo, valor]) => `<div class="ficha-linha"><dt>${rotulo}</dt><dd>${valor}</dd></div>`)
        .join('');
    return linhas
        ? `<aside class="atrativo-ficha"><h3>Características gerais</h3><dl class="ficha">${linhas}</dl></aside>`
        : '';
}

function atrativoListaHtml(titulo, icone, itens, classeLista) {
    if (!itens || itens.length === 0) return '';
    return `
        <div class="atrativo-bloco">
            <h3><i class="${icone}"></i> ${titulo}</h3>
            <ul class="${classeLista}">${itens.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>`;
}

function atrativoBlocoHtml({ titulo, rotuloSobre, carrossel, resumo, descricao, ficha, dicas, horarios }) {
    const sobre = descricao
        ? `<div class="atrativo-sobre"><h3>${rotuloSobre}</h3><div class="descricao-trilha">${descricao}</div></div>`
        : '';
    const corpo = (sobre || ficha) ? `<div class="atrativo-corpo">${sobre}${ficha}</div>` : '';
    const extras = (dicas || horarios) ? `<div class="atrativo-extras">${dicas}${horarios}</div>` : '';
    return `
        <div class="atrativo-head">
            <h2>${titulo}</h2>
            ${resumo}
        </div>
        ${carrossel}
        ${corpo}
        ${extras}
    `;
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
            const bloco = document.createElement('section');
            bloco.className = 'trilha-section';
            bloco.innerHTML = atrativoBlocoHtml({
                titulo: t.titulo,
                rotuloSobre: 'Sobre a trilha',
                carrossel: atrativoCarrosselHtml(t.imagens, t.titulo),
                resumo: atrativoResumoHtml([
                    { rotulo: 'Dificuldade', valor: t.dificuldade, icone: 'fa-solid fa-gauge-high', classe: atrativoNivelClasse(t.dificuldade) },
                    { rotulo: 'Extensão', valor: t.distancia, icone: 'fa-solid fa-route' },
                    { rotulo: 'Tempo médio', valor: t.duracao, icone: 'fa-regular fa-clock' },
                    { rotulo: 'Altitude', valor: t.altitude, icone: 'fa-solid fa-mountain' }
                ]),
                descricao: atrativoParagrafosHtml(t.descricao),
                ficha: atrativoFichaHtml([
                    ['Localização', t.localizacao],
                    ['Tipo de atividade', t.tipo_atividade],
                    ['Acesso', t.acesso],
                    ['Ponto final', t.ponto_final],
                    ['Ambiente natural', t.ambiente_natural],
                    ['Sinalização', t.sinalizacao],
                    ['Melhor época', t.melhor_epoca],
                    ['Infraestrutura', t.infraestrutura],
                    ['Administração', t.administracao],
                    ['Indicação', t.indicacao]
                ]),
                dicas: atrativoListaHtml('Dicas', 'fa-solid fa-lightbulb', t.dicas, 'dicas-lista'),
                horarios: atrativoListaHtml('Horário de funcionamento', 'fa-regular fa-clock', t.horarios, 'horarios-lista')
            });

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
            const bloco = document.createElement('section');
            bloco.className = 'trilha-section';
            bloco.innerHTML = atrativoBlocoHtml({
                titulo: c.titulo,
                rotuloSobre: 'Sobre a cachoeira',
                carrossel: atrativoCarrosselHtml(c.imagens, c.titulo),
                resumo: atrativoResumoHtml([
                    { rotulo: 'Dificuldade', valor: c.dificuldade, icone: 'fa-solid fa-gauge-high', classe: atrativoNivelClasse(c.dificuldade) },
                    { rotulo: 'Trilha de acesso', valor: c.extensao_trilha, icone: 'fa-solid fa-route' },
                    { rotulo: 'Tempo médio', valor: c.tempo_medio, icone: 'fa-regular fa-clock' },
                    { rotulo: 'Altitude média', valor: c.altitude_media, icone: 'fa-solid fa-mountain' }
                ]),
                descricao: atrativoParagrafosHtml(c.descricao),
                ficha: atrativoFichaHtml([
                    ['Localização', c.localizacao],
                    ['Tipo de atrativo', c.tipo_atrativo],
                    ['Acesso', c.acesso],
                    ['Ambiente', c.ambiente],
                    ['Destaque', c.destaque],
                    ['Estrutura de apoio', c.estrutura],
                    ['Melhor época', c.melhor_epoca]
                ]),
                dicas: atrativoListaHtml('Dicas', 'fa-solid fa-lightbulb', c.dicas, 'dicas-lista'),
                horarios: atrativoListaHtml('Horário de funcionamento', 'fa-regular fa-clock', c.horarios, 'horarios-lista')
            });

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
        [containerTresPicos, containerSerraOrgaos, containerOutras].filter(Boolean).forEach(el => {
            el.innerHTML = '<p class="descricao-trilha">Não foi possível carregar as cachoeiras no momento.</p>';
        });
    }
}
function inicializarCarrosseis() {
    const INTERVALO = 5000; // troca de foto a cada 5 segundos
    const reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.carousel').forEach((carousel) => {
        if (carousel.dataset.iniciado === 'true') return; // evita ligar os eventos duas vezes

        const track = carousel.querySelector('.carousel-track');
        const images = carousel.querySelectorAll('.carousel-track img');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');

        if (!track || images.length === 0) return;
        carousel.dataset.iniciado = 'true';

        const total = images.length;

        // Com uma única foto não há o que alternar
        if (total === 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        let atual = 0;
        let timer = null;
        let pausado = false;
        let visivel = true;

        // Indicadores (bolinhas) e contador
        const dots = document.createElement('div');
        dots.className = 'carousel-dots';
        const contador = document.createElement('span');
        contador.className = 'carousel-contador';
        contador.setAttribute('aria-hidden', 'true');

        images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Ir para a imagem ${i + 1}`);
            dot.addEventListener('click', () => { irPara(i); reiniciar(); });
            dots.appendChild(dot);
        });
        carousel.appendChild(dots);
        carousel.appendChild(contador);

        function irPara(indice) {
            atual = (indice + total) % total;
            track.style.transform = `translateX(-${atual * 100}%)`;
            Array.from(dots.children).forEach((d, i) => d.classList.toggle('ativo', i === atual));
            contador.textContent = `${atual + 1} / ${total}`;
        }

        function parar() { clearInterval(timer); timer = null; }

        function iniciar() {
            if (reduzMovimento || timer || pausado || !visivel || document.hidden) return;
            timer = setInterval(() => irPara(atual + 1), INTERVALO);
        }

        function reiniciar() { parar(); iniciar(); }

        if (prevBtn) prevBtn.addEventListener('click', () => { irPara(atual - 1); reiniciar(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { irPara(atual + 1); reiniciar(); });

        // Pausa enquanto o mouse está em cima (para dar tempo de olhar a foto)
        carousel.addEventListener('mouseenter', () => { pausado = true; parar(); });
        carousel.addEventListener('mouseleave', () => { pausado = false; iniciar(); });

        // Navegação por teclado (setas) — pausa só quando o foco veio do teclado
        carousel.addEventListener('focusin', (e) => {
            if (e.target.matches(':focus-visible')) { pausado = true; parar(); }
        });
        carousel.addEventListener('focusout', () => { pausado = false; iniciar(); });
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { irPara(atual - 1); reiniciar(); }
            if (e.key === 'ArrowRight') { irPara(atual + 1); reiniciar(); }
        });

        // Deslizar o dedo no celular
        let inicioX = null;
        carousel.addEventListener('touchstart', (e) => { inicioX = e.touches[0].clientX; parar(); }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            if (inicioX !== null) {
                const delta = e.changedTouches[0].clientX - inicioX;
                if (Math.abs(delta) > 40) irPara(delta < 0 ? atual + 1 : atual - 1);
            }
            inicioX = null;
            iniciar();
        });

        // Só avança sozinho quando o carrossel está na tela e a aba está ativa
        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entradas) => {
                visivel = entradas[0].isIntersecting;
                visivel ? iniciar() : parar();
            }, { threshold: 0.3 }).observe(carousel);
        }
        document.addEventListener('visibilitychange', () => { document.hidden ? parar() : iniciar(); });

        irPara(0);
        iniciar();
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
            // Partes internas de um cartão de trilha/cachoeira não são escondidas isoladamente
            if (item.closest('.trilha-section') && !item.classList.contains('trilha-section')) {
                return;
            }
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
      const emailEl = document.getElementById('registerEmail');
      const passEl = document.getElementById('registerPass');

    if (!nameEl || !emailEl || !passEl) return;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass = passEl.value.trim();

    if (!name || !email || !pass) {
        alert("Por favor, preencha todos os campos para realizar a solicitação.");
        return;
    }

    if (!isEmailValido(email)) {
        alert("Por favor, digite um e-mail válido (ex: nome@exemplo.com).");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/solicitacoes-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass })
        });
        const data = await response.json();

                if (response.ok) {
            alert(data.message || "Solicitação enviada! Aguarde a aprovação de um administrador.");
               nameEl.value = '';
               emailEl.value = '';
               passEl.value = '';
            showAdminLogin();
        } else {
                alert("❌ " + (data.error || "Não foi possível enviar a solicitação."));
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

            // Volta para a página em que a pessoa estava antes de precisar logar (se houver), senão vai para o index.html
            const destino = sessionStorage.getItem('redirectAfterLogin') || 'index.html';
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = destino;
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
    
// Permite logar apertando Enter, tanto no login de usuário quanto no de administrador
    
   function ativarEnterParaLogar(idCampo1, idCampo2, funcaoLogin) {
        [idCampo1, idCampo2].forEach(id => {
            const campo = document.getElementById(id);
            if (!campo) return;
            campo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    funcaoLogin();
                }
            });
        });
    }

    ativarEnterParaLogar('userLoginUser', 'userLoginPass', loginUser);
    ativarEnterParaLogar('loginUser', 'loginPass', loginAdmin);
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
        const nomeCompleto = (userName || "Usuário").trim();
        const primeiroNome = nomeCompleto.split(/\s+/)[0];
        if (userNameDisplay) userNameDisplay.textContent = primeiroNome;
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) userAvatar.textContent = primeiroNome.charAt(0).toUpperCase();
        if (userGreeting) userGreeting.title = nomeCompleto;
        if (loginIcon) loginIcon.style.display = 'none'; // Esconde o ícone simples de login
        if (userGreeting) userGreeting.style.display = 'inline-flex'; // Exibe a saudação + botão de sair
    }
});