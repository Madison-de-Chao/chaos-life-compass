import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CustomerFollowUp, useCustomerFollowUps } from "@/hooks/useCRM";
import { FollowUpDialog } from "./FollowUpDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Plus, Clock, Trash2, Pencil, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowUpListProps {
  customerId: string;
}

const priorityConfig = {
  low: { label: "低", color: "text-slate-500 border-slate-300", bg: "bg-slate-50" },
  medium: { label: "中", color: "text-blue-500 border-blue-300", bg: "bg-blue-50" },
  high: { label: "高", color: "text-orange-500 border-orange-300", bg: "bg-orange-50" },
  urgent: { label: "緊急", color: "text-red-500 border-red-300", bg: "bg-red-50" },
};

export function FollowUpList({ customerId }: FollowUpListProps) {
  const { followUps, loading, createFollowUp, updateFollowUp, completeFollowUp, deleteFollowUp } =
    useCustomerFollowUps(customerId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<CustomerFollowUp | null>(null);

  const handleCreate = async (data: {
    title: string;
    description?: string;
    due_date: string;
    priority?: "low" | "medium" | "high" | "urgent";
  }) => {
    try {
      await createFollowUp(data);
      toast({ title: "跟進提醒已新增" });
    } catch (error: any) {
      toast({
        title: "新增失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (data: {
    title: string;
    description?: string;
    due_date: string;
    priority?: "low" | "medium" | "high" | "urgent";
  }) => {
    if (!editingFollowUp) return;
    try {
      await updateFollowUp(editingFollowUp.id, data);
      toast({ title: "跟進提醒已更新" });
      setEditingFollowUp(null);
    } catch (error: any) {
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeFollowUp(id);
      toast({ title: "已標記為完成" });
    } catch (error: any) {
      toast({
        title: "操作失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFollowUp(id);
      toast({ title: "跟進提醒已刪除" });
    } catch (error: any) {
      toast({
        title: "刪除失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const pendingFollowUps = followUps.filter((f) => f.status === "pending");
  const completedFollowUps = followUps.filter((f) => f.status === "completed");

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" />
          跟進提醒
          {pendingFollowUps.length > 0 && (
            <Badge variant="secondary">{pendingFollowUps.length}</Badge>
          )}
        </h3>
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          新增
        </Button>
      </div>

      {/* Pending Follow-ups */}
      {pendingFollowUps.length === 0 && completedFollowUps.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>尚無跟進提醒</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pendingFollowUps.map((followUp, index) => {
            const isOverdue = isPast(new Date(followUp.due_date));
            const isDueToday = isToday(new Date(followUp.due_date));
            const priority = priorityConfig[followUp.priority];

            return (
              <Card
                key={followUp.id}
                className={cn(
                  "p-3 transition-all hover:shadow-md animate-fade-in",
                  isOverdue && "border-red-300 bg-red-50/50",
                  isDueToday && !isOverdue && "border-orange-300 bg-orange-50/50"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => handleComplete(followUp.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{followUp.title}</span>
                      <Badge variant="outline" className={cn("text-xs", priority.color)}>
                        {priority.label}
                      </Badge>
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <AlertCircle className="w-3 h-3" />
                          逾期
                        </Badge>
                      )}
                      {isDueToday && !isOverdue && (
                        <Badge className="text-xs bg-orange-500">今天到期</Badge>
                      )}
                    </div>
                    {followUp.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {followUp.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      到期：{format(new Date(followUp.due_date), "MM/dd HH:mm", { locale: zhTW })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingFollowUp(followUp);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>確定刪除？</AlertDialogTitle>
                          <AlertDialogDescription>
                            此操作無法復原。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(followUp.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            刪除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Completed Follow-ups */}
          {completedFollowUps.length > 0 && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">已完成</p>
              {completedFollowUps.slice(0, 5).map((followUp) => (
                <div
                  key={followUp.id}
                  className="flex items-center gap-3 py-2 text-muted-foreground"
                >
                  <Checkbox checked disabled className="opacity-50" />
                  <span className="line-through text-sm">{followUp.title}</span>
                  <span className="text-xs">
                    {followUp.completed_at &&
                      format(new Date(followUp.completed_at), "MM/dd", { locale: zhTW })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <FollowUpDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingFollowUp(null);
        }}
        onSubmit={editingFollowUp ? handleEdit : handleCreate}
        initialData={editingFollowUp}
      />
    </div>
  );
}
