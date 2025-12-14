import { FileText, Eye, Lock, Share2, Calendar, Trash2, Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Document, Customer } from "@/hooks/useDocuments";
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

interface FileRecordCardProps {
  document: Document;
  customer?: Customer | null;
  onView: (shareLink: string) => void;
  onEdit: (document: Document) => void;
  onShare: (document: Document) => void;
  onDelete: (id: string, filePath?: string | null) => void;
}

export function FileRecordCard({ document, customer, onView, onEdit, onShare, onDelete }: FileRecordCardProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="group p-6 bg-card rounded-2xl shadow-soft border border-border hover:shadow-elevated transition-all duration-300 hover:scale-[1.01]">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
          <FileText className="w-7 h-7 text-accent-foreground group-hover:text-primary transition-colors" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate mb-2 font-serif text-lg">
            {document.original_name}
          </h3>

          <div className="space-y-1.5 text-sm text-muted-foreground">
            {customer && (
              <div className="flex items-center gap-2 text-primary">
                <User className="w-4 h-4" />
                <span className="font-medium">{customer.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(document.created_at), "yyyy年MM月dd日 HH:mm", {
                  locale: zhTW,
                })}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{document.view_count} 次瀏覽</span>
              </div>
              <span className="text-muted-foreground/60">
                {formatBytes(document.file_size || 0)}
              </span>
              {document.password && (
                <div className="flex items-center gap-1.5 text-primary">
                  <Lock className="w-4 h-4" />
                  <span>已加密</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onView(document.share_link)}
        >
          <Eye className="w-4 h-4 mr-2" />
          查看
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(document)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShare(document)}
        >
          <Share2 className="w-4 h-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作無法復原。文件「{document.original_name}」將被永久刪除。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(document.id, document.file_path)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                刪除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
