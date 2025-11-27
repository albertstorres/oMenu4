# 🚀 Guia de Deploy - Frontend oMenu

Este guia contém instruções para fazer deploy do frontend usando Docker ou diretamente no Vercel.

## 📦 Opção 1: Deploy no Vercel (Recomendado)

O Vercel tem suporte nativo para projetos React. O arquivo `vercel.json` já está configurado.

### Passos:

1. **Instale a CLI do Vercel** (se ainda não tiver):
   ```bash
   npm i -g vercel
   ```

2. **Faça login no Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

4. **Ou conecte via GitHub**:
   - Acesse [vercel.com](https://vercel.com)
   - Conecte seu repositório GitHub
   - Selecione o diretório `frontend`
   - O Vercel detectará automaticamente as configurações

### Variáveis de Ambiente (se necessário):

No painel do Vercel, adicione variáveis de ambiente em:
**Settings → Environment Variables**

## 🐳 Opção 2: Deploy com Docker

### Build e execução local:

```bash
cd frontend

# Build da imagem
docker build -t omenu-frontend .

# Executar container
docker run -p 3000:80 omenu-frontend
```

Acesse: http://localhost:3000

### Com Docker Compose:

```bash
cd frontend

# Build e execução
docker-compose up --build

# Em background
docker-compose up -d --build
```

### Para produção:

```bash
# Build otimizado
docker build -t omenu-frontend:latest .

# Tag para registry (ex: Docker Hub)
docker tag omenu-frontend:latest seu-usuario/omenu-frontend:latest

# Push
docker push seu-usuario/omenu-frontend:latest
```

## 🔧 Comandos Úteis

### Docker:

```bash
# Ver logs
docker logs omenu-frontend

# Parar container
docker stop omenu-frontend

# Remover container
docker rm omenu-frontend

# Remover imagem
docker rmi omenu-frontend
```

### Vercel:

```bash
# Preview do deploy
vercel

# Deploy em produção
vercel --prod

# Ver logs
vercel logs

# Listar deployments
vercel ls
```

## 📝 Notas Importantes

1. **Vercel**: Não precisa de Dockerfile. O `vercel.json` já está configurado.
2. **Docker**: Use para ambientes que não suportam Vercel (ex: servidor próprio, AWS, etc.)
3. **Build**: O build gera arquivos estáticos na pasta `build/`
4. **SPA Routing**: Tanto o nginx.conf quanto o vercel.json estão configurados para suportar rotas do React Router

## 🐛 Troubleshooting

### Erro de build:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Porta já em uso (Docker):
```bash
# Use outra porta
docker run -p 8080:80 omenu-frontend
```

### Problemas no Vercel:
- Verifique os logs no painel do Vercel
- Certifique-se que o `package.json` tem o script `build`
- Verifique variáveis de ambiente se necessário

