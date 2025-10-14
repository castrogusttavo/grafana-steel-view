import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { EventsSummary } from "@/components/EventsSummary";
import { EventsTable } from "@/components/EventsTable";
import { FileText, FolderOpen, AlertTriangle, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllMetrics, formatBytes, formatNumber, MetricData } from "@/lib/database";
import { checkApiHealth } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verifica se a API está disponível
        const apiHealthy = await checkApiHealth();
        if (!apiHealthy) {
          throw new Error("Backend API não está disponível. Verifique se o servidor está rodando.");
        }

        const data = await getAllMetrics();
        setMetrics(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar dados";
        setError(errorMessage);
        console.error("Erro ao buscar métricas:", err);
        
        toast.error("Erro ao carregar dados", {
          description: "Verifique se o backend está configurado e rodando. Consulte BACKEND_SETUP.md",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-success border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Conectando ao banco de dados...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-2xl">
          <div className="mb-6">
            <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Erro ao Conectar ao Banco de Dados</h2>
            <p className="text-muted-foreground mb-4">
              {error || "Não foi possível carregar os dados"}
            </p>
          </div>
          
          <Card className="p-6 text-left">
            <h3 className="font-semibold mb-3">📋 Configuração Necessária:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Configure o backend Node.js (veja <code className="text-success bg-secondary px-2 py-1 rounded">BACKEND_SETUP.md</code>)</li>
              <li>Configure o arquivo <code className="text-success bg-secondary px-2 py-1 rounded">.env</code> com VITE_API_URL</li>
              <li>Certifique-se de que o banco MySQL está rodando</li>
              <li>Inicie o servidor backend na porta 3000</li>
            </ol>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Resumo de Ações */}
          <aside className="lg:col-span-1">
            <EventsSummary />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Métricas Principais */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Métricas Principais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  title="Total de Arquivos"
                  value={formatNumber(metrics.totalFiles)}
                  icon={FileText}
                  change={metrics.totalFilesChange}
                />
                <MetricCard
                  title="Total de Diretórios"
                  value={metrics.totalDirectories}
                  icon={FolderOpen}
                />
                <MetricCard
                  title="Último Acesso Sensível"
                  value={metrics.lastSensitiveAccess || "Sem dados"}
                  icon={AlertTriangle}
                />
              </div>
            </section>

            {/* Segurança e Armazenamento */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Segurança e Armazenamento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="Acessos Sensíveis"
                  value={formatNumber(metrics.sensitiveAccesses)}
                  icon={AlertTriangle}
                  change={metrics.sensitiveAccessesChange}
                />
                <MetricCard
                  title="Total em Armazenamento"
                  value={formatBytes(metrics.totalStorage)}
                  icon={Database}
                  change={metrics.totalStorageChange}
                />
              </div>
            </section>

            {/* Eventos Recentes */}
            <section>
              <EventsTable />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
