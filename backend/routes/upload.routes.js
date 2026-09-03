const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAdmin } = require('../middleware/auth');

module.exports = (db) => {
    const router = express.Router();
    const proteger = requireAdmin(db);

    // Garante que a pasta "img" existe dentro de frontend (dois níveis acima de routes/, + frontend/img)
    const pastaImagens = path.join(__dirname, '..', '..', 'frontend', 'img');
    if (!fs.existsSync(pastaImagens)) {
        fs.mkdirSync(pastaImagens, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, pastaImagens);
        },
        filename: (req, file, cb) => {
            // Evita nomes repetidos e espaços no nome do arquivo
            const nomeSeguro = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
            cb(null, nomeSeguro);
        }
    });

    const upload = multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // até 5MB por imagem
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Apenas arquivos de imagem são permitidos.'));
            }
        }
    });

    router.post('/', proteger, upload.single('imagem'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
        }
        // Retorna o caminho relativo, no mesmo formato usado nas trilhas/cachoeiras
        res.json({ url: `img/${req.file.filename}` });
    });

    return router;
};
