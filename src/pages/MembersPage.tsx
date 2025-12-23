import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Search, Filter, Mail, Calendar, 
  FileText, MessageSquare, Star, MoreHorizontal,
  Eye, ChevronDown, Plus, Clock, User, Send, Check, X, Crown, Shield,
  Sparkles, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { SubscriptionManagement } from "@/components/SubscriptionManagement";
import { HelperPendingChanges } from "@/components/HelperPendingChanges";
import { MemberListSkeleton, StatsCardSkeleton } from "@/components/MemberCardSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePendingChanges } from "@/hooks/usePendingChanges";
import { type SubscriptionStatus, isExpiringSoon, getDaysRemaining } from "@/types/subscription";

interface Member {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: string | null;
  subscription_status: SubscriptionStatus;
  subscription_started_at: string | null;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
  document_count?: number;
  interaction_count?: number;
  roles?: string[];
  isAdmin?: boolean;
  isHelper?: boolean;
}

interface MemberInteraction {
  id: string;
  interaction_type: string;
  content: string | null;
  created_at: string;
  document?: { file_name: string } | null;
}

interface Document {
  id: string;
  file_name: string;
  original_name: string;
  share_link: string;
  created_at: string;
}

interface MemberDocument {
  id: string;
  document_id: string;
  granted_at: string;
  document: { file_name: string } | null;
}

const MembersPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [interactions, setInteractions] = useState<MemberInteraction[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // Current user role state
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [currentUserIsHelper, setCurrentUserIsHelper] = useState(false);
  
  // Pending changes hook for helpers
  const { addDraftChange, draftCount } = usePendingChanges();
  
  // Document assignment state
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [memberDocuments, setMemberDocuments] = useState<MemberDocument[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [docSearchQuery, setDocSearchQuery] = useState("");

  useEffect(() => {
    fetchMembers();
    fetchCurrentUserRole();
  }, []);

  const fetchCurrentUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    if (roles) {
      const roleList = roles.map(r => r.role);
      setCurrentUserIsAdmin(roleList.includes('admin'));
      setCurrentUserIsHelper(roleList.includes('helper') && !roleList.includes('admin'));
    }
  };

  const fetchMembers = async () => {
    setLoading(true);

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      toast({ title: "載入失敗", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Fetch all user roles (to include admins even if their profile row is missing)
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
    }

    // Fetch user emails from edge function
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
    } catch (emailError) {
      console.error('Error fetching user emails:', emailError);
    }

    const rolesMap = new Map<string, string[]>();
    (userRoles || []).forEach((ur) => {
      const existing = rolesMap.get(ur.user_id) || [];
      existing.push(ur.role);
      rolesMap.set(ur.user_id, existing);
    });

    const profileByUserId = new Map<string, any>((profiles || []).map((p: any) => [p.user_id, p]));

    const allUserIds = Array.from(
      new Set([...(profiles || []).map((p: any) => p.user_id), ...(userRoles || []).map((r: any) => r.user_id)])
    );

    const nowIso = new Date().toISOString();

    const membersWithCounts = await Promise.all(
      allUserIds.map(async (userId) => {
        const profile = profileByUserId.get(userId);

        const baseMember: Member = profile
          ? (profile as Member)
          : {
              id: `missing-${userId}`,
              user_id: userId,
              display_name: null,
              phone: null,
              birth_date: null,
              gender: null,
              subscription_status: 'free' as SubscriptionStatus,
              subscription_started_at: null,
              subscription_expires_at: null,
              created_at: nowIso,
              updated_at: nowIso,
            };

        const { count: docCount } = await supabase
          .from('member_documents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        const { count: interactionCount } = await supabase
          .from('member_interactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        const roles = rolesMap.get(userId) || [];

        return {
          ...baseMember,
          email: emailMap.get(userId) || undefined,
          document_count: docCount || 0,
          interaction_count: interactionCount || 0,
          roles,
          isAdmin: roles.includes('admin'),
          isHelper: roles.includes('helper'),
        };
      })
    );

    membersWithCounts.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    setMembers(membersWithCounts);
    setLoading(false);
  };

  const fetchMemberInteractions = async (userId: string) => {
    const { data, error } = await supabase
      .from('member_interactions')
      .select(`
        id,
        interaction_type,
        content,
        created_at,
        document:documents(file_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setInteractions(data as MemberInteraction[]);
    }
  };

  const addAdminNote = async () => {
    if (!selectedMember || !newNote.trim()) return;
    
    setIsAddingNote(true);
    const { error } = await supabase
      .from('member_interactions')
      .insert({
        user_id: selectedMember.user_id,
        interaction_type: 'note',
        content: newNote,
      });

    if (error) {
      toast({ title: "新增失敗", variant: "destructive" });
    } else {
      toast({ title: "已新增備註" });
      setNewNote("");
      fetchMemberInteractions(selectedMember.user_id);
    }
    setIsAddingNote(false);
  };

  // Log admin action
  const logAdminAction = async (actionType: string, targetType: string, targetId: string, details: Record<string, unknown> = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('admin_logs' as any).insert({
        user_id: user.id,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        details,
      } as any);
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  // Role management
  const assignHelperRole = async (userId: string, memberName: string | null) => {
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'helper')
      .maybeSingle();

    if (existingRole) {
      toast({ title: "此用戶已是小幫手", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'helper' });

    if (error) {
      toast({ title: "指派失敗", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "已指派為小幫手" });
      await logAdminAction('assign_helper', 'user', userId, { member_name: memberName });
      fetchMembers();
    }
  };

  const revokeHelperRole = async (userId: string, memberName: string | null) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'helper');

    if (error) {
      toast({ title: "撤銷失敗", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "已撤銷小幫手權限" });
      await logAdminAction('revoke_helper', 'user', userId, { member_name: memberName });
      fetchMembers();
    }
  };

  const updateSubscriptionStatus = async (userId: string, status: 'free' | 'trial' | 'active' | 'cancelled' | 'expired') => {
    const member = members.find(m => m.user_id === userId);
    
    // If current user is helper (not admin), add to pending changes instead
    if (currentUserIsHelper && !currentUserIsAdmin) {
      const success = await addDraftChange({
        change_type: 'update',
        target_table: 'profiles',
        target_id: member?.id,
        change_data: { subscription_status: status },
        notes: `更新會員 ${member?.display_name || '未知'} 的狀態為 ${status}`,
      });
      return;
    }
    
    // Admin: direct update
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: status })
      .eq('user_id', userId);

    if (error) {
      toast({ title: "更新失敗", variant: "destructive" });
    } else {
      toast({ title: "會員狀態已更新" });
      await logAdminAction('update_subscription', 'user', userId, { 
        member_name: member?.display_name, 
        new_status: status 
      });
      fetchMembers();
    }
  };

  // Document assignment functions
  const openAssignDialog = async (member: Member) => {
    setSelectedMember(member);
    setAssignDialogOpen(true);
    setSelectedDocIds([]);
    setDocSearchQuery("");
    
    // Fetch all documents
    const { data: docs } = await supabase
      .from('documents')
      .select('id, file_name, original_name, share_link, created_at')
      .order('created_at', { ascending: false });
    
    setAllDocuments(docs || []);
    
    // Fetch member's current documents
    const { data: memberDocs } = await supabase
      .from('member_documents')
      .select('id, document_id, granted_at, document:documents(file_name)')
      .eq('user_id', member.user_id);
    
    setMemberDocuments(memberDocs as MemberDocument[] || []);
  };

  const assignDocuments = async () => {
    if (!selectedMember || selectedDocIds.length === 0) return;
    
    setIsAssigning(true);
    
    // Filter out already assigned documents
    const existingDocIds = memberDocuments.map(md => md.document_id);
    const newDocIds = selectedDocIds.filter(id => !existingDocIds.includes(id));
    
    if (newDocIds.length === 0) {
      toast({ title: "所選報告已全部指派給此會員", variant: "destructive" });
      setIsAssigning(false);
      return;
    }
    
    // If current user is helper, add to pending changes
    if (currentUserIsHelper && !currentUserIsAdmin) {
      for (const docId of newDocIds) {
        const doc = allDocuments.find(d => d.id === docId);
        await addDraftChange({
          change_type: 'create',
          target_table: 'member_documents',
          change_data: {
            user_id: selectedMember.user_id,
            document_id: docId,
          },
          notes: `指派報告 "${doc?.file_name || docId}" 給會員 ${selectedMember.display_name || '未知'}`,
        });
      }
      setSelectedDocIds([]);
      setIsAssigning(false);
      setAssignDialogOpen(false);
      return;
    }
    
    // Admin: direct insert
    const inserts = newDocIds.map(docId => ({
      user_id: selectedMember.user_id,
      document_id: docId,
    }));
    
    const { error } = await supabase
      .from('member_documents')
      .insert(inserts);
    
    if (error) {
      console.error('Error assigning documents:', error);
      toast({ title: "指派失敗", variant: "destructive" });
    } else {
      toast({ title: `已指派 ${newDocIds.length} 份報告` });
      // Refresh member documents
      const { data: memberDocs } = await supabase
        .from('member_documents')
        .select('id, document_id, granted_at, document:documents(file_name)')
        .eq('user_id', selectedMember.user_id);
      setMemberDocuments(memberDocs as MemberDocument[] || []);
      setSelectedDocIds([]);
      fetchMembers(); // Refresh counts
    }
    
    setIsAssigning(false);
  };

  const revokeDocument = async (memberDocId: string) => {
    const docToRevoke = memberDocuments.find(md => md.id === memberDocId);
    
    // If current user is helper, add to pending changes
    if (currentUserIsHelper && !currentUserIsAdmin) {
      await addDraftChange({
        change_type: 'delete',
        target_table: 'member_documents',
        target_id: memberDocId,
        change_data: { id: memberDocId },
        notes: `撤銷會員報告存取權限: ${docToRevoke?.document?.file_name || memberDocId}`,
      });
      return;
    }
    
    // Admin: direct delete
    const { error } = await supabase
      .from('member_documents')
      .delete()
      .eq('id', memberDocId);
    
    if (error) {
      toast({ title: "撤銷失敗", variant: "destructive" });
    } else {
      toast({ title: "已撤銷報告存取權限" });
      setMemberDocuments(prev => prev.filter(md => md.id !== memberDocId));
      fetchMembers();
    }
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocIds(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const filteredDocuments = allDocuments.filter(doc =>
    !docSearchQuery || 
    doc.file_name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
    doc.original_name.toLowerCase().includes(docSearchQuery.toLowerCase())
  );

  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchQuery || 
      (member.display_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || member.subscription_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const subscriptionLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    free: { label: '免費', variant: 'secondary' as const },
    trial: { label: '試用', variant: 'outline' as const },
    active: { label: '訂閱中', variant: 'default' as const },
    cancelled: { label: '已取消', variant: 'destructive' as const },
    expired: { label: '已過期', variant: 'destructive' as const },
  };

  const interactionTypeLabels: Record<string, string> = {
    view_report: '閱讀報告',
    feedback: '提交回饋',
    inquiry: '諮詢',
    purchase: '購買',
    support: '客服',
    note: '管理員備註',
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen gradient-hero">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Helper pending changes panel */}
          {currentUserIsHelper && !currentUserIsAdmin && (
            <div className="mb-6 animate-fade-in">
              <HelperPendingChanges />
            </div>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-3">
                <div className="relative">
                  <Users className="w-8 h-8 text-primary" />
                  <Sparkles className="w-3 h-3 text-primary absolute -top-1 -right-1 animate-pulse" />
                </div>
                會員管理
                {currentUserIsHelper && !currentUserIsAdmin && (
                  <Badge variant="outline" className="text-xs border-amber-500 text-amber-600 animate-pulse">
                    <Shield className="w-3 h-3 mr-1" />
                    小幫手模式
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                共 <span className="font-semibold text-foreground">{members.length}</span> 位會員
                {currentUserIsHelper && !currentUserIsAdmin && (
                  <span className="text-amber-600 ml-2">
                    (變更需經管理員審核)
                  </span>
                )}
              </p>
            </div>
          </div>


          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="搜尋暱稱或 Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] transition-all hover:border-primary/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="會員狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="free">免費會員</SelectItem>
                <SelectItem value="trial">試用中</SelectItem>
                <SelectItem value="active">訂閱會員</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
                <SelectItem value="expired">已過期</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))
            ) : (
              Object.entries(subscriptionLabels).map(([status, info], index) => {
                const count = members.filter(m => m.subscription_status === status).length;
                return (
                  <Card 
                    key={status} 
                    className="bg-card/60 backdrop-blur hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${150 + index * 50}ms` }}
                    onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold group-hover:text-primary transition-colors">{count}</div>
                      <Badge 
                        variant={statusFilter === status ? 'default' : info.variant} 
                        className="mt-1 transition-all"
                      >
                        {info.label}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Members List */}
          <Card className="bg-card/60 backdrop-blur animate-fade-in overflow-hidden" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-0">
              {loading ? (
                <MemberListSkeleton count={5} />
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="relative inline-block">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <Search className="w-5 h-5 absolute -bottom-1 -right-1 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all' ? '沒有找到符合條件的會員' : '尚無會員'}
                  </p>
                  {(searchQuery || statusFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                    >
                      清除篩選條件
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredMembers.map((member, index) => {
                    const subInfo = subscriptionLabels[member.subscription_status] || subscriptionLabels.free;
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-all duration-200 group animate-fade-in"
                        style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                      >
                        {/* Avatar with hover effect */}
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg">
                          <User className="w-6 h-6 text-primary transition-transform group-hover:scale-95" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                              {member.display_name || '未設定暱稱'}
                            </h3>
                            {member.isAdmin && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="text-xs cursor-help">
                                    <Crown className="w-3 h-3 mr-1 text-primary" />
                                    管理員
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>擁有完整管理權限</TooltipContent>
                              </Tooltip>
                            )}
                            {member.isHelper && !member.isAdmin && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="text-xs border-green-500 text-green-600 cursor-help">
                                    <Shield className="w-3 h-3 mr-1" />
                                    小幫手
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>協助管理，變更需審核</TooltipContent>
                              </Tooltip>
                            )}
                            <Badge variant={subInfo.variant} className="text-xs transition-transform hover:scale-105">
                              {subInfo.label}
                            </Badge>
                            {isExpiringSoon(member.subscription_expires_at) && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500 animate-pulse cursor-help">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {getDaysRemaining(member.subscription_expires_at)}天到期
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>訂閱即將到期，請提醒用戶續訂</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {member.email && (
                              <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <Mail className="w-3 h-3" />
                                {member.email}
                              </span>
                            )}
                            {member.birth_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {member.birth_date}
                              </span>
                            )}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-1 cursor-help hover:text-primary transition-colors">
                                  <FileText className="w-3 h-3" />
                                  {member.document_count} 份報告
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>已指派的報告數量</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-1 cursor-help hover:text-primary transition-colors">
                                  <MessageSquare className="w-3 h-3" />
                                  {member.interaction_count} 次互動
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>包含回饋、諮詢、閱讀等紀錄</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        {/* Actions - with improved hover states */}
                        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="transition-all hover:bg-primary/10 hover:text-primary"
                                onClick={() => {
                                  setSelectedMember(member);
                                  fetchMemberInteractions(member.user_id);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                詳情
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <User className="w-5 h-5 text-primary" />
                                  </div>
                                  會員詳情
                                  {selectedMember && (
                                    <Badge variant="secondary" className="ml-2">
                                      {selectedMember.display_name || '未設定暱稱'}
                                    </Badge>
                                  )}
                                </DialogTitle>
                              </DialogHeader>
                              
                              {selectedMember && (
                                <div className="space-y-6 animate-fade-in">
                                  {/* Member Info - improved grid */}
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        暱稱
                                      </Label>
                                      <div className="font-medium">{selectedMember.display_name || '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        電話
                                      </Label>
                                      <div className="font-medium">{selectedMember.phone || '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        生日
                                      </Label>
                                      <div className="font-medium">{selectedMember.birth_date || '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground">性別</Label>
                                      <div className="font-medium">
                                        {selectedMember.gender === 'male' ? '男' : 
                                         selectedMember.gender === 'female' ? '女' : 
                                         selectedMember.gender || '-'}
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        註冊時間
                                      </Label>
                                      <div className="font-medium">{new Date(selectedMember.created_at).toLocaleDateString('zh-TW')}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        報告數
                                      </Label>
                                      <div className="font-medium">{selectedMember.document_count || 0}</div>
                                    </div>
                                  </div>

                                  {/* Subscription Management */}
                                  <SubscriptionManagement
                                    userId={selectedMember.user_id}
                                    currentStatus={selectedMember.subscription_status}
                                    expiresAt={selectedMember.subscription_expires_at}
                                    startedAt={selectedMember.subscription_started_at}
                                    onUpdate={() => {
                                      fetchMembers();
                                      fetchMemberInteractions(selectedMember.user_id);
                                    }}
                                  />

                                  {/* Add Note - improved layout */}
                                  <div className="space-y-2 p-4 bg-muted/20 rounded-lg border border-border/50">
                                    <Label className="flex items-center gap-2">
                                      <MessageSquare className="w-4 h-4 text-primary" />
                                      新增備註
                                    </Label>
                                    <div className="flex gap-2">
                                      <Textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="輸入管理員備註..."
                                        rows={2}
                                        className="transition-all focus:ring-2 focus:ring-primary/20"
                                      />
                                      <Button 
                                        onClick={addAdminNote}
                                        disabled={!newNote.trim() || isAddingNote}
                                        className="transition-all hover:scale-105"
                                      >
                                        {isAddingNote ? (
                                          <span className="animate-spin">⟳</span>
                                        ) : (
                                          <Plus className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Interactions - improved cards */}
                                  <div>
                                    <Label className="mb-3 flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-primary" />
                                      互動紀錄
                                      <Badge variant="secondary" className="ml-auto">{interactions.length}</Badge>
                                    </Label>
                                    <ScrollArea className="h-60 rounded-lg border border-border/50">
                                      <div className="p-2 space-y-2">
                                        {interactions.length === 0 ? (
                                          <div className="text-center py-8">
                                            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                                            <p className="text-sm text-muted-foreground">
                                              尚無互動紀錄
                                            </p>
                                          </div>
                                        ) : (
                                          interactions.map((interaction, idx) => (
                                            <div
                                              key={interaction.id}
                                              className="p-3 bg-muted/30 rounded-lg text-sm hover:bg-muted/50 transition-colors animate-fade-in"
                                              style={{ animationDelay: `${idx * 50}ms` }}
                                            >
                                              <div className="flex items-center justify-between mb-1">
                                                <Badge variant="outline" className="text-xs">
                                                  {interactionTypeLabels[interaction.interaction_type] || interaction.interaction_type}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                  {new Date(interaction.created_at).toLocaleString('zh-TW')}
                                                </span>
                                              </div>
                                              {interaction.content && (
                                                <p className="text-muted-foreground mt-1">{interaction.content}</p>
                                              )}
                                              {interaction.document?.file_name && (
                                                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                                                  <FileText className="w-3 h-3" />
                                                  報告：{interaction.document.file_name}
                                                </p>
                                              )}
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </ScrollArea>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="transition-all hover:border-primary hover:text-primary"
                              onClick={() => openAssignDialog(member)}
                            >
                              <Send className="w-4 h-4 mr-1" />
                              指派報告
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>為會員指派可閱讀的報告</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="transition-all hover:bg-muted">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => openAssignDialog(member)}
                              className="cursor-pointer"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              指派報告
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateSubscriptionStatus(member.user_id, 'active')}
                              className="cursor-pointer"
                            >
                              <Star className="w-4 h-4 mr-2 text-yellow-500" />
                              設為訂閱會員
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateSubscriptionStatus(member.user_id, 'free')}
                              className="cursor-pointer"
                            >
                              <User className="w-4 h-4 mr-2" />
                              設為免費會員
                            </DropdownMenuItem>
                            {!member.isAdmin && (
                              <>
                                {member.isHelper ? (
                                  <DropdownMenuItem 
                                    onClick={() => revokeHelperRole(member.user_id, member.display_name)}
                                    className="text-destructive cursor-pointer focus:text-destructive"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    撤銷小幫手權限
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => assignHelperRole(member.user_id, member.display_name)}
                                    className="cursor-pointer"
                                  >
                                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                                    設為小幫手
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Assignment Dialog */}
          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  指派報告給
                  <Badge variant="secondary">{selectedMember?.display_name || '會員'}</Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden flex flex-col gap-4 animate-fade-in">
                {/* Member's current documents */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    已指派報告
                    <Badge variant="outline" className="ml-auto">{memberDocuments.length}</Badge>
                  </Label>
                  {memberDocuments.length === 0 ? (
                    <div className="text-center py-4 bg-muted/20 rounded-lg border border-dashed border-border">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">尚未指派任何報告</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-32 rounded-lg border bg-muted/10 p-2">
                      <div className="space-y-2">
                        {memberDocuments.map((md, idx) => (
                          <div 
                            key={md.id} 
                            className="flex items-center justify-between p-2 bg-background/50 rounded-lg hover:bg-background transition-colors animate-fade-in group"
                            style={{ animationDelay: `${idx * 30}ms` }}
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{md.document?.file_name || '報告'}</span>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-50 group-hover:opacity-100 transition-opacity"
                                  onClick={() => revokeDocument(md.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>撤銷此報告的存取權限</TooltipContent>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                {/* Available documents to assign */}
                <div className="flex-1 overflow-hidden flex flex-col space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    選擇報告進行指派
                    {selectedDocIds.length > 0 && (
                      <Badge className="ml-auto animate-scale-in">{selectedDocIds.length} 已選擇</Badge>
                    )}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="搜尋報告..."
                      value={docSearchQuery}
                      onChange={(e) => setDocSearchQuery(e.target.value)}
                      className="pl-10 mb-2"
                    />
                  </div>
                  <ScrollArea className="flex-1 rounded-lg border bg-muted/10 p-2">
                    <div className="space-y-1">
                      {filteredDocuments.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">沒有可用的報告</p>
                        </div>
                      ) : (
                        filteredDocuments.map((doc, idx) => {
                          const isAssigned = memberDocuments.some(md => md.document_id === doc.id);
                          const isSelected = selectedDocIds.includes(doc.id);
                          return (
                            <div
                              key={doc.id}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 animate-fade-in ${
                                isAssigned 
                                  ? 'bg-muted/50 opacity-60 cursor-not-allowed' 
                                  : isSelected 
                                    ? 'bg-primary/10 border border-primary/30 shadow-sm' 
                                    : 'hover:bg-muted/30 hover:shadow-sm'
                              }`}
                              style={{ animationDelay: `${Math.min(idx * 20, 200)}ms` }}
                              onClick={() => !isAssigned && toggleDocSelection(doc.id)}
                            >
                              <Checkbox
                                checked={isSelected || isAssigned}
                                disabled={isAssigned}
                                onCheckedChange={() => !isAssigned && toggleDocSelection(doc.id)}
                                className="transition-transform data-[state=checked]:scale-110"
                              />
                              <FileText className={`w-4 h-4 flex-shrink-0 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm truncate transition-colors ${isSelected ? 'font-medium text-primary' : ''}`}>{doc.file_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(doc.created_at).toLocaleDateString('zh-TW')}
                                </p>
                              </div>
                              {isAssigned && (
                                <Badge variant="secondary" className="text-xs">已指派</Badge>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={assignDocuments}
                disabled={selectedDocIds.length === 0 || isAssigning}
              >
                {isAssigning ? '指派中...' : `指派 ${selectedDocIds.length} 份報告`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
    </TooltipProvider>
  );
};

export default MembersPage;
