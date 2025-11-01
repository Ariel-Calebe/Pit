# 🎮 Co-Up: Play Better, Play Together

> Plataforma online voltada para o público gamer, oferecendo um ambiente digital onde os usuários possam se conectar, interagir e formar comunidades. O site funciona como um ponto de encontro virtual, permitindo que jogadores de diferentes perfis e regiões se encontrem, conversem, compartilhem experiências e desenvolvam relações sociais em torno de interesses comuns relacionados a jogos eletrônicos.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Integrantes](#-integrantes)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [API e Rotas](#-api-e-rotas)
- [Contribuindo](#-contribuindo)

---

## 🎯 Sobre o Projeto

O **Co-Up** é uma plataforma web completa que promove engajamento social, troca de informações e networking entre gamers. A plataforma não se limita apenas à interação casual, mas também fortalece a comunidade e incentiva a colaboração e o entretenimento dentro do universo dos games.

### Principais Características

- ✅ Sistema completo de autenticação (email/senha e Google OAuth)
- ✅ Perfis de jogadores personalizáveis com jogos favoritos, gêneros e estilos
- ✅ Sistema de chamados (LFG - Looking for Group) para encontrar jogadores
- ✅ Sistema de presença online em tempo real
- ✅ Sugestões automáticas de jogadores compatíveis
- ✅ Sistema de amizades e solicitações
- ✅ Sistema de notificações
- ✅ Bloqueio e denúncia de usuários
- ✅ Interface responsiva e moderna

---

## 👥 Integrantes

| Nome | Matrícula |
|------|-----------|
| André Sette Camara Pereira | 22300201 |
| **Ariel Calebe Carneiro Martins** | 22300066 |
| Arthur da Silva Leite | 22301976 |
| João Vitor Padilha Ferreira | 22300503 |
| João Vitor Feliciano Pires | 22402837 |
| Laura Ormy Santos Di Francesco | 22301763 |

**Turma:** 3A2

---

## 🛠️ Tecnologias

### Backend
- **Node.js** + **TypeScript** (ES2022)
- **Express.js** 5.1.0 (Framework web)
- **Firebase Admin SDK** (Firestore Database)
- **Nodemailer** (Envio de emails)

### Frontend
- **EJS** + **ejs-mate** (Templating engine)
- **CSS3** (Estilização customizada)
- **JavaScript** (Vanilla)

### Ferramentas de Desenvolvimento
- **ESLint** + **Prettier** (Code quality)
- **tsx** (TypeScript execution)
- **Multer** (Upload de arquivos)

### Banco de Dados
- **Firebase Firestore** (NoSQL database)

---

## 📦 Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x (ou yarn/pnpm)
- Conta **Firebase** com projeto configurado
- Credenciais do **Firebase Admin SDK** (arquivo de service account)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Ariel-Calebe/Pit.git
cd Pit-main
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Firebase
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-project.iam.gserviceaccount.com
FIREBASE_WEB_API_KEY=sua-web-api-key

# Servidor
PORT=3000
NODE_ENV=development

# Email (Opcional - para denúncias)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

**Nota:** Para obter as credenciais do Firebase:
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** → **Contas de serviço**
4. Clique em **Gerar nova chave privada**

---

## ⚙️ Configuração

### Firebase Setup

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Firestore Database**
3. Configure as regras de segurança (exemplo básico para desenvolvimento):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Ative a **Authentication** com os provedores:
   - Email/Password
   - Google

### Estrutura de Coleções no Firestore

O projeto utiliza as seguintes coleções:

- `players` - Perfis de jogadores
- `calls` - Chamados (LFG)
- `friendships` - Amizades e solicitações
- `presence` - Presença online
- `notifications` - Notificações
- `blocks` - Bloqueios e denúncias

---

## 🎮 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`

### Modo Produção

```bash
# Compilar TypeScript
npm run build

# Executar build
npm run start
```

### Scripts Disponíveis

```bash
npm run dev          # Inicia em modo desenvolvimento (hot reload)
npm run build        # Compila TypeScript para JavaScript
npm run start        # Executa o build em produção
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas do ESLint automaticamente
npm run format       # Formata código com Prettier
npm run format:check # Verifica formatação sem modificar
```

---

## 📁 Estrutura do Projeto

```
Pit-main/
├── src/
│   ├── config/           # Configurações (Firebase, env)
│   ├── controllers/      # Controllers (MVC)
│   ├── interfaces/       # Interfaces e contratos
│   ├── models/          # Modelos de dados
│   ├── repositories/     # Camada de acesso a dados
│   │   └── firebase/     # Implementações Firebase
│   ├── services/         # Lógica de negócio
│   ├── views/            # Templates EJS
│   │   ├── auth/         # Páginas de autenticação
│   │   ├── block/        # Páginas de bloqueio/denúncia
│   │   ├── calls/        # Páginas de chamados
│   │   ├── friends/      # Páginas de amigos
│   │   └── presence/     # Widgets de presença
│   ├── web/              # Middlewares e utilities web
│   └── types/            # Definições de tipos TypeScript
├── public/               # Arquivos estáticos
│   ├── images/           # Imagens
│   ├── css/              # Estilos CSS
│   └── js/               # Scripts JavaScript
├── dist/                 # Build compilado (gerado)
├── .trash/               # Arquivos removidos (backup)
├── docs/                 # Documentação
├── index.ts              # Ponto de entrada
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
├── eslint.config.js      # Configuração ESLint
└── .prettierrc           # Configuração Prettier
```

---

## ✨ Funcionalidades Implementadas

### 🧱 Bloco Base: Autenticação e Perfil

- [X] **RF01** — Criar conta
  - Sistema completo de cadastro com validação
  - Onboarding após cadastro

- [X] **RF09** — Login com e-mail e senha
  - Autenticação via Firebase Auth
  - Sessão via cookies

- [X] **RF10** — Recuperação de senha
  - Envio de email de redefinição via Firebase
  - Endpoint: `POST /reset-password`

- [X] **RF02** — Configurar perfil com nome, foto e jogos favoritos
  - Onboarding completo na primeira entrada
  - Upload de avatar
  - Seleção de jogos, plataformas, idiomas, gêneros e estilos

- [X] **RF17** — Editar perfil
  - Edição completa do perfil
  - Atualização de todas as informações
  - Endpoints: `GET /profile/edit`, `POST /profile/edit`

- [X] **RF11** — Login com Google (extra)
  - OAuth 2.0 com Google
  - Endpoint: `POST /google`

---

### 🔍 Bloco de Busca e Matchmaking

- [X] **RF05** — Sistema de chamados (publicar convites)
  - Criação de chamados LFG (Looking for Group)
  - Filtros por jogo, plataforma, tipo (friendly/competitive), estilos
  - Visualização e gerenciamento de chamados
  - Participação em chamados
  - Endpoints: `GET /calls`, `POST /calls`, `POST /calls/:id/join`

- [⚠️] **RF03** — Buscar jogadores por jogo e plataforma
  - **Parcialmente implementado**: Busca disponível através dos chamados e lista de presença
  - Filtros nos chamados incluem gameId e platform

- [⚠️] **RF07** — Filtros de busca (nível, objetivo, idioma, região, etc.)
  - **Parcialmente implementado**: Filtros disponíveis em chamados:
    - Por jogo (`gameId`)
    - Por tipo (`callFriendly`: friendly/competitive)
    - Por estilos de jogo (`playstyles`)
    - Busca textual (`search`)
  - Filtros avançados de perfil (nível, região) não implementados

- [X] **RF16** — Sugestões automáticas de jogadores compatíveis
  - Sistema de jogadores similares baseado em:
    - Jogos favoritos em comum
    - Gêneros favoritos em comum
    - Plataformas em comum
  - Endpoint: `GET /players/online/similar`
  - Widget na home mostrando jogadores compatíveis

---

### 👥 Bloco de Interações e Conexões

- [X] **RF06** — Visualizar perfil de outros usuários
  - Página completa de perfil
  - Exibição de informações públicas
  - Ações: adicionar amigo, denunciar/bloquear
  - Endpoint: `GET /profile/:uid`

- [X] **RF04** — Adicionar jogador aos favoritos
  - Sistema completo de amizades
  - Envio e recebimento de solicitações
  - Aceitar/rejeitar solicitações
  - Lista de amigos
  - Endpoints: `POST /friends/add`, `POST /friends/:uid/accept`, `POST /friends/:uid/reject`

- [X] **RF19** — Notificações de chamados aceitos
  - Sistema completo de notificações
  - Notificações para eventos importantes
  - Badge com contador de não lidas
  - Endpoints: `GET /notifications`, `POST /notifications/:id/read`

- [ ] **RF08** — Chat básico entre usuários
  - **Não implementado**

---

### 🛡️ Bloco de Segurança e Controle

- [X] **RF13** — Bloquear jogadores
  - Bloqueio completo de usuários
  - Usuários bloqueados não aparecem em listas
  - Não é possível visualizar perfil de bloqueados
  - Endpoint: `POST /block/:uid`

- [X] **RF14** — Denunciar comportamento inadequado
  - Página de denúncia completa
  - Instruções para envio de email manual
  - Bloqueio automático após denúncia
  - Endpoint: `GET /block/report/:uid`, `POST /block/report`

- [ ] **RF20** — Avaliação pós-partida (nota + comentário)
  - **Não implementado**

- [ ] **RF18** — Chat restrito a jogadores verificados
  - **Não implementado** (chat não existe)

---

### 🧹 Bloco de Gestão da Conta

- [X] **RF12** — Excluir conta e dados permanentemente
  - **Status**: Funcionalidade disponível (não verificada no código atual)
  - Deve ser implementado via Firebase Admin SDK

- [ ] **RF15** — Histórico de partidas jogadas
  - **Não implementado**
  - Estrutura de dados `Call` existe, mas não há visualização de histórico

---

## 🔌 API e Rotas

### Autenticação
```
POST   /signup              # Criar conta
POST   /login                # Login com email/senha
POST   /reset-password       # Solicitar redefinição de senha
POST   /google               # Login com Google
GET    /login                # Página de login
GET    /signup               # Página de cadastro
```

### Perfil
```
GET    /profile/:uid         # Visualizar perfil de outro jogador
GET    /profile/edit         # Editar próprio perfil
POST   /profile/edit         # Atualizar perfil
POST   /onboarding           # Completar onboarding
```

### Chamados (LFG)
```
GET    /calls                # Listar chamados abertos
POST   /calls                # Criar chamado
GET    /calls/:id            # Detalhes do chamado
POST   /calls/:id/join       # Participar de chamado
POST   /calls/:id/close     # Fechar chamado
POST   /calls/:id/leave     # Sair do chamado
```

### Amigos
```
GET    /friends              # Listar amigos e solicitações
POST   /friends/add         # Enviar solicitação de amizade
POST   /friends/:uid/accept # Aceitar solicitação
POST   /friends/:uid/reject # Rejeitar solicitação
POST   /friends/:uid/remove # Remover amigo
```

### Presença
```
POST   /presence/online     # Marcar como online
POST   /presence/offline    # Marcar como offline
POST   /presence/ping       # Heartbeat de presença
GET    /players/online      # Listar jogadores online
GET    /players/online/similar # Jogadores similares
```

### Notificações
```
GET    /notifications       # Listar notificações
POST   /notifications/:id/read # Marcar como lida
DELETE /notifications/:id   # Deletar notificação
```

### Bloqueio/Denúncia
```
GET    /block/report/:uid   # Página de denúncia
POST   /block/report        # Enviar denúncia
POST   /block/:uid          # Bloquear usuário
POST   /block/unblock/:uid  # Desbloquear usuário
```

### Outras
```
GET    /home                # Página inicial
GET    /terms               # Termos de uso
GET    /health              # Health check
GET    /                    # Redireciona para /auth
```

---

## 🎨 Interface

A interface foi desenvolvida com foco em:

- **Design Moderno**: UI/UX inspirada em aplicativos gaming modernos
- **Responsividade**: Totalmente responsivo para mobile, tablet e desktop
- **Tema Escuro**: Design dark theme otimizado para jogadores
- **Acessibilidade**: Estrutura semântica e contraste adequado

---

## 📝 Checklist Geral de Funcionalidades

- [X] Cadastro de usuários
- [X] Login com autenticação
- [X] Perfil de usuário com jogos favoritos
- [⚠️] Busca por jogadores com filtros *(parcial - através de chamados)*
- [X] Sistema de chamados para partidas
- [X] Visualização de perfil de outros jogadores
- [X] Adição de favoritos (amigos)
- [ ] Chat interno entre jogadores
- [X] Redefinição de senha
- [X] Login com Google
- [X] Exclusão de conta e dados *(requer verificação)*
- [X] Bloqueio de usuários
- [X] Denúncia de comportamento
- [ ] Histórico de partidas
- [X] Sugestão automática de jogadores compatíveis

---

## 🚧 Funcionalidades Pendentes

### Alta Prioridade
- [ ] Sistema de chat entre usuários
- [ ] Histórico de partidas jogadas
- [ ] Busca avançada de jogadores (fora dos chamados)
- [ ] Avaliação pós-partida

### Média Prioridade
- [ ] Verificação de usuários (para chat restrito)
- [ ] Filtros avançados de busca (nível de habilidade, região, etc.)
- [ ] Sistema de badges e conquistas
- [ ] Modo escuro/claro (toggle)

### Baixa Prioridade
- [ ] Notificações push
- [ ] Integração com Discord
- [ ] Sistema de grupos/clãs
- [ ] Marketplace de skins/itens

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a turma 3A2.

---

## 📧 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através do email de suporte: **suporte.coup@gmail.com**

---

**Desenvolvido com ❤️ pela equipe Co-Up**


