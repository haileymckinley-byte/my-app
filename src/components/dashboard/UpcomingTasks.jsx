import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format, isToday, isTomorrow, isPast } from "date-fns";

const statusStyles = {
  todo: "bg-primary/10 text-primary border-primary/20",
  in_progress: "bg-accent/10 text-accent border-accent/20",
  stuck: "bg-destructive/10 text-destructive border-destructive/20",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const timingLabels = {
  before_practice: "Before Practice",
  after_practice: "After Practice",
  either: "Flexible",
};

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isPast(date)) return "Overdue";
  return format(date, "MMM d");
}

export default function UpcomingTasks({ assignments }) {
  const upcoming = assignments
    .filter(a => a.status !== "done")
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    })
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-8 text-center shadow-sm">
        <p className="text-muted-foreground text-sm">No upcoming tasks — nice work! 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">Upcoming</h2>
        <Link to="/assignments" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="space-y-2">
        {upcoming.map(task => {
          const dueLabel = formatDueDate(task.due_date);
          const isOverdue = dueLabel === "Overdue";
          return (
            <div key={task.id} className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px] px-2 py-0 font-medium">
                      {task.class_name}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{task.estimated_minutes || "?"}m
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {timingLabels[task.timing] || "Flexible"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge className={`text-[10px] px-2 py-0 border ${statusStyles[task.status]}`}>
                    {task.status.replace("_", " ")}
                  </Badge>
                  {dueLabel && (
                    <span className={`text-[10px] font-medium ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                      {dueLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}