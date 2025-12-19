import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Search, Filter, Mail, Phone, Calendar, 
  FileText, MessageSquare, Star, MoreHorizontal,
  Eye, ChevronDown, Plus, Clock, User, Send, Check, X, Crown
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
import { Header } from "@/components/Header";
import { SubscriptionManagement } from "@/components/SubscriptionManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
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
  
  // Document assignment state
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [memberDocuments, setMemberDocuments] = useState<MemberDocument[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [docSearchQuery, setDocSearchQuery] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      toast({ title: "載入失敗", variant: "destructive" });
      return;
    }

    // Fetch document counts
    const membersWithCounts = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { count: docCount } = await supabase
          .from('member_documents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.user_id);

        const { count: interactionCount } = await supabase
          .from('member_interactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.user_id);

        return {
          ...profile,
          document_count: docCount || 0,
          interaction_count: interactionCount || 0,
        };
      })
    );

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

  const updateSubscriptionStatus = async (userId: string, status: 'free' | 'trial' | 'active' | 'cancelled' | 'expired') => {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: status })
      .eq('user_id', userId);

    if (error) {
      toast({ title: "更新失敗", variant: "destructive" });
    } else {
      toast({ title: "會員狀態已更新" });
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
      (member.phone?.includes(searchQuery));
    
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
    <div className="min-h-screen gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              會員管理
            </h1>
            <p className="text-muted-foreground mt-1">
              共 {members.length} 位會員
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜尋暱稱或電話..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
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
          {Object.entries(subscriptionLabels).map(([status, info]) => {
            const count = members.filter(m => m.subscription_status === status).length;
            return (
              <Card key={status} className="bg-card/60 backdrop-blur">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <Badge variant={info.variant} className="mt-1">{info.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Members List */}
        <Card className="bg-card/60 backdrop-blur">
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">載入中...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">尚無會員</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredMembers.map((member) => {
                  const subInfo = subscriptionLabels[member.subscription_status] || subscriptionLabels.free;
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">
                            {member.display_name || '未設定暱稱'}
                          </h3>
                          <Badge variant={subInfo.variant} className="text-xs">
                            {subInfo.label}
                          </Badge>
                          {isExpiringSoon(member.subscription_expires_at) && (
                            <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {getDaysRemaining(member.subscription_expires_at)}天到期
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {member.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {member.phone}
                            </span>
                          )}
                          {member.birth_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {member.birth_date}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {member.document_count} 份報告
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {member.interaction_count} 次互動
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
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
                                <User className="w-5 h-5" />
                                會員詳情
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedMember && (
                              <div className="space-y-6">
                                {/* Member Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">暱稱</Label>
                                    <div>{selectedMember.display_name || '-'}</div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">電話</Label>
                                    <div>{selectedMember.phone || '-'}</div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">生日</Label>
                                    <div>{selectedMember.birth_date || '-'}</div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">性別</Label>
                                    <div>
                                      {selectedMember.gender === 'male' ? '男' : 
                                       selectedMember.gender === 'female' ? '女' : 
                                       selectedMember.gender || '-'}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">註冊時間</Label>
                                    <div>{new Date(selectedMember.created_at).toLocaleDateString('zh-TW')}</div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">註冊時間</Label>
                                    <div>{new Date(selectedMember.created_at).toLocaleDateString('zh-TW')}</div>
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

                                {/* Add Note */}
                                <div className="space-y-2">
                                  <Label>新增備註</Label>
                                  <div className="flex gap-2">
                                    <Textarea
                                      value={newNote}
                                      onChange={(e) => setNewNote(e.target.value)}
                                      placeholder="輸入管理員備註..."
                                      rows={2}
                                    />
                                    <Button 
                                      onClick={addAdminNote}
                                      disabled={!newNote.trim() || isAddingNote}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Interactions */}
                                <div>
                                  <Label className="mb-2 block">互動紀錄</Label>
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {interactions.length === 0 ? (
                                      <p className="text-sm text-muted-foreground text-center py-4">
                                        尚無互動紀錄
                                      </p>
                                    ) : (
                                      interactions.map((interaction) => (
                                        <div
                                          key={interaction.id}
                                          className="p-3 bg-muted/30 rounded-lg text-sm"
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
                                            <p className="text-muted-foreground">{interaction.content}</p>
                                          )}
                                          {interaction.document?.file_name && (
                                            <p className="text-xs text-primary mt-1">
                                              報告：{interaction.document.file_name}
                                            </p>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAssignDialog(member)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          指派報告
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openAssignDialog(member)}>
                              <Send className="w-4 h-4 mr-2" />
                              指派報告
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSubscriptionStatus(member.user_id, 'active')}>
                              <Star className="w-4 h-4 mr-2" />
                              設為訂閱會員
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSubscriptionStatus(member.user_id, 'free')}>
                              設為免費會員
                            </DropdownMenuItem>
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
                <Send className="w-5 h-5" />
                指派報告給 {selectedMember?.display_name || '會員'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden flex flex-col gap-4">
              {/* Member's current documents */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">已指派報告 ({memberDocuments.length})</Label>
                {memberDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">尚未指派任何報告</p>
                ) : (
                  <ScrollArea className="h-32 rounded-md border p-2">
                    <div className="space-y-2">
                      {memberDocuments.map((md) => (
                        <div key={md.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm">{md.document?.file_name || '報告'}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-destructive hover:text-destructive"
                            onClick={() => revokeDocument(md.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Available documents to assign */}
              <div className="flex-1 overflow-hidden flex flex-col space-y-2">
                <Label className="text-sm font-medium">選擇報告進行指派</Label>
                <Input
                  placeholder="搜尋報告..."
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="flex-1 rounded-md border p-2">
                  <div className="space-y-1">
                    {filteredDocuments.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">沒有可用的報告</p>
                    ) : (
                      filteredDocuments.map((doc) => {
                        const isAssigned = memberDocuments.some(md => md.document_id === doc.id);
                        const isSelected = selectedDocIds.includes(doc.id);
                        return (
                          <div
                            key={doc.id}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                              isAssigned 
                                ? 'bg-muted/50 opacity-60' 
                                : isSelected 
                                  ? 'bg-primary/10 border border-primary/30' 
                                  : 'hover:bg-muted/30'
                            }`}
                            onClick={() => !isAssigned && toggleDocSelection(doc.id)}
                          >
                            <Checkbox
                              checked={isSelected || isAssigned}
                              disabled={isAssigned}
                              onCheckedChange={() => !isAssigned && toggleDocSelection(doc.id)}
                            />
                            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{doc.file_name}</p>
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

            <DialogFooter className="mt-4">
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
  );
};

export default MembersPage;
