const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, ArrowRight, HelpCircle } from "lucide-react";

export default function ReminderPopup({ assignments }) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState(null);

  useEffect(() => {
    const stuckOrUrgent = assignments.filter(a => {
      if (a.status === "done") return false;
      if (a.status === "stuck") return true;
      if (a.due_date) {
        const diff = new Date(a.due_date) - new Date();
        const hoursLeft = diff / (1000 * 60 * 60);
        return hoursLeft < 24 && hoursLeft > 0;
      }
      return false;
    });

    if (stuckOrUrgent.length > 0) {
      const timer = setTimeout(() => {
        setTask(stuckOrUrgent[0]);
        setOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [assignments]);

  const handleMarkInProgress = async () => {
    if (task) {
      await db.entities.Assignment.update(task.id, { status: "in_progress" });
      setOpen(false);
    }
  };

  if (!task) return null;

  const isStuck = task.status === "stuck";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            {isStuck ? (
              <div className="p-2 rounded-xl bg-destructive/10">
                <HelpCircle className="w-5 h-5 text-destructive" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-accent/10">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
            )}
            <DialogTitle className="font-heading">
              {isStuck ? "Need Help?" : "Friendly Reminder"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {isStuck
              ? "Looks like you're stuck on this one. Try breaking it into smaller steps or asking for help!"
              : "This task is due soon — you've got this!"}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted rounded-2xl p-4 my-2">
          <p className="font-medium text-sm">{task.title}</p>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="text-[10px]">{task.class_name}</Badge>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~{task.estimated_minutes || "?"}m
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setOpen(false)}>
            Later
          </Button>
          <Button className="flex-1 rounded-xl bg-primary" onClick={handleMarkInProgress}>
            Start Now <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}