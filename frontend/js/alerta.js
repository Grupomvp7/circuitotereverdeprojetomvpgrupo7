// Substitui o alert() padrão do navegador por um aviso bonito, no estilo do site.
// Basta carregar este arquivo nas páginas: todos os alert() existentes passam a usar o novo visual.
(function () {
    const estilo = document.createElement('style');
    estilo.textContent = `
        .alerta-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(8, 20, 12, 0.62);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            animation: alertaFundo 0.18s ease;
            transition: opacity 0.18s ease;
        }
        .alerta-overlay.alerta-saindo { opacity: 0; }

        .alerta-caixa {
            width: 100%;
            max-width: 400px;
            padding: 32px 28px 26px;
            text-align: center;
            color: #ffffff;
            background: linear-gradient(160deg, #1d3f26, #0e2417);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-top: 4px solid #f4a261;
            border-radius: 18px;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
            font-family: 'Inter', 'Poppins', sans-serif;
            animation: alertaEntrada 0.25s ease;
        }
        .alerta-caixa.alerta-erro { border-top-color: #e5484d; }
        .alerta-caixa.alerta-sucesso { border-top-color: #6aa84f; }

        .alerta-icone {
            width: 68px;
            height: 68px;
            margin: 0 auto 16px auto;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
        }
        .alerta-aviso .alerta-icone {
            color: #f4a261;
            background: rgba(244, 162, 97, 0.16);
            box-shadow: 0 0 0 1px rgba(244, 162, 97, 0.35), 0 0 28px rgba(244, 162, 97, 0.25);
        }
        .alerta-erro .alerta-icone {
            color: #ff7b7b;
            background: rgba(229, 72, 77, 0.16);
            box-shadow: 0 0 0 1px rgba(255, 123, 123, 0.35), 0 0 28px rgba(229, 72, 77, 0.25);
        }
        .alerta-sucesso .alerta-icone {
            color: #8fdc9a;
            background: rgba(79, 121, 66, 0.3);
            box-shadow: 0 0 0 1px rgba(143, 220, 154, 0.35), 0 0 28px rgba(79, 121, 66, 0.4);
        }

        .alerta-titulo {
            margin: 0 0 8px 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: #ffffff;
        }
        .alerta-mensagem {
            margin: 0 0 24px 0;
            font-size: 0.98rem;
            line-height: 1.5;
            color: #dcebdd;
        }
        .alerta-botao {
            width: auto;
            margin: 0;
            padding: 12px 38px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #f4a261, #e08a3e);
            color: #1b1b1b;
            font-family: inherit;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(244, 162, 97, 0.3);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
                .alerta-botao:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 26px rgba(244, 162, 97, 0.42);
        }

        .alerta-botoes {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        .alerta-botao-secundario {
            background: transparent;
            color: #dcebdd;
            border: 1px solid rgba(255, 255, 255, 0.25);
            box-shadow: none;
        }
        .alerta-botao-secundario:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-2px);
            box-shadow: none;
        }
        .alerta-botao-perigo {
            background: linear-gradient(135deg, #e5484d, #c62828);
            color: #ffffff;
            box-shadow: 0 8px 20px rgba(229, 72, 77, 0.35);
        }
        .alerta-botao-perigo:hover {
            box-shadow: 0 12px 26px rgba(229, 72, 77, 0.45);
        }

                .evento-detalhe-caixa {
            max-width: 480px;
            text-align: left;
            position: relative;
        }
        .evento-detalhe-caixa .alerta-titulo,
        .evento-detalhe-caixa .alerta-mensagem {
            text-align: left;
        }
        .evento-detalhe-fechar {
            position: absolute;
            top: 14px;
            right: 14px;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            font-size: 1.3rem;
            line-height: 1;
            cursor: pointer;
        }
        .evento-detalhe-fechar:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        .evento-detalhe-img {
            width: 100%;
            height: 180px;
            border-radius: 12px;
            background-size: cover;
            background-position: center;
            margin-bottom: 16px;
        }
        .evento-detalhe-meta {
            display: flex;
            gap: 18px;
            flex-wrap: wrap;
            margin-bottom: 14px;
            font-size: 0.85rem;
            color: #b9dabc;
        }
        .evento-detalhe-meta i {
            color: #f4a261;
            margin-right: 6px;
        }

        @keyframes alertaFundo {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes alertaEntrada {
            from { opacity: 0; transform: translateY(14px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(estilo);

    const fila = [];
    let aberto = false;

    // Descobre o tipo do aviso pelo conteúdo da mensagem
    function detectarTipo(mensagem) {
        const texto = mensagem.toLowerCase();
        if (mensagem.includes('❌') || /erro|inválid|incorret|não foi possível|não encontrad|falha|já cadastrad|não autorizado|expirad/.test(texto)) {
            return 'erro';
        }
        if (mensagem.includes('✅') || /sucesso|bem-vindo|encerrada/.test(texto)) {
            return 'sucesso';
        }
        return 'aviso';
    }

    function mostrarProximo() {
        if (aberto || fila.length === 0) return;
        aberto = true;

        const mensagem = fila.shift();
        const tipo = detectarTipo(mensagem);
        // Remove o emoji do começo do texto, já que agora existe um ícone próprio
        const texto = mensagem.replace(/^[\s\u274C\u2705\u26A0\uFE0F\u2757]+/, '');

        const icones = { erro: 'fa-times-circle', sucesso: 'fa-check-circle', aviso: 'fa-exclamation-triangle' };
        const titulos = { erro: 'Ops, algo deu errado', sucesso: 'Tudo certo!', aviso: 'Atenção' };

        const overlay = document.createElement('div');
        overlay.className = 'alerta-overlay';
        overlay.innerHTML = `
            <div class="alerta-caixa alerta-${tipo}" role="alertdialog" aria-modal="true">
                <div class="alerta-icone"><i class="fas ${icones[tipo]}"></i></div>
                <h3 class="alerta-titulo">${titulos[tipo]}</h3>
                <p class="alerta-mensagem"></p>
                <button type="button" class="alerta-botao">OK</button>
            </div>
        `;
        overlay.querySelector('.alerta-mensagem').textContent = texto;
        document.body.appendChild(overlay);

        const botao = overlay.querySelector('.alerta-botao');
        let fechado = false;

        function fechar() {
            if (fechado) return;
            fechado = true;
            document.removeEventListener('keydown', aoTeclar, true);
            overlay.classList.add('alerta-saindo');
            setTimeout(function () {
                overlay.remove();
                aberto = false;
                mostrarProximo();
            }, 180);
        }

        function aoTeclar(e) {
            if (e.key === 'Escape' || e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                fechar();
            }
        }

        botao.addEventListener('click', fechar);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) fechar();
        });
        document.addEventListener('keydown', aoTeclar, true);
        botao.focus();
    }

        // Troca o alert() padrão do navegador pelo novo
    window.alert = function (mensagem) {
        fila.push(String(mensagem === undefined ? '' : mensagem));
        mostrarProximo();
    };

            // Mostra um aviso e só continua o código depois que a pessoa clicar OK
    // (diferente do alert(), que não espera nada)
    window.avisarEAguardar = function (mensagem) {
        return new Promise(function (resolve) {
            const tipo = detectarTipo(mensagem);
            const texto = mensagem.replace(/^[\s\u274C\u2705\u26A0\uFE0F\u2757]+/, '');

            const icones = { erro: 'fa-times-circle', sucesso: 'fa-check-circle', aviso: 'fa-exclamation-triangle' };
            const titulos = { erro: 'Ops, algo deu errado', sucesso: 'Tudo certo!', aviso: 'Atenção' };

            const overlay = document.createElement('div');
            overlay.className = 'alerta-overlay';
            overlay.innerHTML = `
                <div class="alerta-caixa alerta-${tipo}" role="alertdialog" aria-modal="true">
                    <div class="alerta-icone"><i class="fas ${icones[tipo]}"></i></div>
                    <h3 class="alerta-titulo">${titulos[tipo]}</h3>
                    <p class="alerta-mensagem"></p>
                    <button type="button" class="alerta-botao">OK</button>
                </div>
            `;
            overlay.querySelector('.alerta-mensagem').textContent = texto;
            document.body.appendChild(overlay);

            const botao = overlay.querySelector('.alerta-botao');
            let fechado = false;

            function fechar() {
                if (fechado) return;
                fechado = true;
                document.removeEventListener('keydown', aoTeclar, true);
                overlay.classList.add('alerta-saindo');
                setTimeout(function () {
                    overlay.remove();
                    resolve();
                }, 180);
            }

            function aoTeclar(e) {
                if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); fechar(); }
            }

            botao.addEventListener('click', fechar);
            overlay.addEventListener('click', function (e) { if (e.target === overlay) fechar(); });
            document.addEventListener('keydown', aoTeclar, true);
            botao.focus();
        });
    };

    // Mostra os detalhes completos de um evento num cartão, no estilo do site
    window.mostrarDetalheEvento = function (evento) {
        const overlay = document.createElement('div');
        overlay.className = 'alerta-overlay';
        overlay.innerHTML = `
            <div class="alerta-caixa evento-detalhe-caixa" role="dialog" aria-modal="true">
                <button type="button" class="evento-detalhe-fechar" aria-label="Fechar">&times;</button>
                <div class="evento-detalhe-img" style="background-image: url('${evento.imagem || 'img/eventosq.jpeg'}')"></div>
                <h3 class="alerta-titulo"></h3>
                <div class="evento-detalhe-meta">
                    <span><i class="fa-solid fa-calendar-day"></i></span>
                    <span><i class="fa-solid fa-location-dot"></i></span>
                </div>
                <p class="alerta-mensagem"></p>
                <button type="button" class="alerta-botao">Fechar</button>
            </div>
        `;
        overlay.querySelector('.alerta-titulo').textContent = evento.titulo || '';
        overlay.querySelectorAll('.evento-detalhe-meta span')[0].append(evento.data_evento || 'Data a definir');
        overlay.querySelectorAll('.evento-detalhe-meta span')[1].append(evento.local || 'Local a definir');
        overlay.querySelector('.alerta-mensagem').textContent = evento.descricao || '';
        document.body.appendChild(overlay);

        function fechar() {
            overlay.classList.add('alerta-saindo');
            setTimeout(() => overlay.remove(), 180);
            document.removeEventListener('keydown', aoTeclar, true);
        }
        function aoTeclar(e) {
            if (e.key === 'Escape') fechar();
        }

        overlay.querySelector('.evento-detalhe-fechar').addEventListener('click', fechar);
        overlay.querySelector('.alerta-botao').addEventListener('click', fechar);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
        document.addEventListener('keydown', aoTeclar, true);
    };

    // Janela de confirmação bonita, no lugar do confirm() nativo do navegador.
    // Diferente do alert(), essa função precisa ser usada com "await" (ela retorna uma Promise).
    window.confirmarExclusao = function (mensagem) {
        return new Promise(function (resolve) {
            const overlay = document.createElement('div');
            overlay.className = 'alerta-overlay';
            overlay.innerHTML = `
                <div class="alerta-caixa alerta-erro" role="alertdialog" aria-modal="true">
                    <div class="alerta-icone"><i class="fas fa-trash-alt"></i></div>
                    <h3 class="alerta-titulo">Confirmar exclusão</h3>
                    <p class="alerta-mensagem"></p>
                    <div class="alerta-botoes">
                        <button type="button" class="alerta-botao alerta-botao-secundario">Cancelar</button>
                        <button type="button" class="alerta-botao alerta-botao-perigo">Excluir</button>
                    </div>
                </div>
            `;
            overlay.querySelector('.alerta-mensagem').textContent = mensagem;
            document.body.appendChild(overlay);

            const btnCancelar = overlay.querySelector('.alerta-botao-secundario');
            const btnConfirmar = overlay.querySelector('.alerta-botao-perigo');
            let resolvido = false;

            function fechar(resultado) {
                if (resolvido) return;
                resolvido = true;
                document.removeEventListener('keydown', aoTeclar, true);
                overlay.classList.add('alerta-saindo');
                setTimeout(function () {
                    overlay.remove();
                    resolve(resultado);
                }, 180);
            }

            function aoTeclar(e) {
                if (e.key === 'Escape') { e.preventDefault(); fechar(false); }
                if (e.key === 'Enter') { e.preventDefault(); fechar(true); }
            }

            btnCancelar.addEventListener('click', function () { fechar(false); });
            btnConfirmar.addEventListener('click', function () { fechar(true); });
            overlay.addEventListener('click', function (e) { if (e.target === overlay) fechar(false); });
            document.addEventListener('keydown', aoTeclar, true);
            btnConfirmar.focus();
        });
    };
})();