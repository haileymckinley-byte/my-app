const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useQuery } from "@tanstack/react-query";

import { Loader2, BookOpen, Clock, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const COLORS = [
  "hsl(246, 65%, 57%)",
  "hsl(16, 85%, 61%)",
  "hsl(173, 58%, 39%)",
  "hsl(43, 74%, 66%)",
  "hsl(280, 65%, 60%)",
  "hsl(200, 60%, 50%)",
  "hsl(340, 75%, 55%)",
  "hsl(120, 50%, 45%)",
];

export default function FocusInsights() {
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => db.entities.Assignment.list("-created_date"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Group by class
  const byClass = {};
  assignments.forEach(a => {
    if (!byClass[a.class_name]) byClass[a.class_name] = { total: 0, done: 0, minutes: 0 };
    byClass[a.class_name].total += 1;
    if (a.status === "done") byClass[a.class_name].done += 1;
    byClass[a.class_name].minutes += a.estimated_minutes || 0;
  });

  const classData = Object.entries(byClass).map(([name, data]) => ({
    name,
    tasks: data.total,
    done: data.done,
    pending: data.total - data.done,
    minutes: data.minutes,
  }));

  const pieData = classData.map(d => ({ name: d.name, value: d.minutes })).filter(d => d.value > 0);
  
  // Focus recommendation
  const needsFocus = classData
    .filter(d => d.pending > 0)
    .sort((a, b) => b.pending - a.pending);

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Focus Insights</h1>
        <p className="text-sm text-muted-foreground mt-0.5">See where your time is going.</p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">Add some assignments to see your focus breakdown!</p>
        </div>
      ) : (
        <>
          {/* Focus Recommendation */}
          {needsFocus.length > 0 && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <h3 className="font-heading font-semibold text-sm">Focus More On</h3>
              </div>
              <div className="space-y-2">
                {needsFocus.slice(0, 3).map((cls, i) => (
                  <div key={cls.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{i + 1}.</span>
                      <span className="text-sm">{cls.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{cls.pending} tasks left</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time by Class Pie Chart */}
          {pieData.length > 0 && (
            <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm">
              <h3 className="font-heading font-semibold text-sm mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Time by Class
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}m`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks by Class Bar Chart */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm">
            <h3 className="font-heading font-semibold text-sm mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Tasks by Class
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classData} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="done" stackId="a" fill="hsl(160, 60%, 45%)" radius={[0, 0, 0, 0]} name="Done" />
                  <Bar dataKey="pending" stackId="a" fill="hsl(246, 65%, 57%)" radius={[0, 4, 4, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}