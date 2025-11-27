# Dockerfile otimizado para React/TypeScript - Multi-stage build
# Stage 1: Build
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências (apenas produção para otimizar)
RUN npm ci --only=production=false

# Copia o código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copia os arquivos buildados do stage anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Copia configuração customizada do nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]

