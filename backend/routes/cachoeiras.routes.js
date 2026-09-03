const express = require('express');
const { requireAdmin } = require('../middleware/auth');

module.exports = (db) => {
    const router = express.Router();
    const proteger = requireAdmin(db);

    // Listar todas as cachoeiras (rota pública)
    router.get('/', async (req, res) => {
        try {
            const cachoeiras = await db.all(`SELECT * FROM cachoeiras ORDER BY id DESC`);
            const resultado = cachoeiras.map(c => ({
                ...c,
                imagens: JSON.parse(c.imagens || '[]'),
                dicas: JSON.parse(c.dicas || '[]'),
                horarios: JSON.parse(c.horarios || '[]')
            }));
            res.json(resultado);
        } catch (error) {
            console.error('Erro ao buscar cachoeiras:', error);
            res.status(500).json({ error: 'Erro ao buscar cachoeiras.' });
        }
    });

    // Buscar uma cachoeira específica (usada para editar, também pública)
    router.get('/:id', async (req, res) => {
        try {
            const cachoeira = await db.get(`SELECT * FROM cachoeiras WHERE id = ?`, [req.params.id]);
            if (!cachoeira) return res.status(404).json({ error: 'Cachoeira não encontrada.' });
            cachoeira.imagens = JSON.parse(cachoeira.imagens || '[]');
            cachoeira.dicas = JSON.parse(cachoeira.dicas || '[]');
            cachoeira.horarios = JSON.parse(cachoeira.horarios || '[]');
            res.json(cachoeira);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar cachoeira.' });
        }
    });

    // Cadastrar nova cachoeira — só administrador logado
    router.post('/', proteger, async (req, res) => {
        const {
            titulo, parque, descricao, localizacao, acesso, dificuldade, imagens, dicas, horarios,
            altitude_media, extensao_trilha, tempo_medio, tipo_atrativo, ambiente, destaque, estrutura, melhor_epoca
        } = req.body;

        if (!titulo || !descricao) {
            return res.status(400).json({ error: 'Preencha ao menos o título e a descrição.' });
        }

        try {
            const result = await db.run(
                `INSERT INTO cachoeiras (
                    titulo, parque, descricao, localizacao, acesso, dificuldade, imagens, dicas, horarios,
                    altitude_media, extensao_trilha, tempo_medio, tipo_atrativo, ambiente, destaque, estrutura, melhor_epoca
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    titulo,
                    parque || '',
                    descricao,
                    localizacao || '',
                    acesso || '',
                    dificuldade || '',
                    JSON.stringify(imagens || []),
                    JSON.stringify(dicas || []),
                    JSON.stringify(horarios || []),
                    altitude_media || '',
                    extensao_trilha || '',
                    tempo_medio || '',
                    tipo_atrativo || '',
                    ambiente || '',
                    destaque || '',
                    estrutura || '',
                    melhor_epoca || ''
                ]
            );
            res.status(201).json({ message: 'Cachoeira cadastrada com sucesso!', id: result.lastID });
        } catch (error) {
            console.error('Erro ao cadastrar cachoeira:', error);
            res.status(500).json({ error: 'Erro ao cadastrar cachoeira.' });
        }
    });

    // Editar cachoeira existente — só administrador logado
    router.put('/:id', proteger, async (req, res) => {
        const {
            titulo, parque, descricao, localizacao, acesso, dificuldade, imagens, dicas, horarios,
            altitude_media, extensao_trilha, tempo_medio, tipo_atrativo, ambiente, destaque, estrutura, melhor_epoca
        } = req.body;

        try {
            await db.run(
                `UPDATE cachoeiras SET
                    titulo = ?, parque = ?, descricao = ?, localizacao = ?, acesso = ?, dificuldade = ?, imagens = ?, dicas = ?, horarios = ?,
                    altitude_media = ?, extensao_trilha = ?, tempo_medio = ?, tipo_atrativo = ?, ambiente = ?, destaque = ?, estrutura = ?, melhor_epoca = ?
                 WHERE id = ?`,
                [
                    titulo,
                    parque || '',
                    descricao,
                    localizacao || '',
                    acesso || '',
                    dificuldade || '',
                    JSON.stringify(imagens || []),
                    JSON.stringify(dicas || []),
                    JSON.stringify(horarios || []),
                    altitude_media || '',
                    extensao_trilha || '',
                    tempo_medio || '',
                    tipo_atrativo || '',
                    ambiente || '',
                    destaque || '',
                    estrutura || '',
                    melhor_epoca || '',
                    req.params.id
                ]
            );
            res.json({ message: 'Cachoeira atualizada com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar cachoeira.' });
        }
    });

    // Excluir cachoeira — só administrador logado
    router.delete('/:id', proteger, async (req, res) => {
        try {
            const result = await db.run(`DELETE FROM cachoeiras WHERE id = ?`, [req.params.id]);
            if (result.changes === 0) {
                return res.status(404).json({ error: 'Cachoeira não encontrada.' });
            }
            res.json({ message: 'Cachoeira removida com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir cachoeira.' });
        }
    });

    return router;
};
