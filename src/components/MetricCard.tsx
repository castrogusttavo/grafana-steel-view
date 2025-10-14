import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  className?: string;
}

export const MetricCard = ({ title, value, icon: Icon, change, className }: MetricCardProps) => {
  return (
    <Card className={cn("metric-card p-6 relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
            <Icon className="h-4 w-4 text-success" />
            {title}
          </div>
          <p className="text-4xl font-bold text-foreground">{value}</p>
        </div>
        
        {change !== undefined && change !== 0 && (
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
            change > 0 
              ? "bg-destructive/20 text-destructive" 
              : "bg-success/20 text-success"
          )}>
            <span>{change > 0 ? "+" : ""}{change}%</span>
          </div>
        )}
      </div>
      
      <div className="absolute top-4 right-4 opacity-10">
        <Icon className="h-16 w-16" />
      </div>
    </Card>
  );
};
