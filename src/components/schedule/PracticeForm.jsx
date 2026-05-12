const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useQueryClient } from "@tanstack/react-query";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PracticeForm({ open, onClose, editingSession }) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(editingSession || {
    title: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    is_recurring: true,
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editingSession?.id) {
      await db.entities.PracticeSession.update(editingSession.id, form);
    } else {
      await db.entities.PracticeSession.create(form);
    }
    queryClient.invalidateQueries({ queryKey: ["practice-sessions"] });
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {editingSession?.id ? "Edit Practice" : "Add Practice"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Practice Name</Label>
            <Input
              placeholder="e.g. Soccer, Band"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Day of the Week</Label>
            <Select value={form.day_of_week} onValueChange={(v) => handleChange("day_of_week", v)} required>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={form.start_time}
                onChange={(e) => handleChange("start_time", e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={form.end_time}
                onChange={(e) => handleChange("end_time", e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-xl" disabled={saving || !form.title || !form.day_of_week}>
            {saving ? "Saving..." : editingSession?.id ? "Update" : "Add Practice"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}