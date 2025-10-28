// API Backend Configuration
// Este arquivo gerencia as chamadas para o backend que executa as queries MySQL

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface QueryRequest {
  query: string;
  params?: any[];
}

interface QueryResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Executa uma query SQL via backend API
 */
export async function executeQuery<T>(query: string, params?: any[]): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, params } as QueryRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: QueryResponse<T> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Query falhou");
    }

    return result.data;
  } catch (error) {
    console.error("Erro ao executar query:", error);
    throw error;
  }
}

/**
 * Health check da API
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("API não está disponível:", error);
    return false;
  }
}

/**
 * Insert seguro para root_sensitivity (usa endpoint dedicado)
 */
export async function insertRootSensitivityRequest(rootPath: string, sensitive: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/root-sensitivity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ root_path: rootPath, sensitive }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Falha ao inserir configuração");
  }
}
