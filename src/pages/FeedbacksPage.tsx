import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  History
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  admin_notes: string | null;
  follow_up_status: string;
  follow_up_date: string | null;
  resolved_at: string | null;
}

interface TrackingEntry {
  id: string;
  feedback_id: string;
  note: string;
  status_change: string | null;
  created_at: string;
}

const statusConfig = {
  pending: { label: "待處理", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  in_progress: { label: "追蹤中", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: AlertCircle },
  resolved: { label: "已解決", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
  no_action_needed: { label: "無需處理", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: XCircle },
};

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState<TrackingEntry[]>([]);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const fetchTrackingHistory = async (feedbackId: string) => {
    const { data, error } = await supabase
      .from("feedback_tracking")
      .select("*")
      .eq("feedback_id", feedbackId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTrackingHistory(data);
    }
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    const updateData: { follow_up_status: string; resolved_at?: string | null } = {
      follow_up_status: newStatus,
    };

    if (newStatus === "resolved") {
      updateData.resolved_at = new Date().toISOString();
    } else {
      updateData.resolved_at = null;
    }

    const { error } = await supabase
      .from("feedbacks")
      .update(updateData)
      .eq("id", id);

    if (error) {
      toast({
        title: "更新失敗",
        description: "無法更新狀態",
        variant: "destructive",
      });
    } else {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updateData } : f))
      );
      
      if (selectedFeedback?.id === id) {
        setSelectedFeedback({ ...selectedFeedback, ...updateData });
      }

      // Add tracking entry for status change
      await supabase.from("feedback_tracking").insert({
        feedback_id: id,
        note: `狀態變更為「${statusConfig[newStatus as keyof typeof statusConfig]?.label || newStatus}」`,
        status_change: newStatus,
      });

      if (selectedFeedback?.id === id) {
        fetchTrackingHistory(id);
      }

      toast({
        title: "狀態已更新",
      });
    }
  };

  const handleAddNote = async () => {
    if (!selectedFeedback || !newNote.trim()) return;

    setSavingNote(true);
    
    // Update admin_notes
    const { error: updateError } = await supabase
      .from("feedbacks")
      .update({ admin_notes: newNote.trim() })
      .eq("id", selectedFeedback.id);

    // Add tracking entry
    const { error: trackingError } = await supabase
      .from("feedback_tracking")
      .insert({
        feedback_id: selectedFeedback.id,
        note: newNote.trim(),
      });

    if (updateError || trackingError) {
      toast({
        title: "儲存失敗",
        description: "無法儲存追蹤紀錄",
        variant: "destructive",
      });
    } else {
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === selectedFeedback.id ? { ...f, admin_notes: newNote.trim() } : f
        )
      );
      setSelectedFeedback({ ...selectedFeedback, admin_notes: newNote.trim() });
      setNewNote("");
      fetchTrackingHistory(selectedFeedback.id);
      toast({
        title: "追蹤紀錄已新增",
      });
    }

    setSavingNote(false);
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
    setNewNote(feedback.admin_notes || "");
    fetchTrackingHistory(feedback.id);
    
    // Mark as read when viewing
    if (!feedback.is_read) {
      await handleMarkAsRead(feedback.id, false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      f.document_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.customer_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      f.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || f.follow_up_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const unreadCount = feedbacks.filter((f) => !f.is_read).length;
  const pendingCount = feedbacks.filter((f) => f.follow_up_status === "pending").length;

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
              客戶反饋追蹤
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {unreadCount} 未讀
              </Badge>
            )}
            {pendingCount > 0 && (
              <Badge variant="outline" className="text-sm border-yellow-500/50 text-yellow-600">
                {pendingCount} 待處理
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            查看、追蹤和管理所有客戶提交的反饋訊息
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜尋反饋..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-12">
              <SelectValue placeholder="篩選狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部狀態</SelectItem>
              <SelectItem value="pending">待處理</SelectItem>
              <SelectItem value="in_progress">追蹤中</SelectItem>
              <SelectItem value="resolved">已解決</SelectItem>
              <SelectItem value="no_action_needed">無需處理</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feedbacks Table */}
        {filteredFeedbacks.length > 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">追蹤狀態</TableHead>
                  <TableHead className="w-[80px]">已讀</TableHead>
                  <TableHead>報告標題</TableHead>
                  <TableHead>客戶名稱</TableHead>
                  <TableHead className="hidden md:table-cell">反饋內容</TableHead>
                  <TableHead className="hidden sm:table-cell">時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => {
                  const status = statusConfig[feedback.follow_up_status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow
                      key={feedback.id}
                      className={!feedback.is_read ? "bg-primary/5" : ""}
                    >
                      <TableCell>
                        <Badge variant="outline" className={`${status.color} gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
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
                            title="查看詳情與追蹤"
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
                  );
                })}
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

      {/* Detail & Tracking Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">反饋詳情與追蹤</DialogTitle>
            <DialogDescription>查看反饋內容並記錄追蹤進度</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
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
                <div className="flex items-center gap-2">
                  <Select 
                    value={selectedFeedback.follow_up_status || "pending"} 
                    onValueChange={(value) => handleStatusChange(selectedFeedback.id, value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">待處理</SelectItem>
                      <SelectItem value="in_progress">追蹤中</SelectItem>
                      <SelectItem value="resolved">已解決</SelectItem>
                      <SelectItem value="no_action_needed">無需處理</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Feedback Message */}
              <div className="p-4 border border-border rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">客戶反饋內容</h4>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedFeedback.message}
                </p>
              </div>

              {/* Add Note */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  新增追蹤紀錄
                </h4>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="記錄追蹤進度、處理方式或備註..."
                  rows={3}
                />
                <Button 
                  onClick={handleAddNote} 
                  disabled={!newNote.trim() || savingNote}
                  className="w-full"
                >
                  {savingNote ? "儲存中..." : "新增紀錄"}
                </Button>
              </div>

              {/* Tracking History */}
              {trackingHistory.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <History className="w-4 h-4" />
                    追蹤歷史紀錄
                  </h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {trackingHistory.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="p-3 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(entry.created_at), "MM/dd HH:mm", { locale: zhTW })}
                          </span>
                          {entry.status_change && (
                            <Badge variant="outline" className="text-xs">
                              狀態變更
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground">{entry.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFeedback.resolved_at && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4 inline mr-2" />
                  已於 {format(new Date(selectedFeedback.resolved_at), "yyyy年MM月dd日 HH:mm", { locale: zhTW })} 解決
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbacksPage;
