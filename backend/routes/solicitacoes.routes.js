const express = require('express');
const bcrypt = require('bcryptjs');
const { requireAdmin } = require('../middleware/auth');

module.exports = (db) => {
    const router = express.Router();
    const proteger = requireAdmin(db);

    // Criar uma solicitação de acesso administrativo (rota pública)
    router.post('/', async (req, res) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailValido) {
            return res.status(400).json({ error: 'Informe um e-mail em formato válido (ex: nome@exemplo.com).' });
        }

        try {
            const usuarioExistente = await db.get(`SELECT id FROM users WHERE email = ?`, [email]);
            if (usuarioExistente) {
                return res.status(400).json({ error: 'Esse e-mail já está cadastrado no sistema.' });
            }

            const solicitacaoExistente = await db.get(
                `SELECT id FROM solicitacoes_admin WHERE email = ? AND status = 'pendente'`,
                [email]
            );
            if (solicitacaoExistente) {
                return res.status(400).json({ error: 'Já existe uma solicitação pendente com esse e-mail.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.run(
                `INSERT INTO solicitacoes_admin (name, email, password, status) VALUES (?, ?, ?, 'pendente')`,
                [name, email, hashedPassword]
            );

            res.status(201).json({ message: 'Solicitação enviada! Um administrador precisa aprovar seu acesso antes que você possa entrar.' });
        } catch (error) {
            console.error('Erro ao criar solicitação de administrador:', error);
            res.status(500).json({ error: 'Erro ao enviar a solicitação.' });
        }
    });

    // Listar solicitações pendentes — só administrador logado
    router.get('/', proteger, async (req, res) => {
        try {
            const solicitacoes = await db.all(
                `SELECT id, name, email, status, criado_em FROM solicitacoes_admin WHERE status = 'pendente' ORDER BY criado_em ASC`
            );
            res.json(solicitacoes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar solicitações.' });
        }
    });

    // Aprovar uma solicitação — só administrador logado
    router.post('/:id/aprovar', proteger, async (req, res) => {
        try {
            const solicitacao = await db.get(`SELECT * FROM solicitacoes_admin WHERE id = ?`, [req.params.id]);
            if (!solicitacao) return res.status(404).json({ error: 'Solicitação não encontrada.' });

            await db.run(
                `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')`,
                [solicitacao.name, solicitacao.email, solicitacao.password]
            );

            await db.run(`UPDATE solicitacoes_admin SET status = 'aprovado' WHERE id = ?`, [req.params.id]);

            res.json({ message: 'Solicitação aprovada! O novo administrador já pode fazer login.' });
        } catch (error) {
            console.error('Erro ao aprovar solicitação:', error);
            res.status(500).json({ error: 'Erro ao aprovar. Verifique se esse e-mail já não virou usuário por outro caminho.' });
        }
    });

    // Rejeitar uma solicitação — só administrador logado
    router.post('/:id/rejeitar', proteger, async (req, res) => {
        try {
            const result = await db.run(`UPDATE solicitacoes_admin SET status = 'rejeitado' WHERE id = ?`, [req.params.id]);
            if (result.changes === 0) return res.status(404).json({ error: 'Solicitação não encontrada.' });
            res.json({ message: 'Solicitação rejeitada.' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao rejeitar a solicitação.' });
        }
    });

    return router;
};