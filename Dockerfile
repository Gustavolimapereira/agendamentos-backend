# --- Etapa 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o projeto NestJS
RUN npm run build

# --- Etapa 2: Produção ---
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Copia os artefatos necessários da etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Caso queira manter migrations dentro do container:
COPY --from=builder /app/prisma/migrations ./prisma/migrations

ENV NODE_ENV production

EXPOSE 3333

# Roda migrações e depois inicia
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
