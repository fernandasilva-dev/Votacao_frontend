# 🗳️ Sistema de Votação – Frontend

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-42b883?logo=vue.js\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite\&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-blue)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)

Frontend de um **Sistema de Votação Legislativa**, desenvolvido com **Vue.js 3**, consumindo uma API REST em **Node.js**.
A aplicação possui controle de acesso por perfil (**Administrador** e **Vereador**) e interfaces específicas para cada tipo de usuário.

---

## 📑 Sumário

* [📖 Descrição do Projeto](#-descrição-do-projeto)
* [✨ Funcionalidades](#-funcionalidades)
* [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
* [📂 Estrutura de Pastas](#-estrutura-de-pastas)
* [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
* [🔐 Segurança e Controle de Acesso](#-segurança-e-controle-de-acesso)
* [👩‍💻 Autora](#-autora)

---

## 📖 Descrição do Projeto

Este projeto corresponde ao **frontend** de um sistema de votação desenvolvido como parte de um **trabalho acadêmico**.

A aplicação permite:

* Cadastro e autenticação de usuários
* Gerenciamento de partidos e projetos de lei
* Registro e acompanhamento de votações
* Visualização de resultados em tempo real

O frontend foi construído com **Vue 3 + Composition API**, priorizando:

* Componentização
* Organização por domínio
* Segurança
* Clareza na navegação

---

## ✨ Funcionalidades

### 🔐 Autenticação

* [✔] Login com validação de sessão
* [✔] Cadastro de usuários
* [✔] Logout seguro
* [✔] Proteção de rotas

---

### 👥 Perfis de Usuário

#### 🧑‍💼 Administrador

* [✔] Gerenciar partidos políticos
* [✔] Cadastrar projetos de lei
* [✔] Aprovar projetos para votação
* [✔] Visualizar resultados completos
* [✔] Ver votos individuais
* [✔] Gerenciar perfil

#### 🧑‍⚖️ Vereador

* [✔] Visualizar projetos disponíveis
* [✔] Registrar voto (Sim / Não / Abstenção)
* [✔] Impedimento de voto duplicado
* [✔] Visualizar status da votação
* [✔] Gerenciar perfil

---

### 🗳️ Sistema de Votação

* [✔] Confirmação antes do voto
* [✔] Bloqueio após encerramento
* [✔] Exibição de resultados
* [✔] Gráficos de votação
* [✔] Atualização automática

---

## 🛠️ Tecnologias Utilizadas

### Frontend

* **Vue.js 3**
* **Composition API**
* **Vue Router**
* **Axios**
* **Vite**

### Estilização

* CSS organizado por responsabilidade
* Layout responsivo
* Componentes reutilizáveis

---

## 📂 Estrutura de Pastas

```
src/
├── assets/
│   ├── images/
│   └── vue.svg
│
├── components/
│   ├── forms/
│   │   ├── CadastroForm.vue
│   │   ├── CadastroPartidoForm.vue
│   │   ├── CadastroProjetoForm.vue
│   │   └── LoginForm.vue
│   │
│   ├── Navbar/
│   │   ├── NavbarAdmin.vue
│   │   └── NavbarVereador.vue
│   │
│   ├── profile/
│   │   └── Profile.vue
│   │
│   └── votacoes/
│       ├── ResultadoVotacao.vue
│       ├── ViewVotacoes.vue
│       └── VotarProjeto.vue
│
├── css/
│
├── router/
│   └── index.js
│
├── services/
│   └── api.js
│
├── views/
│   ├── Admin/
│   ├── Auth/
│   └── Vereador/
│
├── App.vue
├── main.js
│
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Como Executar o Projeto

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/Votacao_frontend.git
cd Votacao_frontend
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure a API

Arquivo: `src/services/api.js`

```js
baseURL: 'http://localhost:3000/api'
```

> ⚠️ Certifique-se de que o backend esteja rodando.

---

### 4️⃣ Execute o projeto

```bash
npm run dev
```

📍 Acesse em:

```
http://localhost:5173
```

---

## 🔐 Segurança e Controle de Acesso

* Guards de rota com `meta.requiresAuth`
* Controle de perfil (`admin` | `vereador`)
* Sessões via cookies (`withCredentials`)
* Redirecionamento automático para login

---

## 👩‍💻 Autora

**Maria Fernanda**
Projeto acadêmico – Sistema de Votação Legislativa
