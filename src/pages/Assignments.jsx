const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AssignmentCard from "@/components/assignments/AssignmentCard";
import AssignmentForm from "@/components/assignments/AssignmentForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";

export default function Assignments() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("active");

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => db.entities.Assignment.list("-created_date"),
  });

  const filtered = assignments.filter(a => {
    if (filter === "active") return a.status !== "done";
    if (filter === "done") return a.status === "done";
    if (filter === "stuck") return a.status === "stuck";
    return true;
  });

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

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
        <h1 className="font-heading text-xl font-bold">Assignments</h1>
        <Button size="sm" className="rounded-xl gap-1.5" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1 text-xs">Active</TabsTrigger>
          <TabsTrigger value="stuck" className="flex-1 text-xs">Stuck</TabsTrigger>
          <TabsTrigger value="done" className="flex-1 text-xs">Done</TabsTrigger>
          <TabsTrigger value="all" className="flex-1 text-xs">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              {filter === "active" ? "No active assignments!" : "Nothing here yet."}
            </p>
          </div>
        ) : (
          filtered.map(task => (
            <AssignmentCard key={task.id} task={task} onEdit={handleEdit} />
          ))
        )}
      </div>

      {showForm && (
        <AssignmentForm open={showForm} onClose={handleClose} editingTask={editingTask} />
      )}
    </div>
  );
}