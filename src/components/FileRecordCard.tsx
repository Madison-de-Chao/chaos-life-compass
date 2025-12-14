import { FileRecord } from "@/types/document";
import { FileText, Eye, Lock, Share2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface FileRecordCardProps {
  record: FileRecord;
  onView: (id: string) => void;
  onShare: (id: string) => void;
}

export function FileRecordCard({ record, onView, onShare }: FileRecordCardProps) {
  return (
    <div className="group p-6 bg-card rounded-2xl shadow-soft border border-border hover:shadow-elevated transition-all duration-300 hover:scale-[1.01]">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
          <FileText className="w-7 h-7 text-accent-foreground group-hover:text-primary transition-colors" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate mb-2 font-serif text-lg">
            {record.fileName}
          </h3>

          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{record.uploadedBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(record.uploadedAt, "yyyy年MM月dd日 HH:mm", {
                  locale: zhTW,
                })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{record.viewCount} 次瀏覽</span>
              </div>
              {record.hasPassword && (
                <div className="flex items-center gap-1.5 text-primary">
                  <Lock className="w-4 h-4" />
                  <span>已加密</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onView(record.id)}
        >
          <Eye className="w-4 h-4 mr-2" />
          查看
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onShare(record.id)}
        >
          <Share2 className="w-4 h-4 mr-2" />
          分享
        </Button>
      </div>
    </div>
  );
}
