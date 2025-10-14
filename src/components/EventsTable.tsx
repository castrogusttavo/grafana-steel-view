import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getRecentLogs, LogEntry } from "@/lib/database";
import { Badge } from "@/components/ui/badge";

export const EventsTable = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getRecentLogs(7);
      setLogs(data);
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEventBadgeVariant = (event: string) => {
    switch (event.toLowerCase()) {
      case "criado":
        return "default";
      case "deletado":
        return "destructive";
      case "alterado":
        return "secondary";
      case "renomeado":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).replace(",", "");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/20">
            <FileText className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-lg font-semibold">Eventos Recentes</h3>
        </div>
        <span className="text-sm text-muted-foreground">{filteredLogs.length} eventos</span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar eventos, caminhos ou usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-secondary/50 border-border"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Evento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Caminho
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Root Path
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usuário
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  #{log.id}
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getEventBadgeVariant(log.event)}>
                    {log.event}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
                  {log.path}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                  {log.root_path}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {log.user_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
