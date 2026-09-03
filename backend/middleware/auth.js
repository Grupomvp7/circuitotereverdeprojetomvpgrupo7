// Este middleware protege rotas que só o administrador logado pode usar.
// Ele verifica se veio um token válido no cabeçalho "Authorization: Bearer <token>"
// e se esse token corresponde a uma sessão de administrador ainda não expirada.
function requireAdmin(db) {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({ error: 'Acesso não autorizado. Faça login como administrador.' });
        }

        try {
            const sessao = await db.get(
                `SELECT * FROM sessions WHERE token = ? AND role = 'admin' AND expira_em > datetime('now')`,
                [token]
            );

            if (!sessao) {
                return res.status(401).json({ error: 'Sessão inválida ou expirada. Faça login novamente.' });
            }

            req.admin = { id: sessao.user_id };
            next();
        } catch (error) {
            console.error('Erro ao verificar sessão de administrador:', error);
            res.status(500).json({ error: 'Erro ao verificar autenticação.' });
        }
    };
}

module.exports = { requireAdmin };
