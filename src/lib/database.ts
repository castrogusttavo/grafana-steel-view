// Mock database queries - SteelFlow Monitor
// Estrutura baseada no schema MySQL fornecido

export interface LogEntry {
  id: number;
  timestamp: string;
  event: string;
  path: string;
  root_path: string;
  details: string | null;
  user_name: string;
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

// Mock data baseado no screenshot
const mockMetrics: MetricData = {
  totalFiles: 146854,
  totalFilesChange: 12,
  totalDirectories: 0,
  totalDirectoriesChange: 0,
  lastSensitiveAccess: null,
  sensitiveAccesses: 19288,
  sensitiveAccessesChange: 8,
  totalStorage: 21243707392, // 19.79 GB
  totalStorageChange: 5,
  totalEvents: 4529,
};

const mockLogs: LogEntry[] = [
  {
    id: 28844,
    timestamp: "2025-10-13T20:20:34",
    event: "Deletado",
    path: "E:\\Publica\\DEPARTAMENTOS",
    root_path: "E:\\Publica\\DEPARTAMENTOS",
    details: null,
    user_name: "administrad",
    ip_address: "192.168.1.100",
    synced_to_external: false,
    flag: 0,
  },
  {
    id: 28845,
    timestamp: "2025-10-13T20:20:34",
    event: "Alterado",
    path: "E:\\Publica\\DEPARTAMENTOS",
    root_path: "E:\\Publica\\DEPARTAMENTOS",
    details: null,
    user_name: "administrad",
    ip_address: "192.168.1.100",
    synced_to_external: false,
    flag: 0,
  },
  {
    id: 28841,
    timestamp: "2025-10-13T19:59:25",
    event: "Criado",
    path: "E:\\Publica\\DEPARTAMENTOS",
    root_path: "E:\\Publica\\DEPARTAMENTOS",
    details: null,
    user_name: "administrad",
    ip_address: "192.168.1.100",
    synced_to_external: false,
    flag: 0,
  },
  {
    id: 28840,
    timestamp: "2025-10-13T19:45:12",
    event: "Renomeado",
    path: "E:\\Publica\\DEPARTAMENTOS\\Financeiro",
    root_path: "E:\\Publica\\DEPARTAMENTOS",
    details: null,
    user_name: "administrad",
    ip_address: "192.168.1.100",
    synced_to_external: false,
    flag: 0,
  },
  {
    id: 28839,
    timestamp: "2025-10-13T19:30:08",
    event: "Criado",
    path: "E:\\Publica\\DEPARTAMENTOS\\RH",
    root_path: "E:\\Publica\\DEPARTAMENTOS",
    details: null,
    user_name: "administrad",
    ip_address: "192.168.1.100",
    synced_to_external: false,
    flag: 0,
  },
  {
    id: 28838,
    timestamp: "2025-10-13T19:15:03",
    event: "Criado",
    path: "E:\\Publica\\DEPARTAMENTOS\\TI",
    root_path: "E:\\Publica\\DEPARTAMENTOS",
    details: null,
    user_name: "administrad",
    ip_address: "192.168.1.100",
    synced_to_external: false,
    flag: 0,
  },
  {
    id: 28837,
    timestamp: "2025-10-13T19:00:45",
    event: "Alterado",
    path: "E:\\Publica\\DEPARTAMENTOS\\Marketing",
    root_path: "E:\\Publica\\DEPARTAMENTOS",
    details: null,
    user_name: "administrad",
    ip_address: "192.168.1.100",
    synced_to_external: false,
    flag: 0,
  },
];

const mockEventSummary: EventSummary[] = [
  { event: "Criado", count: 3129, percentage: 69.1 },
  { event: "Renomeado", count: 1400, percentage: 30.9 },
];

// Query simuladas (SQL comentados para referência)

/**
 * SELECT COUNT(*) as totalFiles 
 * FROM catalog 
 * WHERE item_type = 'file'
 */
export const getTotalFiles = (): Promise<number> => {
  return Promise.resolve(mockMetrics.totalFiles);
};

/**
 * SELECT COUNT(*) as totalDirectories 
 * FROM catalog 
 * WHERE item_type = 'directory'
 */
export const getTotalDirectories = (): Promise<number> => {
  return Promise.resolve(mockMetrics.totalDirectories);
};

/**
 * SELECT MAX(timestamp) as lastAccess 
 * FROM logs 
 * WHERE event LIKE '%sensitive%'
 */
export const getLastSensitiveAccess = (): Promise<string | null> => {
  return Promise.resolve(mockMetrics.lastSensitiveAccess);
};

/**
 * SELECT COUNT(*) as sensitiveCount 
 * FROM logs 
 * WHERE flag = 1 OR path IN (
 *   SELECT c.item_path 
 *   FROM catalog c 
 *   WHERE c.sensitive = 1
 * )
 */
export const getSensitiveAccesses = (): Promise<number> => {
  return Promise.resolve(mockMetrics.sensitiveAccesses);
};

/**
 * SELECT SUM(size_bytes) as totalSize 
 * FROM catalog 
 * WHERE item_type = 'file'
 */
export const getTotalStorage = (): Promise<number> => {
  return Promise.resolve(mockMetrics.totalStorage);
};

/**
 * SELECT COUNT(*) as totalEvents 
 * FROM logs
 */
export const getTotalEvents = (): Promise<number> => {
  return Promise.resolve(mockMetrics.totalEvents);
};

/**
 * SELECT * FROM logs 
 * ORDER BY timestamp DESC 
 * LIMIT 50
 */
export const getRecentLogs = (limit: number = 50): Promise<LogEntry[]> => {
  return Promise.resolve(mockLogs.slice(0, limit));
};

/**
 * SELECT event, COUNT(*) as count 
 * FROM logs 
 * GROUP BY event 
 * ORDER BY count DESC
 */
export const getEventSummary = (): Promise<EventSummary[]> => {
  return Promise.resolve(mockEventSummary);
};

/**
 * Retorna todas as métricas de uma vez
 */
export const getAllMetrics = (): Promise<MetricData> => {
  return Promise.resolve(mockMetrics);
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
