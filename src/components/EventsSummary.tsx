import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { getEventSummary, getTotalEvents, EventSummary } from "@/lib/database";

export const EventsSummary = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [events, setEvents] = useState<EventSummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const total = await getTotalEvents();
        const summary = await getEventSummary();
        setTotalEvents(total);
        setEvents(summary);
      } catch (error) {
        console.error("Erro ao carregar resumo de eventos:", error);
        // Mantém valores vazios em caso de erro
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-success/20">
          <Activity className="h-5 w-5 text-success" />
        </div>
        <h3 className="text-lg font-semibold">Resumo de Ações</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Distribuição de eventos do sistema
      </p>

      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground uppercase">Total</span>
          <div className="ml-auto">
            <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-semibold">
              {totalEvents.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>

        <div className="py-2">
          <p className="text-3xl font-bold">{totalEvents.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-muted-foreground">eventos registrados</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">Evento</span>
            <span className="text-muted-foreground">Total</span>
          </div>
          
          {events.map((event) => (
            <div key={event.event} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{event.event}</span>
                <span className="text-muted-foreground">{event.percentage}%</span>
                <span className="font-semibold text-foreground">
                  {event.count.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${event.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
