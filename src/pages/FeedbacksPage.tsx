import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Search, Trash2, Eye, EyeOff, Calendar, User, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface Feedback {
  id: string;
  document_id: string | null;
  document_title: string;
  customer_name: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "載入失敗",
        description: "無法載入反饋資料",
        variant: "destructive",
      });
    } else {
      setFeedbacks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("feedbacks")
      .update({ is_read: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "更新失敗",
        description: "無法更新狀態",
        variant: "destructive",
      });
    } else {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, is_read: !currentStatus } : f))
      );
      toast({
        title: currentStatus ? "已標記為未讀" : "已標記為已讀",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("feedbacks").delete().eq("id", id);

    if (error) {
      toast({
        title: "刪除失敗",
        description: "無法刪除反饋",
        variant: "destructive",
      });
    } else {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      toast({
        title: "已刪除反饋",
      });
    }
  };

  const handleViewDetail = async (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDetailDialogOpen(true);
    
    // Mark as read when viewing
    if (!feedback.is_read) {
      await handleMarkAsRead(feedback.id, false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.document_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.customer_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      f.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = feedbacks.filter((f) => !f.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <div className="text-center py-20">
            <div className="animate-pulse text-muted-foreground">載入中...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
              客戶反饋
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {unreadCount} 未讀
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            查看和管理所有客戶提交的反饋訊息
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-8 animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜尋反饋..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Feedbacks Table */}
        {filteredFeedbacks.length > 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">狀態</TableHead>
                  <TableHead>報告標題</TableHead>
                  <TableHead>客戶名稱</TableHead>
                  <TableHead className="hidden md:table-cell">反饋內容</TableHead>
                  <TableHead className="hidden sm:table-cell">時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow
                    key={feedback.id}
                    className={!feedback.is_read ? "bg-primary/5" : ""}
                  >
                    <TableCell>
                      <Badge variant={feedback.is_read ? "secondary" : "default"}>
                        {feedback.is_read ? "已讀" : "未讀"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {feedback.document_title}
                    </TableCell>
                    <TableCell>
                      {feedback.customer_name || (
                        <span className="text-muted-foreground">匿名</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate text-muted-foreground">
                      {feedback.message}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {format(new Date(feedback.created_at), "MM/dd HH:mm", {
                        locale: zhTW,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetail(feedback)}
                          title="查看詳情"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(feedback.id, feedback.is_read)}
                          title={feedback.is_read ? "標記為未讀" : "標記為已讀"}
                        >
                          {feedback.is_read ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              title="刪除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>確定刪除此反饋？</AlertDialogTitle>
                              <AlertDialogDescription>
                                此操作無法撤銷，反饋訊息將永久刪除。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(feedback.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                刪除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 font-serif">
              尚無反饋
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? "嘗試其他搜尋關鍵字" : "客戶提交的反饋將顯示在這裡"}
            </p>
          </div>
        )}
      </main>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">反饋詳情</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>報告：{selectedFeedback.document_title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>客戶：{selectedFeedback.customer_name || "匿名"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(selectedFeedback.created_at), "yyyy年MM月dd日 HH:mm", {
                    locale: zhTW,
                  })}
                </span>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedFeedback.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbacksPage;
