import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { EventsSummary } from "@/components/EventsSummary";
import { EventsTable } from "@/components/EventsTable";
import { FileText, FolderOpen, AlertTriangle, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllMetrics, formatBytes, formatNumber, MetricData } from "@/lib/database";

const Index = () => {
  const [metrics, setMetrics] = useState<MetricData | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await getAllMetrics();
      setMetrics(data);
    };
    fetchMetrics();
  }, []);

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-success border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
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
