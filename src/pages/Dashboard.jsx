const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useQuery } from "@tanstack/react-query";

import QuickStats from "@/components/dashboard/QuickStats";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import ReminderPopup from "@/components/dashboard/ReminderPopup";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: assignments = [], isLoading: loadingA } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => db.entities.Assignment.list("-created_date"),
  });

  const { data: sessions = [], isLoading: loadingS } = useQuery({
    queryKey: ["practice-sessions"],
    queryFn: () => db.entities.PracticeSession.list(),
  });

  if (loadingA || loadingS) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Tracking Tactics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Stay on top of your game — on and off the field.</p>
      </div>

      <QuickStats assignments={assignments} />
      <TodaySchedule sessions={sessions} />
      <UpcomingTasks assignments={assignments} />
      <ReminderPopup assignments={assignments} />
    </div>
  );
}