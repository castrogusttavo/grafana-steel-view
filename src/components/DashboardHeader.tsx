import { Database, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const currentTime = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-success/20">
              <Database className="h-6 w-6 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SteelFlow Monitor</h1>
              <p className="text-sm text-muted-foreground">
                Sistema de monitoramento de arquivos em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                  <span className="h-2 w-2 rounded-full bg-success mr-2 animate-pulse" />
                  Ativo
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 6 horas UTC
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate("/sensitivity-config")}
            >
              <Shield className="h-4 w-4" />
              Configurar Sensibilidade
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <span>Página inicial</span>
          <span>/</span>
          <span>Painéis de controle</span>
          <span>/</span>
          <span className="text-foreground font-medium">File Server</span>
        </div>
      </div>
    </header>
  );
};
