const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Serve as páginas HTML na raiz do site (ex: http://localhost:3000/trilhas.html)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'pages')));

// Serve o CSS e o JS também na raiz, para que <link href="styles.css">
// e <script src="script.js"> continuem funcionando sem precisar mudar nada nos HTMLs
app.use(express.static(path.join(__dirname, '..', 'frontend', 'css')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'js')));

// Serve as imagens no caminho "/img/...", igual já era usado em todo o projeto
app.use('/img', express.static(path.join(__dirname, '..', 'frontend', 'img')));

const PORT = 3000;

async function iniciarServidor() {
    try {
        // Conecta ao banco SQLite antes de registrar qualquer rota
        const db = await connectDB();
        console.log('✅ Banco de dados SQLite conectado com sucesso!');

        // Registra as rotas da API, cada uma em seu próprio arquivo dentro de routes/
        app.use('/api', require('./routes/auth.routes')(db));
        app.use('/api/trilhas', require('./routes/trilhas.routes')(db));
        app.use('/api/cachoeiras', require('./routes/cachoeiras.routes')(db));
        app.use('/api/eventos', require('./routes/eventos.routes')(db));
        app.use('/api/upload', require('./routes/upload.routes')(db));

        app.listen(PORT, () => {
            console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    }
}

iniciarServidor();
