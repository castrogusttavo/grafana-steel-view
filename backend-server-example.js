/**
 * Backend Server - SteelFlow Monitor
 * 
 * Este é um exemplo completo de servidor backend para o SteelFlow Monitor.
 * 
 * COMO USAR:
 * 1. Crie uma pasta separada: mkdir steelflow-backend && cd steelflow-backend
 * 2. Inicialize: npm init -y
 * 3. Instale dependências: npm install express mysql2 cors dotenv
 * 4. Copie este arquivo para server.js
 * 5. Crie arquivo .env com suas credenciais
 * 6. Execute: node server.js
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ========== MIDDLEWARES ==========
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========== MYSQL CONNECTION POOL ==========
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'steelflow',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

// Teste de conexão inicial
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado ao MySQL com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  });

// ========== HEALTH CHECK ==========
app.get('/api/health', async (req, res) => {
  try {
    // Testa a conexão com o banco
    const [rows] = await pool.query('SELECT 1 as test');
    
    res.json({
      success: true,
      message: 'API está online',
      database: 'Conectado',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro na verificação de saúde',
      error: error.message
    });
  }
});

// ========== VALIDAÇÃO DE QUERIES ==========
function validateQuery(query) {
  const trimmedQuery = query.trim().toUpperCase();
  
  // Apenas SELECT permitido
  if (!trimmedQuery.startsWith('SELECT')) {
    return { valid: false, error: 'Apenas queries SELECT são permitidas' };
  }
  
  // Bloqueia palavras perigosas
  const dangerousKeywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'TRUNCATE', 'ALTER', 'CREATE'];
  for (const keyword of dangerousKeywords) {
    if (trimmedQuery.includes(keyword)) {
      return { valid: false, error: `Operação ${keyword} não é permitida` };
    }
  }
  
  return { valid: true };
}

// ========== ENDPOINT PRINCIPAL: EXECUTAR QUERY ==========
app.post('/api/query', async (req, res) => {
  const { query, params = [] } = req.body;

  // Validação básica
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Query não fornecida ou inválida'
    });
  }

  // Valida a query
  const validation = validateQuery(query);
  if (!validation.valid) {
    return res.status(403).json({
      success: false,
      error: validation.error
    });
  }

  try {
    // Executa a query
    const [rows] = await pool.execute(query, params);
    
    // Log para debug (remova em produção)
    console.log(`✅ Query executada: ${query.substring(0, 100)}...`);
    console.log(`   Resultados: ${rows.length} rows`);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('❌ Erro ao executar query:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// ========== ENDPOINTS ESPECÍFICOS (OPCIONAL) ==========
// Você pode criar endpoints específicos para melhor performance e segurança

// Total de arquivos
app.get('/api/metrics/files', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as totalFiles FROM catalog WHERE item_type = 'file'"
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Total de eventos
app.get('/api/metrics/events', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as totalEvents FROM logs");
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Logs recentes
app.get('/api/logs/recent', async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  
  try {
    const [rows] = await pool.query(
      `SELECT id, timestamp, event, path, root_path, details, user_name, ip_address, 
              synced_to_external, flag 
       FROM logs 
       ORDER BY timestamp DESC 
       LIMIT ?`,
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Resumo de eventos
app.get('/api/metrics/event-summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        event,
        COUNT(*) as count,
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM logs)) as percentage
      FROM logs 
      GROUP BY event 
      ORDER BY count DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    path: req.path
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('=====================================');
  console.log('🚀 SteelFlow Backend Server');
  console.log('=====================================');
  console.log(`📡 Server rodando em: http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'steelflow'}`);
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('=====================================');
  console.log('Endpoints disponíveis:');
  console.log('  GET  /api/health');
  console.log('  POST /api/query');
  console.log('  GET  /api/metrics/files');
  console.log('  GET  /api/metrics/events');
  console.log('  GET  /api/metrics/event-summary');
  console.log('  GET  /api/logs/recent?limit=50');
  console.log('=====================================\n');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await pool.end();
  process.exit(0);
});
