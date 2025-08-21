# --- Etapa 1: Builder ---
# Utiliza uma imagem Node.js base para compilação.
# A imagem 'alpine' é ideal por ser leve.
FROM node:20-alpine AS builder

# Define o diretório de trabalho no contêiner.
WORKDIR /app

# Copia os arquivos de dependências.
# Isso permite que o Docker use o cache se não houver mudanças nas dependências.
COPY package*.json ./

# Instala todas as dependências, incluindo as de desenvolvimento.
# Elas são necessárias para a compilação do projeto.
RUN npm install

# Copia todo o código-fonte da aplicação.
COPY . .

# Gera o cliente Prisma. Isso é crucial para que a aplicação possa interagir com o banco de dados.
# O cliente gerado é salvo em 'node_modules/.prisma/client'.
RUN npx prisma generate

# Compila o código TypeScript para JavaScript.
# O código final estará na pasta 'dist'.
RUN npm run build

# --- Etapa 2: Produção ---
# Inicia uma nova imagem limpa para o ambiente de produção.
FROM node:20-alpine AS production

# Define o diretório de trabalho.
WORKDIR /app

# Copia apenas os arquivos de dependências para o estágio de produção.
# Isso garante que a imagem final seja menor e mais segura.
COPY package*.json ./

# Instala apenas as dependências de produção.
# O '--omit=dev' remove as dependências de desenvolvimento.
RUN npm install --omit=dev

# Copia os arquivos compilados (da pasta 'dist') do estágio 'builder'.
COPY --from=builder /app/dist ./dist

# Copia o cliente Prisma gerado do estágio 'builder'.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copia a pasta `prisma` (que contém o schema.prisma) para o estágio de produção.
# Isso é necessário para comandos como `prisma migrate deploy`.
COPY --from=builder /app/prisma ./prisma

# Define a variável de ambiente NODE_ENV para produção.
# Isso pode otimizar o desempenho de algumas bibliotecas.
ENV NODE_ENV production

# Expõe a porta em que a aplicação irá rodar.
EXPOSE 3333

# Define um novo script `start:prod:migrate` no `package.json`
# para rodar as migrações antes de iniciar a aplicação.
# O script `prisma migrate deploy` garante que o banco de dados esteja
# com a versão correta do schema.
# Após isso, o comando `npm run start:prod` inicia a aplicação.
RUN echo "{\"scripts\":{\"start:prod:migrate\":\"npx prisma migrate deploy && npm run start:prod\"}}" > /app/package.json.temp && \
    jq -s '.[0] * .[1]' /app/package.json /app/package.json.temp > /app/package.json.new && \
    mv /app/package.json.new /app/package.json && \
    rm /app/package.json.temp

# Define o comando padrão para iniciar o contêiner.
CMD ["npm", "run", "start:prod:migrate"]