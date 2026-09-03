# 🌿 Circuito Terê Verde

## 📖 Sobre o Projeto

O **Circuito Terê Verde** é uma plataforma digital desenvolvida com o objetivo de facilitar o acesso de moradores e visitantes às belezas naturais, atividades de ecoturismo e eventos de **Teresópolis (RJ)**.

A proposta é centralizar informações sobre os principais atrativos naturais do município, permitindo que o usuário encontre dados importantes para planejar suas atividades de forma mais prática, segura e consciente.

O projeto contempla informações relacionadas a:

- 🌳 Trilhas
- 💧 Cachoeiras
- 🏞️ Parques naturais
- 📅 Eventos culturais e ecológicos
- 🔎 Busca de conteúdos
- 👤 Cadastro e autenticação de usuários
- 🔐 Painel administrativo para gerenciamento do sistema

### 🏞️ Unidades de Conservação

O portal contempla atrativos localizados em importantes áreas naturais de Teresópolis, incluindo:

- **Parque Estadual dos Três Picos**
- **Parque Nacional da Serra dos Órgãos (PARNASO)**
- **Parque Natural Municipal Montanhas de Teresópolis**

---

# 🎯 Objetivo do Projeto

O principal objetivo do **Circuito Terê Verde** é criar uma **solução digital centralizada** para facilitar o acesso a informações sobre parques, trilhas, cachoeiras e eventos de Teresópolis.

A plataforma busca contribuir para:

- 🌿 Incentivar o turismo sustentável;
- 🏕️ Facilitar o planejamento de atividades ao ar livre;
- 🧭 Centralizar informações turísticas e ambientais;
- 🛡️ Promover atividades de ecoturismo de maneira mais segura;
- 🌎 Estimular a conscientização ambiental;
- 📢 Divulgar eventos culturais e ecológicos da região;
- 🤝 Aproximar visitantes, moradores, instituições ambientais e organizadores de eventos.

---

# 👥 Público-Alvo

O **Circuito Terê Verde** é destinado principalmente a:

### 🏕️ Turistas

Visitantes que chegam a Teresópolis em busca de atividades de ecoturismo, lazer, aventura e contato com a natureza.

### 🌿 Moradores locais

Pessoas que desejam conhecer melhor os atrativos naturais, atividades sustentáveis e eventos realizados na cidade.

### 🧗 Praticantes de atividades ao ar livre

Pessoas interessadas em:

- Trilhas;
- Montanhismo;
- Caminhadas;
- Ecoturismo;
- Esportes ao ar livre;
- Atividades relacionadas à natureza.

### 🏞️ Gestores e instituições

Gestores públicos, instituições ambientais e responsáveis por unidades de conservação que tenham interesse na divulgação e organização das informações relacionadas aos atrativos naturais.

### 📅 Organizadores de eventos

Pessoas e instituições responsáveis por eventos culturais, ambientais e ecológicos realizados no município.

---

# ⚡ Dores do Público-Alvo

Durante a definição do projeto, foram identificadas algumas dificuldades enfrentadas pelo público:

- ❌ Dificuldade para encontrar informações **consolidadas e atualizadas** sobre trilhas e cachoeiras;
- ❌ Informações turísticas e ambientais espalhadas em diferentes fontes;
- ❌ Falta de informações detalhadas sobre **acesso, dificuldade, duração e infraestrutura**;
- ❌ Dificuldade para encontrar informações sobre **eventos culturais e ecológicos**;
- ❌ Falta de dados organizados sobre as condições e características dos atrativos;
- ❌ Necessidade de uma ferramenta que facilite o **planejamento seguro e consciente** das atividades;
- ❌ Dificuldade de encontrar todas essas informações em uma única plataforma.

---

# 🌟 Benefícios do Produto

O **Circuito Terê Verde** busca solucionar essas dificuldades oferecendo uma plataforma centralizada e organizada.

Entre os principais benefícios estão:

### 📚 Informação centralizada

Reúne informações sobre trilhas, cachoeiras e eventos em um único ambiente.

### 🧭 Facilidade de planejamento

Permite que o visitante conheça previamente as características de cada atrativo antes de realizar a atividade.

### 🛡️ Maior segurança

Disponibiliza informações importantes como dificuldade, acesso, sinalização, infraestrutura, horários e dicas de segurança.

### 🌿 Turismo sustentável

Incentiva o contato responsável com a natureza e a valorização das áreas de conservação ambiental.

### 📅 Divulgação de eventos

Facilita a descoberta de eventos culturais, ambientais e ecológicos realizados na região.

### 🔐 Gestão de conteúdo

O painel administrativo permite manter as informações atualizadas sem necessidade de alterar diretamente o código do site.

---


---

## 👤 Login e Usuários

O sistema possui autenticação de usuários, permitindo o controle de acesso às funcionalidades administrativas.

O projeto utiliza **hash de senhas** através do `bcryptjs`, evitando o armazenamento das senhas em texto puro.

---

# 🔐 Painel Administrativo

O projeto conta com um painel administrativo para gerenciamento do conteúdo da plataforma.

