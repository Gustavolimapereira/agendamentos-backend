# --- Etapa 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# --- Etapa 2: Produção ---
FROM node:20-alpine AS production

WORKDIR /app

# Adiciona a instalação do 'jq' na imagem.
# O 'apk add' é o gerenciador de pacotes do Alpine Linux.
RUN apk add --no-cache jq

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV production

EXPOSE 3333

# Este comando agora funcionará porque 'jq' está instalado.
RUN echo "{\"scripts\":{\"start:prod:migrate\":\"npx prisma migrate deploy && npm run start:prod\"}}" > /app/package.json.temp && \
    jq -s '.[0] * .[1]' /app/package.json /app/package.json.temp > /app/package.json.new && \
    mv /app/package.json.new /app/package.json && \
    rm /app/package.json.temp

CMD ["npm", "run", "start:prod:migrate"]