import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, Users, MessageSquare, Key, Eye, Upload, 
  ArrowRight, TrendingUp, Clock, Star, Activity,
  BarChart3, PieChart, Bell
} from "lucide-react";
import { format, subDays, isToday, isThisWeek } from "date-fns";
import { zhTW } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPie, Pie, Cell, Legend } from "recharts";

interface DashboardStats {
  totalDocuments: number;
  totalCustomers: number;
  totalFeedbacks: number;
  unreadFeedbacks: number;
  totalApiKeys: number;
  activeApiKeys: number;
  totalViews: number;
  totalApiCalls: number;
  todayViews: number;
  weekViews: number;
}

interface RecentActivity {
  id: string;
  type: 'document' | 'feedback' | 'customer';
  title: string;
  description: string;
  time: string;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    totalCustomers: 0,
    totalFeedbacks: 0,
    unreadFeedbacks: 0,
    totalApiKeys: 0,
    activeApiKeys: 0,
    totalViews: 0,
    totalApiCalls: 0,
    todayViews: 0,
    weekViews: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [documentsByMonth, setDocumentsByMonth] = useState<{ name: string; count: number }[]>([]);
  const [feedbackStatus, setFeedbackStatus] = useState<{ name: string; value: number }[]>([]);
  const [topDocuments, setTopDocuments] = useState<{ name: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        { data: documents },
        { data: customers },
        { data: feedbacks },
        { data: apiKeys },
      ] = await Promise.all([
        supabase.from("documents").select("id, original_name, view_count, created_at, updated_at"),
        supabase.from("customers").select("id, name, created_at"),
        supabase.from("feedbacks").select("id, document_title, message, is_read, follow_up_status, created_at"),
        supabase.from("api_keys").select("id, name, is_active, usage_count, last_used_at"),
      ]);

      // Calculate stats
      const totalViews = documents?.reduce((sum, doc) => sum + (doc.view_count || 0), 0) || 0;
      const totalApiCalls = apiKeys?.reduce((sum, key) => sum + (key.usage_count || 0), 0) || 0;
      const unreadFeedbacks = feedbacks?.filter(f => !f.is_read).length || 0;
      const activeApiKeys = apiKeys?.filter(k => k.is_active).length || 0;

      setStats({
        totalDocuments: documents?.length || 0,
        totalCustomers: customers?.length || 0,
        totalFeedbacks: feedbacks?.length || 0,
        unreadFeedbacks,
        totalApiKeys: apiKeys?.length || 0,
        activeApiKeys,
        totalViews,
        totalApiCalls,
        todayViews: 0, // Would need view history table for accurate tracking
        weekViews: 0,
      });

      // Recent activities
      const activities: RecentActivity[] = [];
      
      documents?.slice(0, 3).forEach(doc => {
        activities.push({
          id: doc.id,
          type: 'document',
          title: doc.original_name,
          description: '文件已更新',
          time: doc.updated_at,
        });
      });

      feedbacks?.filter(f => !f.is_read).slice(0, 3).forEach(fb => {
        activities.push({
          id: fb.id,
          type: 'feedback',
          title: fb.document_title,
          description: fb.message.substring(0, 50) + (fb.message.length > 50 ? '...' : ''),
          time: fb.created_at,
        });
      });

      customers?.slice(0, 2).forEach(c => {
        activities.push({
          id: c.id,
          type: 'customer',
          title: c.name,
          description: '新客戶加入',
          time: c.created_at,
        });
      });

      // Sort by time
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivities(activities.slice(0, 6));

