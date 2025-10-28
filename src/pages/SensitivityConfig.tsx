import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { insertRootSensitivity } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function SensitivityConfig() {
  const [rootPath, setRootPath] = useState("");
  const [sensitive, setSensitive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rootPath.trim()) {
      toast({
        title: "Erro de validação",
        description: "O caminho do diretório é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (rootPath.length > 1024) {
      toast({
        title: "Erro de validação",
        description: "O caminho não pode ter mais de 1024 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await insertRootSensitivity(rootPath, sensitive ? 1 : 0);
      toast({
        title: "Sucesso!",
        description: "Configuração de sensibilidade salva com sucesso",
      });
      setRootPath("");
      setSensitive(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido ao salvar configuração",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto p-6 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-success/20">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Configurar Sensibilidade de Diretórios</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Defina quais diretórios devem ser marcados como sensíveis
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rootPath" className="text-base">
                Caminho do Diretório
              </Label>
              <Input
                id="rootPath"
                type="text"
                placeholder="Ex: C:\Users\Admin\Documents\Confidencial"
                value={rootPath}
                onChange={(e) => setRootPath(e.target.value)}
                maxLength={1024}
                className="bg-secondary/50 border-border"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Digite o caminho completo do diretório que deseja monitorar
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="space-y-1">
                <Label htmlFor="sensitive" className="text-base cursor-pointer">
                  Marcar como Sensível
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ative para monitorar acessos a este diretório
                </p>
              </div>
              <Switch
                id="sensitive"
                checked={sensitive}
                onCheckedChange={setSensitive}
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              {isSubmitting ? "Salvando..." : "Adicionar Configuração"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
