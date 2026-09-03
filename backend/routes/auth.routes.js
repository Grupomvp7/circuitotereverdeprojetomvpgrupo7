const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { requireAdmin } = require('../middleware/auth');

// Este arquivo recebe a conexão "db" já pronta e devolve um conjunto de rotas
// (Router do Express) para autenticação e gestão de usuários.
module.exports = (db) => {
    const router = express.Router();
    const proteger = requireAdmin(db);

        // ================= ROTA DE CADASTRO =================
    router.post('/register', async (req, res) => {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailValido) {
            return res.status(400).json({ error: 'Informe um e-mail em formato válido (ex: nome@exemplo.com).' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.run(
                `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
                [name, email, hashedPassword, role || 'user']
            );
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro no cadastro:', error);
            res.status(400).json({ error: 'E-mail ou usuário já cadastrado.' });
        }
    });

    // ================= ROTA DE LOGIN =================
    router.post('/login', async (req, res) => {
        const { userOrEmail, password } = req.body;

        if (!userOrEmail || !password) {
            return res.status(400).json({ error: 'Informe o usuário/e-mail e a senha.' });
        }

        try {
            const user = await db.get(
                `SELECT * FROM users WHERE email = ? OR name = ?`,
                [userOrEmail, userOrEmail]
            );

            if (!user) {
                return res.status(400).json({ error: 'Usuário não encontrado.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Senha incorreta.' });
            }

            // Se for administrador, gera um token de sessão temporário (válido por 8 horas)
            let token = null;
            if (user.role === 'admin') {
                token = crypto.randomBytes(32).toString('hex');
                const expira = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
                await db.run(
                    `INSERT INTO sessions (token, user_id, role, expira_em) VALUES (?, ?, ?, ?)`,
                    [token, user.id, user.role, expira]
                );
            }

            res.json({
                message: 'Login realizado com sucesso!',
                user: { id: user.id, name: user.name, role: user.role },
                token
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro ao processar o login.' });
        }
    });

    // ================= ROTA PARA LISTAR USUÁRIOS =================
    router.get('/users', proteger, async (req, res) => {
        try {
            const users = await db.all(
                `SELECT id, name, email, role FROM users ORDER BY id DESC`
            );
            res.json(users);
        } catch (error) {
            console.error('❌ Erro detalhado no banco de dados ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro ao buscar a lista de usuários.', detalhe: error.message });
        }
    });

    // ================= ROTA PARA EXCLUIR USUÁRIO =================
    router.delete('/users/:id', proteger, async (req, res) => {
        const { id } = req.params;

        try {
            const result = await db.run(`DELETE FROM users WHERE id = ?`, [id]);

            if (result.changes === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json({ message: 'Usuário removido com sucesso!' });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ error: 'Erro ao excluir o usuário do banco.' });
        }
    });

    // ================= VERIFICAR SE A SESSÃO DE ADMIN AINDA É VÁLIDA =================
    router.get('/verify-admin', async (req, res) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({ error: 'Token não informado.' });
        }

        try {
            const sessao = await db.get(
                `SELECT s.*, u.name FROM sessions s JOIN users u ON u.id = s.user_id
                 WHERE s.token = ? AND s.role = 'admin' AND s.expira_em > datetime('now')`,
                [token]
            );

            if (!sessao) {
                return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
            }

            res.json({ ok: true, name: sessao.name });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao verificar sessão.' });
        }
    });

    // ================= LOGOUT =================
    router.post('/logout', async (req, res) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (token) {
            try {
                await db.run(`DELETE FROM sessions WHERE token = ?`, [token]);
            } catch (error) {
                // Ignora erro ao limpar sessão
            }
        }

        res.json({ message: 'Sessão encerrada.' });
    });

    return router;
};
