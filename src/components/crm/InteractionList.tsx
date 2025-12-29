import { useState } from "react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { CustomerInteraction, useCustomerInteractions } from "@/hooks/useCRM";
import { InteractionDialog } from "./InteractionDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Phone,
  Users,
  Mail,
  MessageSquare,
  FileText,
  MoreHorizontal,
  Trash2,
  Pencil,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractionListProps {
  customerId: string;
}

const INTERACTION_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  call: { label: "電話", icon: Phone, color: "bg-green-500" },
  meeting: { label: "會議", icon: Users, color: "bg-purple-500" },
  email: { label: "Email", icon: Mail, color: "bg-blue-500" },
  message: { label: "訊息", icon: MessageSquare, color: "bg-cyan-500" },
  note: { label: "備註", icon: FileText, color: "bg-slate-500" },
  other: { label: "其他", icon: MoreHorizontal, color: "bg-gray-500" },
};

export function InteractionList({ customerId }: InteractionListProps) {
  const { interactions, loading, createInteraction, updateInteraction, deleteInteraction } =
    useCustomerInteractions(customerId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<CustomerInteraction | null>(null);

  const handleCreate = async (data: {
    interaction_type: string;
    title: string;
    content?: string;
    interaction_date?: string;
  }) => {
    try {
      await createInteraction(data);
      toast({ title: "互動紀錄已新增" });
    } catch (error: any) {
      toast({
        title: "新增失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (data: {
    interaction_type: string;
    title: string;
    content?: string;
    interaction_date?: string;
  }) => {
    if (!editingInteraction) return;
    try {
      await updateInteraction(editingInteraction.id, data);
      toast({ title: "互動紀錄已更新" });
      setEditingInteraction(null);
    } catch (error: any) {
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInteraction(id);
      toast({ title: "互動紀錄已刪除" });
    } catch (error: any) {
      toast({
        title: "刪除失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          互動紀錄
          {interactions.length > 0 && (
            <Badge variant="secondary">{interactions.length}</Badge>
          )}
        </h3>
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          新增
        </Button>
      </div>

      {interactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>尚無互動紀錄</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interactions.map((interaction, index) => {
            const config = INTERACTION_CONFIG[interaction.interaction_type] || INTERACTION_CONFIG.other;
            const Icon = config.icon;

            return (
              <Card
                key={interaction.id}
                className="p-4 transition-all hover:shadow-md animate-fade-in group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      config.color
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {config.label}
                          </Badge>
                          <span className="font-medium">{interaction.title}</span>
                        </div>
                        {interaction.content && (
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {interaction.content}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(interaction.interaction_date), "yyyy/MM/dd HH:mm", {
                            locale: zhTW,
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingInteraction(interaction);
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
                                onClick={() => handleDelete(interaction.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                刪除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <InteractionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingInteraction(null);
        }}
        onSubmit={editingInteraction ? handleEdit : handleCreate}
        initialData={editingInteraction}
      />
    </div>
  );
}
