const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import PracticeForm from "@/components/schedule/PracticeForm";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Schedule() {
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["practice-sessions"],
    queryFn: () => db.entities.PracticeSession.list(),
  });

  const grouped = DAYS_ORDER.reduce((acc, day) => {
    const daySessions = sessions.filter(s => s.day_of_week === day);
    if (daySessions.length > 0) acc[day] = daySessions;
    return acc;
  }, {});

  const handleEdit = (session) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await db.entities.PracticeSession.delete(id);
    queryClient.invalidateQueries({ queryKey: ["practice-sessions"] });
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingSession(null);
  };

  const today = DAYS_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold">Practice Schedule</h1>
        <Button size="sm" className="rounded-xl gap-1.5" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No practice sessions yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([day, daySessions]) => (
            <div key={day}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-heading font-semibold text-sm">{day}</h3>
                {day === today && (
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {daySessions.map(session => (
                  <div key={session.id} className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 bg-primary rounded-full" />
                      <div>
                        <p className="font-medium text-sm">{session.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.start_time} — {session.end_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(session)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(session.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PracticeForm open={showForm} onClose={handleClose} editingSession={editingSession} />
      )}
    </div>
  );
}