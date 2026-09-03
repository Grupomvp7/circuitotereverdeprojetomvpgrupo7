const express = require('express');
const { requireAdmin } = require('../middleware/auth');

module.exports = (db) => {
    const router = express.Router();
    const proteger = requireAdmin(db);

    // Listar todos os eventos (rota pública)
    router.get('/', async (req, res) => {
        try {
            const eventos = await db.all(`SELECT * FROM eventos ORDER BY id DESC`);
            res.json(eventos);
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            res.status(500).json({ error: 'Erro ao buscar eventos.' });
        }
    });

    // Buscar um evento específico (usado para editar, também público)
    router.get('/:id', async (req, res) => {
        try {
            const evento = await db.get(`SELECT * FROM eventos WHERE id = ?`, [req.params.id]);
            if (!evento) return res.status(404).json({ error: 'Evento não encontrado.' });
            res.json(evento);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar evento.' });
        }
    });

    // Cadastrar novo evento — só administrador logado
    router.post('/', proteger, async (req, res) => {
        const { titulo, imagem, data_evento, local, descricao } = req.body;

        if (!titulo || !descricao) {
            return res.status(400).json({ error: 'Preencha ao menos o título e a descrição.' });
        }

        try {
            const result = await db.run(
                `INSERT INTO eventos (titulo, imagem, data_evento, local, descricao) VALUES (?, ?, ?, ?, ?)`,
                [titulo, imagem || '', data_evento || '', local || '', descricao]
            );
            res.status(201).json({ message: 'Evento cadastrado com sucesso!', id: result.lastID });
        } catch (error) {
            console.error('Erro ao cadastrar evento:', error);
            res.status(500).json({ error: 'Erro ao cadastrar evento.' });
        }
    });

    // Editar evento existente — só administrador logado
    router.put('/:id', proteger, async (req, res) => {
        const { titulo, imagem, data_evento, local, descricao } = req.body;

        try {
            await db.run(
                `UPDATE eventos SET titulo = ?, imagem = ?, data_evento = ?, local = ?, descricao = ? WHERE id = ?`,
                [titulo, imagem || '', data_evento || '', local || '', descricao, req.params.id]
            );
            res.json({ message: 'Evento atualizado com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar evento.' });
        }
    });

    // Excluir evento — só administrador logado
    router.delete('/:id', proteger, async (req, res) => {
        try {
            const result = await db.run(`DELETE FROM eventos WHERE id = ?`, [req.params.id]);
            if (result.changes === 0) {
                return res.status(404).json({ error: 'Evento não encontrado.' });
            }
            res.json({ message: 'Evento removido com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir evento.' });
        }
    });

    return router;
};
