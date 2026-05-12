import { BookOpen, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function QuickStats({ assignments }) {
  const todo = assignments.filter(a => a.status === "todo").length;
  const inProgress = assignments.filter(a => a.status === "in_progress").length;
  const stuck = assignments.filter(a => a.status === "stuck").length;
  const done = assignments.filter(a => a.status === "done").length;

  const totalMinutes = assignments
    .filter(a => a.status !== "done")
    .reduce((sum, a) => sum + (a.estimated_minutes || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const stats = [
    { label: "To Do", value: todo, icon: BookOpen, color: "text-primary bg-primary/10" },
    { label: "In Progress", value: inProgress, icon: Clock, color: "text-accent bg-accent/10" },
    { label: "Stuck", value: stuck, icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
    { label: "Done", value: done, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalMinutes > 0 && (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Estimated time remaining</p>
          <p className="text-xl font-heading font-bold text-primary">
            {hours > 0 ? `${hours}h ` : ""}{mins}m
          </p>
        </div>
      )}
    </div>
  );
}