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
})();