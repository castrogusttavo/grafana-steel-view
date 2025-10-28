// Database queries - SteelFlow Monitor
// Queries SQL prontas para conexão com MySQL

export interface LogEntry {
  id: number;
  timestamp: string;
  event: string;
  path: string;
  root_path: string;
  details: string | null;
  user_name: string;
  hostname: string | null;
  ip_address: string | null;
  synced_to_external: boolean;
  flag: number;
}

export interface EventSummary {
  event: string;
  count: number;
  percentage: number;
}

export interface MetricData {
  totalFiles: number;
  totalFilesChange: number;
  totalDirectories: number;
  totalDirectoriesChange: number;
  lastSensitiveAccess: string | null;
  sensitiveAccesses: number;
  sensitiveAccessesChange: number;
  totalStorage: number; // in bytes
  totalStorageChange: number;
  totalEvents: number;
}

// Configuração da conexão - substitua com suas credenciais
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "steelflow",
};

// Importa a função de API
import { executeQuery as apiExecuteQuery } from "./api";

// Helper para executar queries via backend API
async function executeQuery<T>(query: string): Promise<T> {
  return apiExecuteQuery<T>(query);
}

/**
 * Query: Total de arquivos no catálogo
 * SELECT COUNT(*) as totalFiles FROM catalog WHERE item_type = 'file'
 */
export const getTotalFiles = async (): Promise<number> => {
  const query = `
    SELECT COUNT(*) as totalFiles 
    FROM catalog 
    WHERE item_type = 'file'
  `;
  
  const result = await executeQuery<{ totalFiles: number }[]>(query);
  return result[0]?.totalFiles || 0;
};

/**
 * Query: Total de diretórios no catálogo
 * SELECT COUNT(*) as totalDirectories FROM catalog WHERE item_type = 'directory'
 */
export const getTotalDirectories = async (): Promise<number> => {
  const query = `
    SELECT COUNT(*) as totalDirectories 
    FROM catalog 
    WHERE item_type = 'directory'
  `;
  
  const result = await executeQuery<{ totalDirectories: number }[]>(query);
  return result[0]?.totalDirectories || 0;
};

/**
 * Query: Último acesso a arquivos sensíveis
 * SELECT MAX(timestamp) as lastAccess FROM logs WHERE flag = 1
 */
export const getLastSensitiveAccess = async (): Promise<string | null> => {
  const query = `
    SELECT MAX(l.timestamp) as lastAccess 
    FROM logs l
    INNER JOIN catalog c ON MD5(l.path) = c.item_path_hash
    WHERE c.sensitive = 1
  `;
  
  const result = await executeQuery<{ lastAccess: string | null }[]>(query);
  return result[0]?.lastAccess || null;
};

/**
 * Query: Total de acessos a arquivos sensíveis
 * Conta logs de arquivos marcados como sensíveis
 */
export const getSensitiveAccesses = async (): Promise<number> => {
  const query = `
    SELECT COUNT(DISTINCT l.id) as sensitiveCount 
    FROM logs l
    INNER JOIN catalog c ON MD5(l.path) = c.item_path_hash
    WHERE c.sensitive = 1
  `;
  
  const result = await executeQuery<{ sensitiveCount: number }[]>(query);
  return result[0]?.sensitiveCount || 0;
};

/**
 * Query: Variação de acessos sensíveis (últimas 24h vs 24h anteriores)
 * Retorna a porcentagem de mudança
 */
export const getSensitiveAccessesChange = async (): Promise<number> => {
  const query = `
    SELECT 
      (COUNT(CASE WHEN l.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) - 
       COUNT(CASE WHEN l.timestamp >= DATE_SUB(NOW(), INTERVAL 48 HOUR) 
                    AND l.timestamp < DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END)) * 100.0 /
      NULLIF(COUNT(CASE WHEN l.timestamp >= DATE_SUB(NOW(), INTERVAL 48 HOUR) 
                         AND l.timestamp < DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END), 0) as changePercent
    FROM logs l
    INNER JOIN catalog c ON MD5(l.path) = c.item_path_hash
    WHERE c.sensitive = 1
  `;
  
  const result = await executeQuery<{ changePercent: number | null }[]>(query);
  return Math.round(result[0]?.changePercent || 0);
};

/**
 * Query: Total de armazenamento em bytes
 * SELECT SUM(size_bytes) as totalSize FROM catalog WHERE item_type = 'file'
 */
export const getTotalStorage = async (): Promise<number> => {
  const query = `
    SELECT COALESCE(SUM(size_bytes), 0) as totalSize 
    FROM catalog 
    WHERE item_type = 'file'
  `;
  
  const result = await executeQuery<{ totalSize: number }[]>(query);
  return result[0]?.totalSize || 0;
};

/**
 * Query: Variação de armazenamento (comparando last_seen nas últimas 24h)
 */
