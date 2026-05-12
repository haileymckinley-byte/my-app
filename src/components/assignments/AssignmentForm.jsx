import { useState } from "react";
import db from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_CLASSES = [
  "Math",
  "English",
  "Science",
  "History",
  "Art",
  "PE",
  "Music",
  "Other",
];

export default function AssignmentForm({ open, onClose, editingTask }) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(
    editingTask || {
      title: "",
      class_name: "",
      estimated_minutes: "",
      due_date: "",
      timing: "either",
      priority: "medium",
      notes: "",
      status: "todo",
    },
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      estimated_minutes: form.estimated_minutes
        ? Number(form.estimated_minutes)
        : undefined,
    };
    if (editingTask?.id) {
      await db.entities.Assignment.update(editingTask.id, data);
    } else {
      await db.entities.Assignment.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ["assignments"] });
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {editingTask?.id ? "Edit Assignment" : "New Assignment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Assignment Title</Label>
            <Input
              placeholder="e.g. Chapter 5 Reading"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                value={form.class_name}
                onValueChange={(v) => handleChange("class_name", v)}
                required
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Est. Time (min)</Label>
              <Input
                type="number"
                placeholder="30"
                min={1}
                value={form.estimated_minutes}
                onChange={(e) =>
                  handleChange("estimated_minutes", e.target.value)
                }
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => handleChange("due_date", e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => handleChange("priority", v)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>When to do it</Label>
            <Select
              value={form.timing}
              onValueChange={(v) => handleChange("timing", v)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before_practice">Before Practice</SelectItem>
                <SelectItem value="after_practice">After Practice</SelectItem>
                <SelectItem value="either">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Any extra details..."
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={saving || !form.title || !form.class_name}
          >
            {saving
              ? "Saving..."
              : editingTask?.id
                ? "Update"
                : "Add Assignment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
