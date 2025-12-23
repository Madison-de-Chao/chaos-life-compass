import { useState, useEffect } from "react";
import { 
  Clock, Search, Filter, User, Check, X, Eye, 
  ChevronDown, ChevronUp, FileText, AlertCircle, CheckCircle2, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePendingChanges, PendingChange } from "@/hooks/usePendingChanges";

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  draft: { label: '草稿', variant: 'secondary', icon: <FileText className="w-3 h-3" /> },
  pending: { label: '待審核', variant: 'outline', icon: <Clock className="w-3 h-3" /> },
  approved: { label: '已核准', variant: 'default', icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: '已拒絕', variant: 'destructive', icon: <XCircle className="w-3 h-3" /> },
};

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

const PendingChangesPage = () => {
  const {
    allChanges,
    loading,
    fetchAllChanges,
    approveChange,
    rejectChange,
    batchApprove,
    batchReject,
  } = usePendingChanges();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedChanges, setSelectedChanges] = useState<Set<string>>(new Set());
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewingIds, setReviewingIds] = useState<string[]>([]);
  const [userInfoMap, setUserInfoMap] = useState<Map<string, { email?: string; name?: string }>>(new Map());

  useEffect(() => {
    fetchAllChanges();
  }, [fetchAllChanges]);

  useEffect(() => {
    fetchUserInfo();
  }, [allChanges]);

  const fetchUserInfo = async () => {
    if (allChanges.length === 0) return;

    const userIds = [...new Set([
      ...allChanges.map(c => c.submitted_by),
      ...allChanges.filter(c => c.reviewed_by).map(c => c.reviewed_by as string)
    ])];

    // Fetch emails
    let emailMap = new Map<string, string>();
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.access_token) {
        const response = await supabase.functions.invoke('admin-get-users', {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        });
        if (response.data?.users) {
          response.data.users.forEach((u: { id: string; email: string }) => {
            emailMap.set(u.id, u.email);
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user emails:', error);
    }

    // Fetch display names
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds);

    const infoMap = new Map<string, { email?: string; name?: string }>();
    userIds.forEach(id => {
      const profile = profiles?.find(p => p.user_id === id);
      infoMap.set(id, {
        email: emailMap.get(id),
        name: profile?.display_name || undefined,
      });
    });

    setUserInfoMap(infoMap);
  };

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

  const toggleSelect = (id: string) => {
    setSelectedChanges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const pendingIds = filteredChanges.filter(c => c.status === 'pending').map(c => c.id);
    setSelectedChanges(new Set(pendingIds));
  };

  const clearSelection = () => {
    setSelectedChanges(new Set());
  };

  const openReviewDialog = (action: 'approve' | 'reject', ids?: string[]) => {
    setReviewAction(action);
    setReviewingIds(ids || Array.from(selectedChanges));
    setReviewNotes("");
    setReviewDialogOpen(true);
  };

  const handleReview = async () => {
    if (reviewingIds.length === 0) return;

    let success = false;
    if (reviewingIds.length === 1) {
      if (reviewAction === 'approve') {
        success = await approveChange(reviewingIds[0], reviewNotes);
      } else {
        success = await rejectChange(reviewingIds[0], reviewNotes);
      }
    } else {
      if (reviewAction === 'approve') {
        success = await batchApprove(reviewingIds, reviewNotes);
      } else {
        success = await batchReject(reviewingIds, reviewNotes);
      }
    }

    if (success) {
      setReviewDialogOpen(false);
      setSelectedChanges(new Set());
      fetchAllChanges();
    }
  };

  const filteredChanges = allChanges.filter(change => {
    const userInfo = userInfoMap.get(change.submitted_by);
    const matchesSearch = !searchQuery || 
      userInfo?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      change.target_table.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || change.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = allChanges.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              變更審核
            </h1>
            <p className="text-muted-foreground mt-1">
              審核小幫手提交的變更請求
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="destructive" className="text-sm px-3 py-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {pendingCount} 項待審核
              </Badge>
            )}
            <Button onClick={fetchAllChanges} variant="outline" disabled={loading}>
              重新載入
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜尋提交者或目標..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="審核狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部狀態</SelectItem>
              <SelectItem value="pending">待審核</SelectItem>
              <SelectItem value="approved">已核准</SelectItem>
              <SelectItem value="rejected">已拒絕</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batch Actions */}
        {selectedChanges.size > 0 && (
          <div className="flex items-center gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              已選擇 {selectedChanges.size} 項
            </span>
            <Button 
              size="sm" 
              onClick={() => openReviewDialog('approve')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              批量核准
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => openReviewDialog('reject')}
            >
              <X className="w-4 h-4 mr-1" />
              批量拒絕
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={clearSelection}
            >
              取消選擇
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusLabels).map(([status, info]) => {
            const count = allChanges.filter(c => c.status === status).length;
            return (
              <Card key={status} className="bg-card/60 backdrop-blur">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <Badge variant={info.variant} className="mt-1">
                    {info.icon}
                    <span className="ml-1">{info.label}</span>
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Changes List */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">變更請求</CardTitle>
            {statusFilter === 'pending' && filteredChanges.length > 0 && (
              <Button variant="outline" size="sm" onClick={selectAll}>
                全選待審核
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">載入中...</div>
            ) : filteredChanges.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">沒有符合條件的變更請求</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredChanges.map((change) => {
                  const statusInfo = statusLabels[change.status] || statusLabels.draft;
                  const isExpanded = expandedChanges.has(change.id);
                  const isSelected = selectedChanges.has(change.id);
                  const userInfo = userInfoMap.get(change.submitted_by);
                  const reviewerInfo = change.reviewed_by ? userInfoMap.get(change.reviewed_by) : null;

                  return (
                    <div
                      key={change.id}
                      className={`p-4 hover:bg-muted/30 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        {change.status === 'pending' && (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelect(change.id)}
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant={statusInfo.variant} className="text-xs">
                              {statusInfo.icon}
                              <span className="ml-1">{statusInfo.label}</span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {changeTypeLabels[change.change_type] || change.change_type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {tableLabels[change.target_table] || change.target_table}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(change.created_at).toLocaleString('zh-TW')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span>提交者: {userInfo?.name || userInfo?.email || '未知'}</span>
                          </div>
                          {change.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              備註: {change.notes}
                            </p>
                          )}
                          {change.reviewed_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              審核者: {reviewerInfo?.name || reviewerInfo?.email || '未知'} 
                              ({new Date(change.reviewed_at).toLocaleString('zh-TW')})
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {change.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => openReviewDialog('approve', [change.id])}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => openReviewDialog('reject', [change.id])}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
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

                      {isExpanded && (
                        <div className="mt-3 ml-8 p-3 bg-muted/50 rounded-lg">
                          <Label className="text-xs text-muted-foreground">變更內容</Label>
                          <pre className="text-xs text-muted-foreground whitespace-pre-wrap mt-1 max-h-60 overflow-auto">
                            {JSON.stringify(change.change_data, null, 2)}
                          </pre>
                          {change.review_notes && (
                            <div className="mt-2 pt-2 border-t border-border">
                              <Label className="text-xs text-muted-foreground">審核備註</Label>
                              <p className="text-sm mt-1">{change.review_notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? '核准變更' : '拒絕變更'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              即將{reviewAction === 'approve' ? '核准' : '拒絕'} {reviewingIds.length} 項變更
            </p>
            <div className="space-y-2">
              <Label>審核備註 (選填)</Label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="輸入審核備註..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleReview}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {reviewAction === 'approve' ? '確認核准' : '確認拒絕'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingChangesPage;
