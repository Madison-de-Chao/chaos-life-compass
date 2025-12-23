import { useState, useEffect } from "react";
import { 
  Clock, Trash2, Send, FileText, AlertCircle, 
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePendingChanges, PendingChange } from "@/hooks/usePendingChanges";

const changeTypeLabels: Record<string, string> = {
  create: '新增',
  update: '修改',
  delete: '刪除',
};

const tableLabels: Record<string, string> = {
  documents: '報告',
  customers: '客戶',
  notes: '筆記',
  profiles: '會員資料',
  member_documents: '會員報告',
};

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  draft: { label: '草稿', variant: 'secondary', icon: <FileText className="w-3 h-3" /> },
  pending: { label: '待審核', variant: 'outline', icon: <Clock className="w-3 h-3" /> },
  approved: { label: '已核准', variant: 'default', icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: '已拒絕', variant: 'destructive', icon: <XCircle className="w-3 h-3" /> },
};

export function HelperPendingChanges() {
  const {
    draftChanges,
    fetchDraftChanges,
    deleteDraftChange,
    submitForReview,
    draftCount,
  } = usePendingChanges();

  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDraftChanges();
  }, [fetchDraftChanges]);

  const toggleExpand = (id: string) => {
    setExpandedChanges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await submitForReview();
    setIsSubmitting(false);
    if (success) {
      setSubmitDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDraftChange(id);
  };

  if (draftCount === 0) {
    return null;
  }

  return (
    <Card className="bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Clock className="w-5 h-5" />
            待送審變更
            <Badge variant="secondary" className="ml-2">
              {draftCount}
            </Badge>
          </CardTitle>
          <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Send className="w-4 h-4 mr-1" />
                送出審核
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>送出審核</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  即將送出 {draftCount} 項變更給管理員審核
                </p>
                <div className="p-4 bg-muted/50 rounded-lg max-h-60 overflow-auto space-y-2">
                  {draftChanges.map((change) => (
                    <div key={change.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">
                        {changeTypeLabels[change.change_type]}
                      </Badge>
                      <span>{tableLabels[change.target_table] || change.target_table}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  送出後，變更將等待管理員審核，核准後才會生效
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "送出中..." : "確認送出"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {draftChanges.map((change) => {
            const isExpanded = expandedChanges.has(change.id);
            return (
              <div
                key={change.id}
                className="p-3 bg-background/80 rounded-lg border border-border/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {changeTypeLabels[change.change_type]}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {tableLabels[change.target_table] || change.target_table}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(change.created_at).toLocaleString('zh-TW')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(change.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleExpand(change.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {change.notes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    備註: {change.notes}
                  </p>
                )}
                {isExpanded && (
                  <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                    <pre className="whitespace-pre-wrap text-muted-foreground max-h-40 overflow-auto">
                      {JSON.stringify(change.change_data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Badge component for showing pending count in header/sidebar
export function PendingChangesBadge() {
  const { draftCount } = usePendingChanges();

  if (draftCount === 0) return null;

  return (
    <Badge variant="destructive" className="ml-2 text-xs">
      {draftCount}
    </Badge>
  );
}
