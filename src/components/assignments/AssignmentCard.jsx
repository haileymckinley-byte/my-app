import { Badge } from "@/components/ui/badge";
import db from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  MoreVertical,
  CheckCircle2,
  Play,
  AlertTriangle,
  Pencil,
  Trash2,
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { format, isPast, isToday, isTomorrow } from "date-fns";

const statusConfig = {
  todo: {
    label: "To Do",
    style: "bg-primary/10 text-primary border-primary/20",
  },
  in_progress: {
    label: "In Progress",
    style: "bg-accent/10 text-accent border-accent/20",
  },
  stuck: {
    label: "Stuck",
    style: "bg-destructive/10 text-destructive border-destructive/20",
  },
  done: {
    label: "Done",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const priorityDots = {
  low: "bg-emerald-400",
  medium: "bg-amber-400",
  high: "bg-destructive",
};

function formatDue(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isPast(d)) return "Overdue";
  return format(d, "MMM d");
}

export default function AssignmentCard({ task, onEdit }) {
  const queryClient = useQueryClient();
  const cfg = statusConfig[task.status] || statusConfig.todo;
  const dueLabel = formatDue(task.due_date);
  const isOverdue = dueLabel === "Overdue";

  const updateStatus = async (status) => {
    await db.entities.Assignment.update(task.id, { status });
    queryClient.invalidateQueries({ queryKey: ["assignments"] });
  };

  const deleteTask = async () => {
    await db.entities.Assignment.delete(task.id);
    queryClient.invalidateQueries({ queryKey: ["assignments"] });
  };

  return (
    <div
      className={`bg-card rounded-2xl border border-border/50 p-4 shadow-sm transition-all duration-200 ${task.status === "done" ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-2 h-2 rounded-full mt-2 shrink-0 ${priorityDots[task.priority]}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`font-medium text-sm ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateStatus("todo")}>
                  <Clock className="w-3.5 h-3.5 mr-2" /> Mark To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus("in_progress")}>
                  <Play className="w-3.5 h-3.5 mr-2" /> Start Working
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus("stuck")}>
                  <AlertTriangle className="w-3.5 h-3.5 mr-2" /> Mark Stuck
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus("done")}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Mark Done
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={deleteTask}
                  className="text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0 font-medium rounded-lg"
            >
              {task.class_name}
            </Badge>
            <Badge
              className={`text-[10px] px-2 py-0 border ${cfg.style} rounded-lg`}
            >
              {cfg.label}
            </Badge>
            {task.estimated_minutes && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {task.estimated_minutes}m
              </span>
            )}
            {dueLabel && (
              <span
                className={`text-[10px] font-medium ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
              >
                {dueLabel}
              </span>
            )}
          </div>
          {task.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {task.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