      // Documents by month (last 6 months)
      const monthCounts: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = subDays(now, i * 30);
        const key = format(d, 'MM月', { locale: zhTW });
        monthCounts[key] = 0;
      }
      documents?.forEach(doc => {
        const docDate = new Date(doc.created_at);
        const key = format(docDate, 'MM月', { locale: zhTW });
        if (monthCounts[key] !== undefined) {
          monthCounts[key]++;
        }
      });
      setDocumentsByMonth(Object.entries(monthCounts).map(([name, count]) => ({ name, count })));

      // Feedback status distribution
      const statusCounts = {
        pending: feedbacks?.filter(f => f.follow_up_status === 'pending').length || 0,
        contacted: feedbacks?.filter(f => f.follow_up_status === 'contacted').length || 0,
        resolved: feedbacks?.filter(f => f.follow_up_status === 'resolved').length || 0,
      };
      setFeedbackStatus([
        { name: '待處理', value: statusCounts.pending },
        { name: '已聯繫', value: statusCounts.contacted },
        { name: '已解決', value: statusCounts.resolved },
      ]);

      // Top documents by views
      const sortedDocs = [...(documents || [])]
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5);
      setTopDocuments(sortedDocs.map(doc => ({
        name: doc.original_name.length > 15 ? doc.original_name.substring(0, 15) + '...' : doc.original_name,
        views: doc.view_count || 0,
      })));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  const quickActions = [
    { icon: Upload, label: "上傳文件", path: "/dashboard", color: "bg-primary" },
    { icon: Users, label: "客戶管理", path: "/customers", color: "bg-blue-500" },
    { icon: MessageSquare, label: "查看回饋", path: "/feedbacks", color: "bg-green-500" },
    { icon: Key, label: "API Keys", path: "/admin/api-keys", color: "bg-amber-500" },
  ];

  const statCards = [
    { icon: FileText, label: "總文件數", value: stats.totalDocuments, color: "text-primary", bgColor: "bg-primary/10", path: "/files" },
    { icon: Users, label: "客戶數", value: stats.totalCustomers, color: "text-blue-600", bgColor: "bg-blue-100", path: "/customers" },
    { icon: Eye, label: "總閱讀數", value: stats.totalViews, color: "text-green-600", bgColor: "bg-green-100", path: "/files" },
    { icon: MessageSquare, label: "回饋訊息", value: stats.totalFeedbacks, badge: stats.unreadFeedbacks, color: "text-purple-600", bgColor: "bg-purple-100", path: "/feedbacks" },
    { icon: Key, label: "API Keys", value: stats.totalApiKeys, subtext: `${stats.activeApiKeys} 啟用中`, color: "text-amber-600", bgColor: "bg-amber-100", path: "/admin/api-keys" },
    { icon: Activity, label: "API 調用", value: stats.totalApiCalls, color: "text-rose-600", bgColor: "bg-rose-100", path: "/admin/api-keys" },
  ];

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

      <main className="container mx-auto px-4 py-6 sm:py-10 space-y-6">
        {/* Page Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground mb-2">
            後台總覽
          </h1>
          <p className="text-muted-foreground">
            統一管理所有功能與數據
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up">
          {quickActions.map((action, index) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:shadow-md transition-all"
              onClick={() => navigate(action.path)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat, index) => (
            <Card 
              key={stat.label}
              className="cursor-pointer hover:shadow-md transition-all animate-slide-up"
              onClick={() => navigate(stat.path)}
              style={{ animationDelay: `${(index + 4) * 0.05}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  {stat.badge && stat.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {stat.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground font-serif">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
                {stat.subtext && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.subtext}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Documents by Views */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                熱門文件
              </CardTitle>
              <CardDescription>閱讀次數最高的文件</CardDescription>
            </CardHeader>
            <CardContent>
              {topDocuments.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topDocuments} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString(), '閱讀次數']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                  尚無數據
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                回饋狀態分布
              </CardTitle>
              <CardDescription>各狀態的回饋數量</CardDescription>
            </CardHeader>
            <CardContent>
              {feedbackStatus.some(s => s.value > 0) ? (
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsPie>
                    <Pie
                      data={feedbackStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {feedbackStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString(), '數量']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                  尚無回饋數據
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4" />
                最近動態
              </CardTitle>
              <CardDescription>系統最新活動記錄</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      activity.type === 'document' ? 'bg-primary/10' :
                      activity.type === 'feedback' ? 'bg-purple-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.type === 'document' && <FileText className="w-5 h-5 text-primary" />}
                      {activity.type === 'feedback' && <MessageSquare className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'customer' && <Users className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(activity.time), 'MM/dd HH:mm', { locale: zhTW })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暫無最近動態
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
