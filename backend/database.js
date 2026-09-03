const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function connectDB() {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    // Cria tabela de Usuários e Administradores
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        );
    `);

    // Cria tabela para Conteúdos (Trilhas, Cachoeiras, Eventos)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT
        );
    `);

    // Cria tabela de Cachoeiras (cadastradas pelo painel administrativo)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS cachoeiras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            parque TEXT,
            descricao TEXT,
            localizacao TEXT,
            acesso TEXT,
            dificuldade TEXT,
            imagens TEXT,
            dicas TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Adiciona o campo de horário de funcionamento (caso a tabela já tenha sido criada antes desta atualização)
    try {
        await db.exec(`ALTER TABLE cachoeiras ADD COLUMN horarios TEXT`);
    } catch (error) {
        // Coluna já existe — pode ignorar com segurança
    }

    // Adiciona os campos extras da cachoeira (caso a tabela já tenha sido criada antes desta atualização)
    const colunasNovasCachoeira = [
        'altitude_media', 'extensao_trilha', 'tempo_medio', 'tipo_atrativo',
        'ambiente', 'destaque', 'estrutura', 'melhor_epoca'
    ];
    for (const coluna of colunasNovasCachoeira) {
        try {
            await db.exec(`ALTER TABLE cachoeiras ADD COLUMN ${coluna} TEXT`);
        } catch (error) {
            // Coluna já existe — pode ignorar com segurança
        }
    }

    // Cria tabela de Trilhas (cadastradas pelo painel administrativo)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS trilhas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            parque TEXT,
            distancia TEXT,
            duracao TEXT,
            dificuldade TEXT,
            descricao TEXT,
            localizacao TEXT,
            acesso TEXT,
            imagens TEXT,
            dicas TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Adiciona os campos extras da trilha (caso a tabela já tenha sido criada antes desta atualização)
    const colunasNovasTrilha = [
        'altitude', 'tipo_atividade', 'ponto_final', 'ambiente_natural',
        'sinalizacao', 'melhor_epoca', 'infraestrutura', 'administracao', 'indicacao', 'horarios'
    ];

    for (const coluna of colunasNovasTrilha) {
        try {
            await db.exec(`ALTER TABLE trilhas ADD COLUMN ${coluna} TEXT`);
        } catch (error) {
            // Coluna já existe — pode ignorar com segurança
        }
    }

    // Cria tabela de Eventos (cadastrados pelo painel administrativo)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            imagem TEXT,
            data_evento TEXT,
            local TEXT,
            descricao TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Cria tabela de Sessões (guarda o token de quem está logado como administrador)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            expira_em DATETIME NOT NULL
        );
    `);

    return db;
}

module.exports = connectDB;
