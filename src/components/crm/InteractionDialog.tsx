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
import { CustomerInteraction } from "@/hooks/useCRM";
import { Phone, Users, Mail, MessageSquare, FileText, MoreHorizontal, Loader2 } from "lucide-react";

interface InteractionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    interaction_type: string;
    title: string;
    content?: string;
    interaction_date?: string;
  }) => Promise<void>;
  initialData?: CustomerInteraction | null;
}

const INTERACTION_TYPES = [
  { value: "call", label: "電話", icon: Phone },
  { value: "meeting", label: "會議", icon: Users },
  { value: "email", label: "Email", icon: Mail },
  { value: "message", label: "訊息", icon: MessageSquare },
  { value: "note", label: "備註", icon: FileText },
  { value: "other", label: "其他", icon: MoreHorizontal },
];

export function InteractionDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: InteractionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interaction_type: initialData?.interaction_type || "note",
    title: initialData?.title || "",
    content: initialData?.content || "",
    interaction_date: initialData?.interaction_date
      ? new Date(initialData.interaction_date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        interaction_type: formData.interaction_type,
        title: formData.title.trim(),
        content: formData.content.trim() || undefined,
        interaction_date: formData.interaction_date
          ? new Date(formData.interaction_date).toISOString()
          : undefined,
      });
      onOpenChange(false);
      setFormData({
        interaction_type: "note",
        title: "",
        content: "",
        interaction_date: new Date().toISOString().slice(0, 16),
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
            {initialData ? "編輯互動紀錄" : "新增互動紀錄"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>互動類型</Label>
            <Select
              value={formData.interaction_type}
              onValueChange={(v) =>
                setFormData({ ...formData, interaction_type: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERACTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>標題 *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="互動摘要"
            />
          </div>

          <div className="space-y-2">
            <Label>日期時間</Label>
            <Input
              type="datetime-local"
              value={formData.interaction_date}
              onChange={(e) =>
                setFormData({ ...formData, interaction_date: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>詳細內容</Label>
            <Textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="記錄互動詳情..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim()}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {initialData ? "儲存" : "新增"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
