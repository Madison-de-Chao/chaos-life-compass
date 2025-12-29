import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomerTagBadge } from "./CustomerTagBadge";
import { useCustomerTags, useCustomerTagAssignments, CustomerTag } from "@/hooks/useCRM";
import { toast } from "@/hooks/use-toast";
import { Plus, Tag, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerTagSelectorProps {
  customerId: string;
}

const TAG_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#64748b",
];

export function CustomerTagSelector({ customerId }: CustomerTagSelectorProps) {
  const { tags, loading: tagsLoading, createTag } = useCustomerTags();
  const { assignments, assignTag, removeTag } = useCustomerTagAssignments(customerId);
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const assignedTagIds = assignments.map((a) => a.tag_id);

  const handleToggleTag = async (tag: CustomerTag) => {
    try {
      if (assignedTagIds.includes(tag.id)) {
        await removeTag(tag.id);
        toast({ title: `已移除標籤「${tag.name}」` });
      } else {
        await assignTag(tag.id);
        toast({ title: `已添加標籤「${tag.name}」` });
      }
    } catch (error: any) {
      toast({
        title: "操作失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setCreating(true);
    try {
      const newTag = await createTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      await assignTag(newTag.id);
      setNewTagName("");
      setShowCreateForm(false);
      toast({ title: `已建立並添加標籤「${newTagName}」` });
    } catch (error: any) {
      toast({
        title: "建立標籤失敗",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Current Tags */}
      <div className="flex flex-wrap gap-1.5">
        {assignments.map((assignment) => (
          <CustomerTagBadge
            key={assignment.id}
            name={assignment.tag?.name || ""}
            color={assignment.tag?.color || "#888"}
            onRemove={() => removeTag(assignment.tag_id)}
          />
        ))}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
              <Tag className="w-3 h-3" />
              管理標籤
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground px-1">
                選擇標籤
              </div>

              {tagsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {tags.map((tag) => {
                    const isAssigned = assignedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleToggleTag(tag)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors",
                          isAssigned
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="flex-1 truncate">{tag.name}</span>
                        {isAssigned && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="border-t pt-2">
                {showCreateForm ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="標籤名稱"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <div className="flex gap-1 flex-wrap">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewTagColor(color)}
                          className={cn(
                            "w-5 h-5 rounded-full transition-transform",
                            newTagColor === color && "ring-2 ring-offset-1 ring-primary scale-110"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs"
                        onClick={handleCreateTag}
                        disabled={creating || !newTagName.trim()}
                      >
                        {creating && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                        建立
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewTagName("");
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs gap-1"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus className="w-3 h-3" />
                    新增標籤
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
