# Configuração do Backend - SteelFlow Monitor

Este documento explica como configurar o backend para conectar ao banco MySQL.

## Estrutura Necessária

O frontend está preparado para consumir uma API REST que execute as queries MySQL. Você precisa criar um backend Node.js simples.

## Exemplo de Backend com Express e MySQL

### 1. Instalar dependências

```bash
npm install express mysql2 cors dotenv
```

### 2. Criar arquivo `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=steelflow
PORT=3000
```

### 3. Criar `server.js`

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do pool de conexões MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API está online' });
});

// Endpoint para executar queries
app.post('/api/query', async (req, res) => {
  const { query, params = [] } = req.body;

  try {
    // Validação básica - apenas SELECT permitido
    if (!query.trim().toUpperCase().startsWith('SELECT')) {
      return res.status(400).json({
        success: false,
        error: 'Apenas queries SELECT são permitidas'
      });
    }

    const [rows] = await pool.execute(query, params);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Erro ao executar query:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
  console.log(`Conectado ao banco: ${process.env.DB_NAME}`);
});
```

### 4. Iniciar o backend

```bash
node server.js
```

## Configuração do Frontend

No arquivo `.env` do frontend (Vite), configure:

```env
VITE_API_URL=http://localhost:3000/api
```

## Queries Implementadas

Todas as queries SQL estão prontas no arquivo `src/lib/database.ts`:

1. **getTotalFiles()** - Total de arquivos no catálogo
2. **getTotalDirectories()** - Total de diretórios
3. **getLastSensitiveAccess()** - Último acesso a arquivo sensível
4. **getSensitiveAccesses()** - Total de acessos sensíveis
5. **getSensitiveAccessesChange()** - Variação de acessos (24h)
6. **getTotalStorage()** - Armazenamento total em bytes
7. **getTotalStorageChange()** - Variação de armazenamento
8. **getTotalFilesChange()** - Variação de arquivos (24h)
9. **getTotalEvents()** - Total de eventos registrados
10. **getRecentLogs()** - Logs mais recentes
11. **getEventSummary()** - Resumo de eventos agrupados
12. **getAllMetrics()** - Todas as métricas de uma vez

## Segurança

⚠️ **IMPORTANTE**: Este é um exemplo básico. Para produção:

1. Adicione autenticação (JWT, OAuth, etc)
2. Valide e sanitize todas as queries
3. Use prepared statements
4. Implemente rate limiting
5. Configure HTTPS
6. Use variáveis de ambiente para credenciais
7. Adicione logging adequado
8. Configure CORS corretamente

## Alternativas

Se preferir usar um ORM, considere:
- **Prisma**: ORM moderno com TypeScript
- **Sequelize**: ORM popular para Node.js
- **TypeORM**: ORM com suporte completo a TypeScript

## Testando a Conexão

Após configurar o backend, o dashboard irá:
1. Buscar métricas automaticamente
2. Atualizar dados em tempo real
3. Exibir erros no console se a API não estiver disponível

Para testar manualmente:
```bash
curl http://localhost:3000/api/health
```
