# 🚗 API de Agendamento de Carros

Este projeto é uma **API backend** desenvolvida em [NestJS](https://nestjs.com/) para gerenciar **agendamentos de carros**.  
A aplicação foi construída com foco em **boas práticas de desenvolvimento**, **testes automatizados** e **documentação clara**.

Documentação da API: https://agendamento-agendamento-backend.frcirq.easypanel.host/api/docs

---

## 📌 Funcionalidades
- Criação e gerenciamento de agendamentos de carros
- Autenticação de usuários
- Integração com banco de dados **PostgreSQL**
- Documentação com **Swagger**
- Testes **E2E (end-to-end)**
- Deploy em VPS com suporte a **Docker**

---

## 🛠️ Tecnologias Utilizadas
- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Swagger](https://swagger.io/)

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório
git clone https://github.com/Gustavolimapereira/agendamentos-backend.git
cd agendamentos-backend

### 2. Instalar dependências
npm install

### 3. Subir containers com Docker (Banco de Dados)
docker-compose up -d

### 4. Rodar as migrações do Prisma
npx prisma migrate dev

### 5. Rodar os testes E2E
npm run test:e2e

### 6. Rodar a aplicação em modo desenvolvimento
npm run start:dev

### 7. Usuário de teste
email: admin@email.com
senha: 123456

agendamento-agendamento-backend.frcirq.easypanel.host/sessions
ou
http://localhost:3333/sessions
