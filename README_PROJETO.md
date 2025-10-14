# SteelFlow Monitor - Dashboard de Monitoramento

Dashboard profissional de monitoramento de arquivos em tempo real, inspirado no Grafana.

## 📊 Funcionalidades

- **Métricas em Tempo Real**: Total de arquivos, diretórios, armazenamento
- **Segurança**: Monitoramento de acessos sensíveis
- **Logs Detalhados**: Tabela completa de eventos do sistema
- **Resumo de Ações**: Gráficos de distribuição de eventos
- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **Tema Profissional**: Inspirado no Grafana com cores verde/teal

## 🚀 Quick Start

### 1. Frontend (Vite + React)

```bash
# Instalar dependências
npm install

# Criar arquivo de configuração
cp .env.example .env

# Editar .env e configurar:
# VITE_API_URL=http://localhost:3000/api

# Iniciar desenvolvimento
npm run dev
```

### 2. Backend (Node.js + MySQL)

Consulte o arquivo `BACKEND_SETUP.md` para instruções detalhadas.

**Resumo rápido:**

```bash
# Em outra pasta, criar backend
mkdir steelflow-backend && cd steelflow-backend
npm init -y
npm install express mysql2 cors dotenv

# Criar server.js (ver BACKEND_SETUP.md)
# Criar .env com credenciais do MySQL
# Iniciar: node server.js
```

### 3. Banco de Dados MySQL

Execute o script SQL fornecido para criar as tabelas:

```sql
CREATE DATABASE steelflow;
-- Execute todo o schema fornecido
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── DashboardHeader.tsx    # Cabeçalho com breadcrumb
│   ├── MetricCard.tsx          # Cards de métricas
│   ├── EventsSummary.tsx       # Sidebar com resumo
│   └── EventsTable.tsx         # Tabela de logs
├── lib/
│   ├── database.ts             # Queries SQL organizadas
│   └── api.ts                  # Configuração da API
├── pages/
│   └── Index.tsx               # Página principal
└── index.css                   # Design system
```

## 🎨 Design System

**Cores principais (HSL):**
- Background: `220 13% 13%` (cinza escuro)
- Success/Primary: `160 84% 39%` (verde teal vibrante)
- Card: `220 13% 18%` (cinza médio)
- Destructive: `0 84% 60%` (vermelho)

**Tokens semânticos:**
- Todas as cores usam variáveis CSS (`--success`, `--primary`, etc)
- Configurado em `src/index.css`
- Sem classes diretas como `text-white` ou `bg-black`

## 📊 Queries SQL Implementadas

Todas em `src/lib/database.ts`:

1. **getTotalFiles()** - `SELECT COUNT(*) FROM catalog WHERE item_type = 'file'`
2. **getTotalDirectories()** - Conta diretórios
3. **getLastSensitiveAccess()** - Último acesso sensível
4. **getSensitiveAccesses()** - Total de acessos sensíveis
5. **getTotalStorage()** - `SUM(size_bytes)` de todos os arquivos
6. **getTotalEvents()** - Conta total de logs
7. **getRecentLogs(limit)** - Últimos N logs
8. **getEventSummary()** - Agrupa eventos por tipo
9. **getAllMetrics()** - Busca todas as métricas de uma vez

### Cálculo de Variações (24h)

Queries especiais calculam a mudança percentual comparando:
- Últimas 24 horas vs 24-48 horas anteriores
- Usado para badges de variação (+12%, -8%, etc)

## 🔌 API Backend

### Endpoint Principal

```
POST /api/query
Content-Type: application/json

{
  "query": "SELECT COUNT(*) as total FROM logs",
  "params": []
}
```

### Health Check

```
GET /api/health
```

## 🔒 Segurança

⚠️ **IMPORTANTE**: O exemplo fornecido é básico.

**Para produção, adicione:**
- Autenticação JWT ou OAuth
- Validação rigorosa de queries
- Rate limiting
- HTTPS obrigatório
- Sanitização de inputs
- Logging de auditoria
- CORS configurado corretamente

## 🎯 Responsividade

O dashboard adapta-se automaticamente:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Grid adaptável
- **Mobile**: Stack vertical, tabela com scroll horizontal

## 🔄 Atualização Automática

- Dashboard atualiza dados a cada **30 segundos**
- Não requer reload da página
- Mostra loader durante carregamento

## ❌ Tratamento de Erros

Se o backend não estiver disponível:
1. Mostra tela de erro amigável
2. Exibe instruções de configuração
3. Toast de notificação
4. Logs no console do navegador

## 📦 Dependências Principais

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Componentes
- **Lucide React** - Ícones
- **React Query** - Data fetching
- **Sonner** - Toast notifications

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linting
```

## 📖 Documentação Adicional

- `BACKEND_SETUP.md` - Guia completo do backend
- `.env.example` - Exemplo de configuração
- Comentários no código fonte

## 🐛 Debug

**Console do navegador:**
```javascript
// Verificar saúde da API
fetch('http://localhost:3000/api/health')

// Testar query manualmente
fetch('http://localhost:3000/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: 'SELECT COUNT(*) as total FROM logs' 
  })
})
```

## 📝 Licença

Este projeto é proprietário.

## 👥 Suporte

Para dúvidas ou problemas:
1. Verifique `BACKEND_SETUP.md`
2. Revise os logs do navegador e servidor
3. Confirme credenciais do banco de dados
