import { CalendarDays } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TodaySchedule({ sessions }) {
  const today = DAYS[new Date().getDay()];
  const todaySessions = sessions.filter(s => s.day_of_week === today);

  if (todaySessions.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-sm">Today's Practice</h3>
        </div>
        <p className="text-sm text-muted-foreground">No practice scheduled today — extra study time!</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-4 h-4 text-primary" />
        <h3 className="font-heading font-semibold text-sm">Today's Practice</h3>
      </div>
      <div className="space-y-3">
        {todaySessions.map(session => (
          <div key={session.id} className="flex items-center gap-3">
            <div className="w-1 h-10 bg-accent rounded-full" />
            <div>
              <p className="font-medium text-sm">{session.title}</p>
              <p className="text-xs text-muted-foreground">
                {session.start_time} — {session.end_time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}