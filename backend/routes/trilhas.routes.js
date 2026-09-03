const express = require('express');
const { requireAdmin } = require('../middleware/auth');

module.exports = (db) => {
    const router = express.Router();
    const proteger = requireAdmin(db);

    // Listar todas as trilhas (rota pública, o site precisa exibi-las sem login)
    router.get('/', async (req, res) => {
        try {
            const trilhas = await db.all(`SELECT * FROM trilhas ORDER BY id DESC`);
            const resultado = trilhas.map(t => ({
                ...t,
                imagens: JSON.parse(t.imagens || '[]'),
                dicas: JSON.parse(t.dicas || '[]'),
                horarios: JSON.parse(t.horarios || '[]')
            }));
            res.json(resultado);
        } catch (error) {
            console.error('Erro ao buscar trilhas:', error);
            res.status(500).json({ error: 'Erro ao buscar trilhas.' });
        }
    });

    // Buscar uma trilha específica (usada para editar, também pública)
    router.get('/:id', async (req, res) => {
        try {
            const trilha = await db.get(`SELECT * FROM trilhas WHERE id = ?`, [req.params.id]);
            if (!trilha) return res.status(404).json({ error: 'Trilha não encontrada.' });
            trilha.imagens = JSON.parse(trilha.imagens || '[]');
            trilha.dicas = JSON.parse(trilha.dicas || '[]');
            trilha.horarios = JSON.parse(trilha.horarios || '[]');
            res.json(trilha);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar trilha.' });
        }
    });

    // Cadastrar nova trilha — só administrador logado
    router.post('/', proteger, async (req, res) => {
        const {
            titulo, parque, distancia, duracao, dificuldade, descricao, localizacao, acesso, imagens, dicas,
            altitude, tipo_atividade, ponto_final, ambiente_natural, sinalizacao, melhor_epoca, infraestrutura, administracao, indicacao, horarios
        } = req.body;

        if (!titulo || !descricao) {
            return res.status(400).json({ error: 'Preencha ao menos o título e a descrição.' });
        }

        try {
            const result = await db.run(
                `INSERT INTO trilhas (
                    titulo, parque, distancia, duracao, dificuldade, descricao, localizacao, acesso, imagens, dicas,
                    altitude, tipo_atividade, ponto_final, ambiente_natural, sinalizacao, melhor_epoca, infraestrutura, administracao, indicacao, horarios
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    titulo,
                    parque || '',
                    distancia || '',
                    duracao || '',
                    dificuldade || '',
                    descricao,
                    localizacao || '',
                    acesso || '',
                    JSON.stringify(imagens || []),
                    JSON.stringify(dicas || []),
                    altitude || '',
                    tipo_atividade || '',
                    ponto_final || '',
                    ambiente_natural || '',
                    sinalizacao || '',
                    melhor_epoca || '',
                    infraestrutura || '',
                    administracao || '',
                    indicacao || '',
                    JSON.stringify(horarios || [])
                ]
            );
            res.status(201).json({ message: 'Trilha cadastrada com sucesso!', id: result.lastID });
        } catch (error) {
            console.error('Erro ao cadastrar trilha:', error);
            res.status(500).json({ error: 'Erro ao cadastrar trilha.' });
        }
    });

    // Editar trilha existente — só administrador logado
    router.put('/:id', proteger, async (req, res) => {
        const {
            titulo, parque, distancia, duracao, dificuldade, descricao, localizacao, acesso, imagens, dicas,
            altitude, tipo_atividade, ponto_final, ambiente_natural, sinalizacao, melhor_epoca, infraestrutura, administracao, indicacao, horarios
        } = req.body;

        try {
            await db.run(
                `UPDATE trilhas SET
                    titulo = ?, parque = ?, distancia = ?, duracao = ?, dificuldade = ?, descricao = ?, localizacao = ?, acesso = ?, imagens = ?, dicas = ?,
                    altitude = ?, tipo_atividade = ?, ponto_final = ?, ambiente_natural = ?, sinalizacao = ?, melhor_epoca = ?, infraestrutura = ?, administracao = ?, indicacao = ?, horarios = ?
                 WHERE id = ?`,
                [
                    titulo,
                    parque || '',
                    distancia || '',
                    duracao || '',
                    dificuldade || '',
                    descricao,
                    localizacao || '',
                    acesso || '',
                    JSON.stringify(imagens || []),
                    JSON.stringify(dicas || []),
                    altitude || '',
                    tipo_atividade || '',
                    ponto_final || '',
                    ambiente_natural || '',
                    sinalizacao || '',
                    melhor_epoca || '',
                    infraestrutura || '',
                    administracao || '',
                    indicacao || '',
                    JSON.stringify(horarios || []),
                    req.params.id
                ]
            );
            res.json({ message: 'Trilha atualizada com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar trilha.' });
        }
    });

    // Excluir trilha — só administrador logado
    router.delete('/:id', proteger, async (req, res) => {
        try {
            const result = await db.run(`DELETE FROM trilhas WHERE id = ?`, [req.params.id]);
            if (result.changes === 0) {
                return res.status(404).json({ error: 'Trilha não encontrada.' });
            }
            res.json({ message: 'Trilha removida com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir trilha.' });
        }
    });

    return router;
};