Através dele, o administrador pode:

- ➕ Cadastrar trilhas;
- ✏️ Editar trilhas;
- 🗑️ Excluir trilhas;
- ➕ Cadastrar cachoeiras;
- ✏️ Editar cachoeiras;
- 🗑️ Excluir cachoeiras;
- 📅 Cadastrar eventos;
- ✏️ Editar eventos;
- 🗑️ Excluir eventos;
- 👥 Gerenciar usuários;
- 🖼️ Enviar imagens diretamente do computador;
- 📊 Acompanhar estatísticas gerais do site.


# 🛠️ Tecnologias Utilizadas

## Front-end

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Font Awesome**
- **Google Fonts**


---

## Back-end

- **Node.js**
- **Express**
- **CORS**
- **bcryptjs**
- **Multer**

### Principais responsabilidades

**Node.js + Express**

- Servidor da aplicação;
- Criação das rotas;
- API;
- Comunicação entre front-end e banco de dados.

**CORS**

- Permite requisições entre diferentes origens quando necessário.

**bcryptjs**

- Utilizado para realizar o hash das senhas.

**Multer**

- Responsável pelo recebimento e processamento dos uploads de imagens.

---

# 🗄️ Banco de Dados

O projeto utiliza:

**SQLite**

Tecnologias utilizadas para integração:

- `sqlite3`
- `sqlite`

O banco é armazenado localmente no arquivo:


**database.db**


Uma das vantagens dessa abordagem é que não é necessário instalar ou configurar um servidor de banco de dados separado para executar o projeto localmente.

#

# 💻 Como Rodar o Projeto

## 📋 Pré-requisitos

Antes de iniciar, é necessário possuir:

- [Node.js](https://nodejs.org/) **versão 18 ou superior**;
- Navegador atualizado;
- Visual Studio Code ou outro editor de código.

Para verificar se o Node.js está instalado:

```bash
node -v
```

Se o terminal retornar uma versão, por exemplo:

```text
v20.x.x
```

o Node.js está instalado corretamente.

---

## 1️⃣ Baixar ou clonar o projeto

Baixe o projeto ou clone o repositório na sua pasta desejada,:

```bash
git clone https://github.com/Grupomvp7/circuitotereverdeprojetomvpgrupo7.git
```

Depois, entre na pasta do projeto! No lugar aonde foi salvo , abra o terminal do Cmd e execute :



## 2️⃣ Entrar na pasta do Backend

```bash
cd backend
```

---

## 3️⃣ Instalar as dependências

Execute:

```bash
npm install
```

Esse comando instalará automaticamente as dependências definidas no `package.json`.

Entre elas:

- Express;
- CORS;
- bcryptjs;
- Multer;
- sqlite3;
- sqlite.

---

## 4️⃣ Iniciar o servidor

Ainda dentro da pasta `backend`, execute:

```bash
node server.js
```

Se tudo estiver funcionando corretamente, será exibida uma mensagem semelhante a:

```text
✅ Banco de dados SQLite conectado com sucesso!
🚀 Servidor backend rodando em http://localhost:3000
```

---

## 5️⃣ Acessar o site

Abra o navegador e acesse:

http://localhost:3000


# 🔐 Acessando o Painel Administrativo

Para acessar o sistema de autenticação e administração:


http://localhost:3000/login.html


Na tela de login, selecione:

**Acesso Administrativo**

A partir daí, o administrador poderá realizar o cadastro ou login, de acordo com a configuração existente no sistema.



# 🌱 Impacto Esperado

O **Circuito Terê Verde** busca contribuir para a valorização dos atrativos naturais e culturais de Teresópolis através da tecnologia.

A plataforma pretende tornar as informações mais acessíveis e organizadas, incentivando visitantes e moradores a conhecerem a região de maneira responsável.

Entre os impactos esperados estão:

- 🌿 Valorização das áreas naturais;
- 🏕️ Incentivo ao ecoturismo;
- 🌎 Conscientização ambiental;
- 📚 Maior acesso à informação;
- 📅 Maior divulgação de eventos;
- 🧭 Facilitação do planejamento de atividades;
- 🤝 Aproximação entre comunidade, visitantes e instituições.

---

# 🔮 Possíveis Evoluções

O projeto pode futuramente receber novas funcionalidades, como:

- 📍 Integração com mapas;
- 🗺️ Localização dos atrativos;
- ⭐ Sistema de avaliações;
- ❤️ Lista de favoritos;
- 🔔 Notificações de eventos;
- 📱 Aplicativo para dispositivos móveis;
- 🌦️ Informações meteorológicas;
- 📊 Estatísticas mais avançadas;
- 🔗 Compartilhamento de atrativos;
- 🌐 Integração com redes sociais.

---

# 👨‍💻 Integrantes do Grupo

|                                         |
| --------------------------------------- |
| **Washington da Silva Oliveira**        |
| **Thays de Oliveira Carreiro da Silva** |
| **Piter Elias Lourencini Rezende**      |
| **Patricia Souza de Oliveira**          |

#