export const getTotalStorageChange = async (): Promise<number> => {
  const query = `
    SELECT 
      ((SELECT COALESCE(SUM(size_bytes), 0) FROM catalog 
        WHERE item_type = 'file' AND last_seen >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) -
       (SELECT COALESCE(SUM(size_bytes), 0) FROM catalog 
        WHERE item_type = 'file' AND last_seen >= DATE_SUB(NOW(), INTERVAL 48 HOUR) 
        AND last_seen < DATE_SUB(NOW(), INTERVAL 24 HOUR))) * 100.0 /
      NULLIF((SELECT COALESCE(SUM(size_bytes), 1) FROM catalog 
              WHERE item_type = 'file' AND last_seen >= DATE_SUB(NOW(), INTERVAL 48 HOUR) 
              AND last_seen < DATE_SUB(NOW(), INTERVAL 24 HOUR)), 0) as changePercent
  `;
  
  const result = await executeQuery<{ changePercent: number | null }[]>(query);
  return Math.round(result[0]?.changePercent || 0);
};

/**
 * Query: Variação de arquivos (últimas 24h vs 24h anteriores)
 */
export const getTotalFilesChange = async (): Promise<number> => {
  const query = `
    SELECT 
      ((SELECT COUNT(*) FROM catalog 
        WHERE item_type = 'file' AND last_seen >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) -
       (SELECT COUNT(*) FROM catalog 
        WHERE item_type = 'file' AND last_seen >= DATE_SUB(NOW(), INTERVAL 48 HOUR) 
        AND last_seen < DATE_SUB(NOW(), INTERVAL 24 HOUR))) * 100.0 /
      NULLIF((SELECT COUNT(*) FROM catalog 
              WHERE item_type = 'file' AND last_seen >= DATE_SUB(NOW(), INTERVAL 48 HOUR) 
              AND last_seen < DATE_SUB(NOW(), INTERVAL 24 HOUR)), 0) as changePercent
  `;
  
  const result = await executeQuery<{ changePercent: number | null }[]>(query);
  return Math.round(result[0]?.changePercent || 0);
};

/**
 * Query: Total de eventos registrados
 * SELECT COUNT(*) as totalEvents FROM logs
 */
export const getTotalEvents = async (): Promise<number> => {
  const query = `
    SELECT COUNT(*) as totalEvents 
    FROM logs
  `;
  
  const result = await executeQuery<{ totalEvents: number }[]>(query);
  return result[0]?.totalEvents || 0;
};

/**
 * Query: Logs mais recentes
 * SELECT * FROM logs ORDER BY timestamp DESC LIMIT ?
 */
export const getRecentLogs = async (limit: number = 50): Promise<LogEntry[]> => {
  const query = `
    SELECT 
      id,
      timestamp,
      event,
      path,
      root_path,
      details,
      user_name,
      hostname,
      ip_address,
      synced_to_external,
      flag
    FROM logs 
    ORDER BY timestamp DESC 
    LIMIT ${limit}
  `;
  
  const result = await executeQuery<LogEntry[]>(query);
  return result || [];
};

/**
 * Query: Resumo de eventos agrupados
 * SELECT event, COUNT(*) as count FROM logs GROUP BY event ORDER BY count DESC
 */
export const getEventSummary = async (): Promise<EventSummary[]> => {
  const query = `
    SELECT 
      event,
      COUNT(*) as count,
      (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM logs)) as percentage
    FROM logs 
    GROUP BY event 
    ORDER BY count DESC
  `;
  
  const result = await executeQuery<EventSummary[]>(query);
  return result || [];
};

/**
 * Retorna todas as métricas de uma vez para otimizar as chamadas
 */
export const getAllMetrics = async (): Promise<MetricData> => {
  const [
    totalFiles,
    totalFilesChange,
    totalDirectories,
    lastSensitiveAccess,
    sensitiveAccesses,
    sensitiveAccessesChange,
    totalStorage,
    totalStorageChange,
    totalEvents,
  ] = await Promise.all([
    getTotalFiles(),
    getTotalFilesChange(),
    getTotalDirectories(),
    getLastSensitiveAccess(),
    getSensitiveAccesses(),
    getSensitiveAccessesChange(),
    getTotalStorage(),
    getTotalStorageChange(),
    getTotalEvents(),
  ]);

  return {
    totalFiles,
    totalFilesChange,
    totalDirectories,
    totalDirectoriesChange: 0, // Não há histórico de mudança para diretórios no schema atual
    lastSensitiveAccess,
    sensitiveAccesses,
    sensitiveAccessesChange,
    totalStorage,
    totalStorageChange,
    totalEvents,
  };
};

// Utilitário para formatar bytes
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Utilitário para formatar números com separador de milhares
export const formatNumber = (num: number): string => {
  return num.toLocaleString("pt-BR");
};

/**
 * Insert: Adiciona nova configuração de sensibilidade
 * INSERT INTO root_sensitivity (root_path, sensitive) VALUES (?, ?)
 */
export const insertRootSensitivity = async (rootPath: string, sensitive: number): Promise<void> => {
  const query = `
    INSERT INTO root_sensitivity (root_path, sensitive) 
    VALUES ('${rootPath.replace(/'/g, "''")}', ${sensitive})
  `;
  
  await executeQuery(query);
};
