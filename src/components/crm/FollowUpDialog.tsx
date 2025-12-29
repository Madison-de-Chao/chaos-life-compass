import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerFollowUp } from "@/hooks/useCRM";
import { Loader2 } from "lucide-react";

interface FollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    due_date: string;
    priority?: "low" | "medium" | "high" | "urgent";
  }) => Promise<void>;
  initialData?: CustomerFollowUp | null;
}

const PRIORITIES = [
  { value: "low", label: "低", color: "text-slate-500" },
  { value: "medium", label: "中", color: "text-blue-500" },
  { value: "high", label: "高", color: "text-orange-500" },
  { value: "urgent", label: "緊急", color: "text-red-500" },
];

export function FollowUpDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: FollowUpDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    due_date: initialData?.due_date
      ? new Date(initialData.due_date).toISOString().slice(0, 16)
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    priority: (initialData?.priority || "medium") as "low" | "medium" | "high" | "urgent",
  });

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.due_date) return;
    setLoading(true);
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        due_date: new Date(formData.due_date).toISOString(),
        priority: formData.priority,
      });
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        priority: "medium",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "編輯跟進提醒" : "新增跟進提醒"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>標題 *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="提醒事項"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>到期日期 *</Label>
              <Input
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>優先級</Label>
              <Select
                value={formData.priority}
                onValueChange={(v: any) =>
                  setFormData({ ...formData, priority: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <span className={p.color}>{p.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>描述</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="補充說明..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim() || !formData.due_date}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {initialData ? "儲存" : "新增"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
