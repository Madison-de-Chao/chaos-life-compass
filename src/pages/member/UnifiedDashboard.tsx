import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FileText, Settings, LogOut, Sparkles, Zap, Star, Compass,
  Calendar, CreditCard, ChevronRight, Shield, User, ExternalLink,
  Clock, CheckCircle, XCircle, AlertCircle, KeyRound, Unlink, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMember } from "@/hooks/useMember";
import { useMyEntitlements, useProducts, Entitlement, Product } from "@/hooks/useEntitlements";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

// Product display info
const PRODUCT_INFO: Record<string, { 
  icon: typeof Sparkles; 
  color: string; 
  bgColor: string; 
  borderColor: string;
  description: string;
  externalUrl?: string;
}> = {
  report_platform: {
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    description: "全方位命理解讀報告",
    externalUrl: "/home",
  },
  story_builder_hub: {
    icon: Star,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "命理桌遊互動體驗",
    externalUrl: undefined,
  },
  seek_monster: {
    icon: Compass,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    description: "探索與收集妖怪",
    externalUrl: undefined,
  },
  yuanyi_divination: {
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "元壹宇宙占卜系統",
    externalUrl: undefined,
  },
};

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  amount: number | null;
  currency: string | null;
}

interface AuthorizedApp {
  id: string;
  client_id: string;
  scope: string | null;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
  client_name?: string;
  client_description?: string;
}

const UnifiedDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, isAdmin, signOut } = useMember();
  const { data: entitlements = [], isLoading: loadingEntitlements } = useMyEntitlements();
  const { data: products = [] } = useProducts();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const [authorizedApps, setAuthorizedApps] = useState<AuthorizedApp[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
      fetchAuthorizedApps();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubscriptions(data);
    }
    setLoadingSubscriptions(false);
  };

  const fetchAuthorizedApps = async () => {
    setLoadingApps(true);
    try {
      // Fetch access tokens with client info
      const { data: tokens, error: tokensError } = await supabase
        .from('oauth_access_tokens')
        .select('id, client_id, scope, created_at, expires_at, revoked_at')
        .eq('user_id', user?.id)
        .is('revoked_at', null)
        .order('created_at', { ascending: false });

      if (tokensError) throw tokensError;

      // Fetch client details for each unique client_id
      const uniqueClientIds = [...new Set((tokens || []).map(t => t.client_id))];
      const { data: clients } = await supabase
        .from('oauth_clients')
        .select('client_id, name, description')
        .in('client_id', uniqueClientIds);

      // Map client info to tokens
      const appsWithDetails: AuthorizedApp[] = (tokens || []).map(token => {
        const client = clients?.find(c => c.client_id === token.client_id);
        return {
          ...token,
          client_name: client?.name,
          client_description: client?.description || undefined,
        };
      });

      setAuthorizedApps(appsWithDetails);
    } catch (error) {
      console.error('Error fetching authorized apps:', error);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleRevokeAccess = async (tokenId: string, clientName: string) => {
    setRevokingId(tokenId);
    try {
      const { error } = await supabase
        .from('oauth_access_tokens')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', tokenId);

      if (error) throw error;

      setAuthorizedApps(prev => prev.filter(app => app.id !== tokenId));
      toast({
        title: "已撤銷授權",
        description: `已取消「${clientName}」的存取權限`,
      });
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: "撤銷失敗",
        description: "無法撤銷授權，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setRevokingId(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "已登出" });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">載入中...</div>
      </div>
    );
  }

  // Process entitlements with product info
  const getEntitlementStatus = (ent: Entitlement) => {
    const now = new Date();
    if (ent.status === 'revoked') return 'revoked';
    if (ent.ends_at && new Date(ent.ends_at) < now) return 'expired';
    if (ent.status === 'active') return 'active';
    return ent.status;
  };

  const activeEntitlements = entitlements.filter(e => getEntitlementStatus(e) === 'active');
  const expiredEntitlements = entitlements.filter(e => getEntitlementStatus(e) === 'expired');

  const subscriptionLabels = {
    free: { label: '免費會員', variant: 'secondary' as const, icon: User },
    trial: { label: '試用中', variant: 'outline' as const, icon: Clock },
    active: { label: '付費會員', variant: 'default' as const, icon: CheckCircle },
    cancelled: { label: '已取消', variant: 'destructive' as const, icon: XCircle },
    expired: { label: '已過期', variant: 'destructive' as const, icon: AlertCircle },
  };

  const subStatus = profile?.subscription_status || 'free';
  const subInfo = subscriptionLabels[subStatus];
  const SubIcon = subInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </div>
            <span className="font-bold text-base sm:text-lg text-slate-100">會員中心</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {isAdmin && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs sm:text-sm px-2.5 sm:px-3"
              >
                <span className="hidden sm:inline">管理後台</span>
                <span className="sm:hidden">後台</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/account/profile")}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 w-9 h-9 sm:w-10 sm:h-10"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 w-9 h-9 sm:w-10 sm:h-10"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100 mb-2">
            歡迎回來，{profile?.display_name || '會員'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge variant={subInfo.variant} className="flex items-center gap-1">
              <SubIcon className="w-3 h-3" />
              {subInfo.label}
            </Badge>
            {user?.email && (
              <span className="text-xs sm:text-sm text-slate-400 truncate max-w-[200px] sm:max-w-none">{user.email}</span>
            )}
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 w-full flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="products" className="data-[state=active]:bg-slate-700 flex-1 text-xs sm:text-sm px-2 sm:px-3">
              產品權限
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-slate-700 flex-1 text-xs sm:text-sm px-2 sm:px-3">
              訂閱記錄
            </TabsTrigger>
            <TabsTrigger value="apps" className="data-[state=active]:bg-slate-700 flex-1 text-xs sm:text-sm px-2 sm:px-3">
              已授權
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700 flex-1 text-xs sm:text-sm px-2 sm:px-3">
              個人資料
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Active Entitlements */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  有效權限
                </CardTitle>
                <CardDescription className="text-slate-400">
                  您目前可以使用的產品與服務
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEntitlements ? (
                  <div className="text-slate-400 text-center py-8">載入中...</div>
                ) : activeEntitlements.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 mb-2">尚無有效權限</p>
                    <p className="text-sm text-slate-500">購買產品或訂閱後，權限會自動出現在這裡</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeEntitlements.map((ent) => {
                      const product = products.find(p => p.id === ent.product_id);
                      const info = PRODUCT_INFO[ent.product_id] || {
                        icon: FileText,
                        color: "from-slate-500 to-slate-600",
                        bgColor: "bg-slate-500/10",
                        borderColor: "border-slate-500/30",
                        description: "產品服務",
                      };
                      const Icon = info.icon;

                      return (
                        <div
                          key={ent.id}
                          className={`p-3 sm:p-5 rounded-xl ${info.bgColor} border ${info.borderColor} transition-all hover:scale-[1.01] sm:hover:scale-[1.02] group`}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base text-slate-100 mb-0.5 sm:mb-1">
                                {product?.name || ent.product_id}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
                                {info.description}
                              </p>
                              {ent.ends_at && (
                                <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  有效至 {format(new Date(ent.ends_at), 'yyyy/MM/dd', { locale: zhTW })}
                                </p>
                              )}
                            </div>
                            {info.externalUrl && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => navigate(info.externalUrl!)}
                                className="text-slate-400 hover:text-slate-200 w-8 h-8 sm:w-9 sm:h-9"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expired/Available Products */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  更多產品
                </CardTitle>
                <CardDescription className="text-slate-400">
                  探索我們提供的其他服務
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products
                    .filter(p => !activeEntitlements.some(e => e.product_id === p.id))
                    .map((product) => {
                      const info = PRODUCT_INFO[product.id] || {
                        icon: FileText,
                        color: "from-slate-500 to-slate-600",
                        bgColor: "bg-slate-500/10",
                        borderColor: "border-slate-500/30",
                        description: product.description || "產品服務",
                      };
                      const Icon = info.icon;
                      const expiredEnt = expiredEntitlements.find(e => e.product_id === product.id);

                      return (
                        <div
                          key={product.id}
                          className="p-5 rounded-xl bg-slate-700/30 border border-slate-600/30 transition-all hover:bg-slate-700/50 group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-300 mb-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-slate-500 mb-2">
                                {product.description || info.description}
                              </p>
                              {expiredEnt && (
                                <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                                  已過期
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              了解更多
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authorized Apps Tab */}
          <TabsContent value="apps" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-500" />
                  已授權應用程式
                </CardTitle>
                <CardDescription className="text-slate-400">
                  您已授權以下外部應用程式存取您的帳戶資料
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingApps ? (
                  <div className="text-slate-400 text-center py-8">載入中...</div>
                ) : authorizedApps.length === 0 ? (
                  <div className="text-center py-12">
                    <KeyRound className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 mb-2">尚無授權的應用程式</p>
                    <p className="text-sm text-slate-500">
                      當您使用第三方應用程式登入時，授權記錄會顯示在這裡
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {authorizedApps.map((app) => {
                      const isExpired = new Date(app.expires_at) < new Date();
                      
                      return (
                        <div
                          key={app.id}
                          className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all ${
                            isExpired 
                              ? 'bg-slate-700/20 border-slate-600/20 opacity-60' 
                              : 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/15'
                          }`}
                        >
                          <div className="flex items-start gap-3 sm:gap-4 flex-1">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isExpired ? 'bg-slate-700/50' : 'bg-purple-500/20'
                            }`}>
                              <KeyRound className={`w-5 h-5 sm:w-6 sm:h-6 ${isExpired ? 'text-slate-500' : 'text-purple-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                                <h3 className="font-semibold text-sm sm:text-base text-slate-200">
                                  {app.client_name || app.client_id}
                                </h3>
                                {isExpired && (
                                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                    已過期
                                  </Badge>
                                )}
                              </div>
                              {app.client_description && (
                                <p className="text-xs sm:text-sm text-slate-400 mb-1">
                                  {app.client_description}
                                </p>
                              )}
                              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 text-[10px] sm:text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  授權於 {format(new Date(app.created_at), 'MM/dd HH:mm', { locale: zhTW })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  有效至 {format(new Date(app.expires_at), 'MM/dd HH:mm', { locale: zhTW })}
                                </span>
                              </div>
                              {app.scope && (
                                <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1">
                                  {app.scope.split(' ').map((s) => (
                                    <Badge key={s} variant="outline" className="text-[10px] sm:text-xs border-slate-600 text-slate-400">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {!isExpired && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeAccess(app.id, app.client_name || app.client_id)}
                              disabled={revokingId === app.id}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full sm:w-auto justify-center text-xs sm:text-sm"
                            >
                              {revokingId === app.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Unlink className="w-4 h-4 mr-1" />
                                  撤銷授權
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Security Note */}
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-200 mb-1">安全提示</h4>
                    <p className="text-sm text-slate-400">
                      定期檢查您授權的應用程式。如果發現不認識或不再使用的應用，建議立即撤銷其存取權限以保護您的帳戶安全。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  訂閱與消費記錄
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSubscriptions ? (
                  <div className="text-slate-400 text-center py-8">載入中...</div>
                ) : subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 mb-2">尚無消費記錄</p>
                    <p className="text-sm text-slate-500">訂閱或購買後，記錄會自動出現在這裡</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-700/30 border border-slate-600/30"
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base text-slate-200">
                            {sub.plan_name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-slate-500">
                            {format(new Date(sub.started_at), 'MM/dd', { locale: zhTW })}
                            {sub.expires_at && ` - ${format(new Date(sub.expires_at), 'MM/dd', { locale: zhTW })}`}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {sub.amount && (
                            <p className="text-xs sm:text-sm font-medium text-slate-200">
                              {sub.currency || 'TWD'} {sub.amount.toLocaleString()}
                            </p>
                          )}
                          <Badge 
                            variant={sub.status === 'active' ? 'default' : 'secondary'}
                            className="text-[10px] sm:text-xs"
                          >
                            {sub.status === 'active' ? '有效' : sub.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    個人資料
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    管理您的基本資訊
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/account/profile")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  編輯資料
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">暱稱</p>
                      <p className="text-slate-200">{profile?.display_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email</p>
                      <p className="text-slate-200">{user?.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">性別</p>
                      <p className="text-slate-200">{profile?.gender || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">出生日期</p>
                      <p className="text-slate-200">{profile?.birth_date || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">出生時間</p>
                      <p className="text-slate-200">{profile?.birth_time || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">出生地</p>
                      <p className="text-slate-200">{profile?.birth_place || '-'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UnifiedDashboard;
