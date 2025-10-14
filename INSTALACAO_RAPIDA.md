# 🚀 Instalação Rápida - SteelFlow Monitor

## ✅ Pré-requisitos

- Node.js 16+ instalado
- MySQL 8.0+ rodando
- Banco `steelflow` criado com todas as tabelas

---

## 📦 Passo 1: Frontend (Este projeto)

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo de configuração
cp .env.example .env

# 3. Editar .env e adicionar:
# VITE_API_URL=http://localhost:3000/api

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

✅ Frontend estará em: `http://localhost:8080`

---

## 🔧 Passo 2: Backend (Pasta separada)

### Opção A: Instalação Manual

```bash
# 1. Criar pasta do backend
mkdir steelflow-backend
cd steelflow-backend

# 2. Copiar arquivos de exemplo deste projeto:
# - backend-server-example.js → server.js
# - backend-package-example.json → package.json
# - backend-env-example.txt → .env

# 3. Editar .env com suas credenciais MySQL

# 4. Instalar dependências
npm install

# 5. Iniciar servidor
npm start
```

### Opção B: Setup Rápido (Linux/Mac)

```bash
# Execute tudo de uma vez
mkdir steelflow-backend && cd steelflow-backend && \
npm init -y && \
npm install express mysql2 cors dotenv && \
echo "DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=steelflow
PORT=3000
CORS_ORIGIN=http://localhost:8080" > .env
```

Depois copie o conteúdo de `backend-server-example.js` para `server.js` e execute:

```bash
node server.js
```

✅ Backend estará em: `http://localhost:3000`

---

## 🗄️ Passo 3: Banco de Dados MySQL

```bash
# 1. Conectar ao MySQL
mysql -u root -p

# 2. Criar banco
CREATE DATABASE steelflow;

# 3. Usar o banco
USE steelflow;

# 4. Executar todo o schema SQL fornecido
# (copiar e colar o schema completo com as 5 tabelas)
```

---

## ✅ Verificação Final

### 1. Testar Backend

```bash
curl http://localhost:3000/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "API está online",
  "database": "Conectado"
}
```

### 2. Testar Query

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT COUNT(*) as total FROM logs"}'
```

### 3. Abrir Dashboard

Acesse: `http://localhost:8080`

Se aparecer a tela de erro, verifique:
- ✅ MySQL está rodando
- ✅ Backend está rodando (porta 3000)
- ✅ Credenciais no .env do backend estão corretas
- ✅ VITE_API_URL está configurado no frontend

---

## 📁 Estrutura Final

```
/
├── steelflow-monitor/          ← Este projeto (Frontend)
│   ├── src/
│   ├── .env                    ← VITE_API_URL=...
│   └── ...
│
└── steelflow-backend/          ← Backend (Pasta separada)
    ├── server.js               ← Copiado de backend-server-example.js
    ├── package.json            ← Copiado de backend-package-example.json
    ├── .env                    ← DB_HOST, DB_USER, DB_PASSWORD, etc
    └── node_modules/
```

---

## 🔥 Comandos Úteis

```bash
# Frontend
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build

# Backend
npm start          # Iniciar servidor
npm run dev        # Com nodemon (auto-reload)

# MySQL
mysql -u root -p steelflow  # Conectar ao banco
```

---

## 🐛 Problemas Comuns

### Frontend não conecta ao backend

```bash
# Verifique se o backend está rodando
curl http://localhost:3000/api/health

# Verifique o .env do frontend
cat .env
# Deve ter: VITE_API_URL=http://localhost:3000/api
```

### Backend não conecta ao MySQL

```bash
# Teste a conexão manual
mysql -u root -p -h localhost steelflow

# Verifique credenciais no .env do backend
cat .env
```

### Porta já em uso

```bash
# Frontend (8080)
lsof -ti:8080 | xargs kill -9

# Backend (3000)
lsof -ti:3000 | xargs kill -9
```

### CORS Error

Certifique-se que `CORS_ORIGIN` no backend aponta para o frontend:
```
CORS_ORIGIN=http://localhost:8080
```

---

## 📚 Próximos Passos

1. ✅ Sistema funcionando? Parabéns!
2. 📊 Popule o banco com dados de teste
3. 🎨 Customize cores e design no `src/index.css`
4. 🔒 Adicione autenticação para produção
5. 🚀 Deploy (frontend: Vercel, backend: Railway/Heroku)

---

## 💡 Dicas

- **Auto-atualização**: Dashboard atualiza a cada 30 segundos
- **Logs**: Veja o console do navegador para debug
- **Queries**: Todas estão em `src/lib/database.ts`
- **Design**: Todas as cores estão em `src/index.css`

---

## 📞 Suporte

Problemas? Verifique:
1. `BACKEND_SETUP.md` - Guia completo do backend
2. `README_PROJETO.md` - Documentação completa
3. Console do navegador - Erros do frontend
4. Terminal do backend - Erros da API

---

**Tempo estimado de instalação: 10-15 minutos** ⚡
