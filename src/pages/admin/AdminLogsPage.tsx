import { useState, useEffect } from "react";
import { 
  FileText, Search, Filter, User, Clock, Shield, 
  Send, Star, Eye, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AdminLog {
  id: string;
  user_id: string;
  action_type: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

const actionTypeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  assign_helper: { label: '指派小幫手', icon: <Shield className="w-4 h-4" />, color: 'text-green-600' },
  revoke_helper: { label: '撤銷小幫手', icon: <Shield className="w-4 h-4" />, color: 'text-red-600' },
  update_subscription: { label: '更新訂閱', icon: <Star className="w-4 h-4" />, color: 'text-yellow-600' },
  assign_document: { label: '指派報告', icon: <Send className="w-4 h-4" />, color: 'text-blue-600' },
  revoke_document: { label: '撤銷報告', icon: <FileText className="w-4 h-4" />, color: 'text-orange-600' },
  add_note: { label: '新增備註', icon: <FileText className="w-4 h-4" />, color: 'text-purple-600' },
  view_member: { label: '查看會員', icon: <Eye className="w-4 h-4" />, color: 'text-gray-600' },
};

const AdminLogsPage = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);

    const { data: logsData, error } = await supabase
      .from('admin_logs' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      console.error('Error fetching logs:', error);
      toast({ title: "載入失敗", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Fetch user emails from edge function
    let emailMap = new Map<string, string>();
    let nameMap = new Map<string, string>();
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
    } catch (emailError) {
      console.error('Error fetching user emails:', emailError);
    }

    // Fetch profiles for display names
    const userIds = [...new Set((logsData as unknown as AdminLog[]).map(l => l.user_id))];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);
      
      (profiles || []).forEach((p: { user_id: string; display_name: string | null }) => {
        if (p.display_name) {
          nameMap.set(p.user_id, p.display_name);
        }
      });
    }

    const logsWithUserInfo = (logsData as unknown as AdminLog[]).map(log => ({
      ...log,
      user_email: emailMap.get(log.user_id),
      user_name: nameMap.get(log.user_id),
    }));

    setLogs(logsWithUserInfo);
    setLoading(false);
  };

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === "all" || log.action_type === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const uniqueActionTypes = [...new Set(logs.map(l => l.action_type))];

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              操作日誌
            </h1>
            <p className="text-muted-foreground mt-1">
              追蹤管理員和小幫手的重要操作記錄
            </p>
          </div>
          <Button onClick={fetchLogs} variant="outline" disabled={loading}>
            重新載入
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜尋操作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="操作類型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部類型</SelectItem>
              {uniqueActionTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {actionTypeLabels[type]?.label || type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/60 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground">總操作數</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {logs.filter(l => {
                  const logDate = new Date(l.created_at);
                  const today = new Date();
                  return logDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">今日操作</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {new Set(logs.map(l => l.user_id)).size}
              </div>
              <p className="text-xs text-muted-foreground">活躍管理員</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{filteredLogs.length}</div>
              <p className="text-xs text-muted-foreground">篩選結果</p>
            </CardContent>
          </Card>
        </div>

        {/* Logs List */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">操作記錄</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">載入中...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">尚無操作記錄</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredLogs.map((log) => {
                  const actionInfo = actionTypeLabels[log.action_type] || { 
                    label: log.action_type, 
                    icon: <FileText className="w-4 h-4" />, 
                    color: 'text-gray-600' 
                  };
                  const isExpanded = expandedLogs.has(log.id);

                  return (
                    <div
                      key={log.id}
                      className="p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${actionInfo.color}`}>
                          {actionInfo.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {actionInfo.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {new Date(log.created_at).toLocaleString('zh-TW')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span>{log.user_name || log.user_email || '未知用戶'}</span>
                            {log.target_type && (
                              <span className="text-muted-foreground">
                                → {log.target_type}
                              </span>
                            )}
                          </div>
                        </div>

                        {log.details && Object.keys(log.details).length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(log.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {isExpanded && log.details && (
                        <div className="mt-3 ml-14 p-3 bg-muted/50 rounded-lg">
                          <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
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
    </div>
  );
};

export default AdminLogsPage;
