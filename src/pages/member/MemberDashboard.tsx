import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FileText, Heart, Settings, LogOut, Sparkles, 
  Calendar, Clock, MapPin, User, ChevronRight,
  Star, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMember } from "@/hooks/useMember";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MemberDocument {
  id: string;
  document_id: string;
  is_favorited: boolean;
  last_viewed_at: string | null;
  view_count: number;
  granted_at: string;
  document: {
    id: string;
    file_name: string;
    share_link: string;
    created_at: string;
  } | null;
}

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, isAdmin, isHelper, signOut } = useMember();
  const [documents, setDocuments] = useState<MemberDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/member/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMemberDocuments();
    }
  }, [user]);

  const fetchMemberDocuments = async () => {
    const { data, error } = await supabase
      .from('member_documents')
      .select(`
        id,
        document_id,
        is_favorited,
        last_viewed_at,
        view_count,
        granted_at,
        document:documents(id, file_name, share_link, created_at)
      `)
      .eq('user_id', user?.id)
      .order('granted_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      setDocuments(data as MemberDocument[]);
    }
    setLoadingDocs(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "已登出" });
    navigate("/home");
  };

  const toggleFavorite = async (docId: string, currentState: boolean) => {
    const { error } = await supabase
      .from('member_documents')
      .update({ is_favorited: !currentState })
      .eq('id', docId);

    if (!error) {
      setDocuments(docs => 
        docs.map(d => d.id === docId ? { ...d, is_favorited: !currentState } : d)
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

  const subscriptionLabels = {
    free: { label: '免費會員', variant: 'secondary' as const },
    trial: { label: '試用中', variant: 'outline' as const },
    active: { label: '訂閱會員', variant: 'default' as const },
    cancelled: { label: '已取消', variant: 'destructive' as const },
    expired: { label: '已過期', variant: 'destructive' as const },
  };

  const subStatus = profile?.subscription_status || 'free';
  const subInfo = subscriptionLabels[subStatus];

  return (
    <div className="min-h-screen bg-parchment relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <span className="font-serif font-bold text-lg">虹靈御所</span>
          </Link>

          <div className="flex items-center gap-3">
            {(isAdmin || isHelper) && (
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                {isAdmin ? '管理後台' : '小幫手後台'}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate("/member/profile")}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-serif mb-2">
            歡迎回來，{profile?.display_name || '會員'}
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant={subInfo.variant}>{subInfo.label}</Badge>
            {profile?.birth_date && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {profile.birth_date}
              </span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/60 backdrop-blur">
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{documents.length}</div>
              <div className="text-xs text-muted-foreground">我的報告</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-rose-500" />
              <div className="text-2xl font-bold">
                {documents.filter(d => d.is_favorited).length}
              </div>
              <div className="text-xs text-muted-foreground">收藏</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Eye className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">
                {documents.reduce((sum, d) => sum + d.view_count, 0)}
              </div>
              <div className="text-xs text-muted-foreground">總閱讀次數</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold capitalize">{subStatus}</div>
              <div className="text-xs text-muted-foreground">會員等級</div>
            </CardContent>
          </Card>
        </div>

        {/* My Reports */}
        <Card className="bg-card/60 backdrop-blur mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif flex items-center gap-2">
              <FileText className="w-5 h-5" />
              我的報告
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDocs ? (
              <div className="text-center py-8 text-muted-foreground">載入中...</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">尚無報告</p>
                <p className="text-sm text-muted-foreground">
                  購買命理服務後，報告會自動出現在這裡
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {doc.document?.file_name || '報告'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        取得日期：{new Date(doc.granted_at).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(doc.id, doc.is_favorited)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 ${doc.is_favorited ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} 
                        />
                      </button>
                      {doc.document?.share_link && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/view/${doc.document?.share_link}`)}
                        >
                          閱讀
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif flex items-center gap-2">
              <User className="w-5 h-5" />
              個人資料
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/member/profile")}>
              編輯資料
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">暱稱</div>
                  <div>{profile?.display_name || '-'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">出生日期</div>
                  <div>{profile?.birth_date || '-'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">出生時間</div>
                  <div>{profile?.birth_time || '-'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">出生地</div>
                  <div>{profile?.birth_place || '-'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemberDashboard;
