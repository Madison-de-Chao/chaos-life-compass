# 中優先級項目實作指南

> 會員中心獨立專案 - 中優先級功能完整實作參考

---

## 📋 項目總覽

| 項目 | 類型 | 複雜度 | 預估工時 |
|------|------|--------|----------|
| OAuth Refresh Token 機制 | 後端 | 中 | 2-3h |
| 管理後台頁面 | 前端 | 高 | 4-6h |
| Rate Limiting 強化 | 後端 | 低 | 1h |
| 會員管理介面 | 前端 | 中 | 2-3h |

---

## 1️⃣ OAuth Refresh Token 機制

### 1.1 資料庫變更

```sql
-- 新增 refresh_tokens 資料表
CREATE TABLE public.oauth_refresh_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  access_token_id UUID REFERENCES public.oauth_access_tokens(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES public.oauth_clients(client_id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  scope TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE
);

-- 建立索引
CREATE INDEX idx_refresh_tokens_token_hash ON public.oauth_refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_user_id ON public.oauth_refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_client_id ON public.oauth_refresh_tokens(client_id);

-- 啟用 RLS
ALTER TABLE public.oauth_refresh_tokens ENABLE ROW LEVEL SECURITY;

-- RLS 政策：僅允許透過函數操作
CREATE POLICY "No direct access to refresh tokens"
  ON public.oauth_refresh_tokens
  FOR ALL
  USING (false);

-- 雜湊函數
CREATE OR REPLACE FUNCTION public.hash_refresh_token(token TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(digest(token, 'sha256'), 'hex');
END;
$$;

-- 驗證 Refresh Token 函數
CREATE OR REPLACE FUNCTION public.verify_refresh_token(token TEXT)
RETURNS TABLE (
  id UUID,
  client_id TEXT,
  user_id UUID,
  scope TEXT,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token_hash_value TEXT;
BEGIN
  token_hash_value := encode(digest(token, 'sha256'), 'hex');
  
  RETURN QUERY
  SELECT 
    rt.id,
    rt.client_id,
    rt.user_id,
    rt.scope,
    (rt.expires_at > now() AND rt.revoked_at IS NULL) as is_valid
  FROM public.oauth_refresh_tokens rt
  WHERE rt.token_hash = token_hash_value;
END;
$$;

-- 撤銷用戶所有 Refresh Token
CREATE OR REPLACE FUNCTION public.revoke_user_refresh_tokens(
  p_user_id UUID,
  p_client_id TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  IF p_client_id IS NOT NULL THEN
    UPDATE public.oauth_refresh_tokens
    SET revoked_at = now()
    WHERE user_id = p_user_id 
      AND client_id = p_client_id
      AND revoked_at IS NULL;
  ELSE
    UPDATE public.oauth_refresh_tokens
    SET revoked_at = now()
    WHERE user_id = p_user_id
      AND revoked_at IS NULL;
  END IF;
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$;
```

### 1.2 Edge Function: Token Refresh 端點

在 `oauth-authorize/index.ts` 中新增 refresh token 處理：

```typescript
// 新增到現有的 oauth-authorize Edge Function

// === Refresh Token 處理 ===

function generateRefreshToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// 在 /token 端點中新增 refresh_token grant type 支援
if (grantType === 'refresh_token') {
  const refreshToken = body.get('refresh_token');
  
  if (!refreshToken) {
    return new Response(JSON.stringify({ 
      error: 'invalid_request',
      error_description: 'Missing refresh_token parameter'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  // 驗證 refresh token
  const { data: tokenData, error: verifyError } = await supabaseAdmin.rpc(
    'verify_refresh_token',
    { token: refreshToken }
  );
  
  if (verifyError || !tokenData || tokenData.length === 0 || !tokenData[0].is_valid) {
    return new Response(JSON.stringify({
      error: 'invalid_grant',
      error_description: 'Invalid or expired refresh token'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const tokenInfo = tokenData[0];
  
  // 驗證 client 匹配
  if (tokenInfo.client_id !== clientId) {
    return new Response(JSON.stringify({
      error: 'invalid_grant',
      error_description: 'Client mismatch'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  // 撤銷舊的 refresh token（Rotation）
  await supabaseAdmin
    .from('oauth_refresh_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', tokenInfo.id);
  
  // 產生新的 access token
  const newAccessToken = generateAccessToken();
  const accessTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour
  
  const { data: newTokenRecord, error: insertError } = await supabaseAdmin
    .from('oauth_access_tokens')
    .insert({
      token_hash: await hashToken(newAccessToken),
      client_id: clientId,
      user_id: tokenInfo.user_id,
      scope: tokenInfo.scope,
      expires_at: accessTokenExpiry.toISOString()
    })
    .select('id')
    .single();
  
  if (insertError) {
    return new Response(JSON.stringify({
      error: 'server_error',
      error_description: 'Failed to create access token'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  // 產生新的 refresh token
  const newRefreshToken = generateRefreshToken();
  const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days
  
  await supabaseAdmin
    .from('oauth_refresh_tokens')
    .insert({
      token_hash: await hashToken(newRefreshToken),
      access_token_id: newTokenRecord.id,
      client_id: clientId,
      user_id: tokenInfo.user_id,
      scope: tokenInfo.scope,
      expires_at: refreshTokenExpiry.toISOString()
    });
  
  return new Response(JSON.stringify({
    access_token: newAccessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: newRefreshToken,
    scope: tokenInfo.scope
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Helper: Hash token
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### 1.3 修改 Authorization Code Exchange

在成功交換 authorization code 時，同時發放 refresh token：

```typescript
// 在 authorization_code grant type 處理中新增

// 產生 refresh token
const refreshToken = generateRefreshToken();
const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days

await supabaseAdmin
  .from('oauth_refresh_tokens')
  .insert({
    token_hash: await hashToken(refreshToken),
    access_token_id: accessTokenRecord.id,
    client_id: clientId,
    user_id: authCode.user_id,
    scope: authCode.scope,
    expires_at: refreshTokenExpiry.toISOString()
  });

// 回傳中包含 refresh_token
return new Response(JSON.stringify({
  access_token: accessToken,
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: refreshToken,  // 新增
  scope: authCode.scope
}), {
  status: 200,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

---

## 2️⃣ 管理後台頁面

### 2.1 目錄結構

```
src/
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx      # 管理後台首頁
│       ├── MembersManagement.tsx   # 會員管理
│       ├── EntitlementsAdmin.tsx   # 權益管理
│       ├── OAuthClientsAdmin.tsx   # OAuth 客戶端管理
│       ├── ApiKeysAdmin.tsx        # API Key 管理
│       └── AdminLogsPage.tsx       # 操作日誌
└── components/
    └── admin/
        ├── AdminSidebar.tsx        # 側邊導航
        ├── AdminHeader.tsx         # 頂部標題
        ├── StatsCard.tsx           # 統計卡片
        └── DataTable.tsx           # 資料表格
```

### 2.2 AdminDashboard.tsx

```tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMember } from "@/modules/member";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Key, Shield, Activity } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface DashboardStats {
  totalUsers: number;
  activeEntitlements: number;
  oauthClients: number;
  apiKeys: number;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useMember();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeEntitlements: 0,
    oauthClients: 0,
    apiKeys: 0
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      const [usersRes, entitlementsRes, clientsRes, keysRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('entitlements').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('oauth_clients').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('api_keys').select('id', { count: 'exact', head: true }).eq('is_active', true)
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        activeEntitlements: entitlementsRes.count || 0,
        oauthClients: clientsRes.count || 0,
        apiKeys: keysRes.count || 0
      });
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">載入中...</div>;
  }

  const statsCards = [
    { title: "總會員數", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { title: "有效權益", value: stats.activeEntitlements, icon: Shield, color: "text-green-500" },
    { title: "OAuth 應用", value: stats.oauthClients, icon: Key, color: "text-amber-500" },
    { title: "API Keys", value: stats.apiKeys, icon: Activity, color: "text-purple-500" }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">管理後台總覽</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card) => (
            <Card key={card.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 快捷操作區 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>最近操作日誌</CardTitle>
            </CardHeader>
            <CardContent>
              {/* AdminLogsPreview component */}
              <p className="text-muted-foreground text-sm">載入最近的管理操作...</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>待處理事項</CardTitle>
            </CardHeader>
            <CardContent>
              {/* PendingItems component */}
              <p className="text-muted-foreground text-sm">目前沒有待處理事項</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
```

### 2.3 AdminSidebar.tsx

```tsx
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  FileKey,
  ScrollText,
  Settings,
  LogOut
} from "lucide-react";
import { useMember } from "@/modules/member";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "總覽", icon: LayoutDashboard },
  { href: "/admin/members", label: "會員管理", icon: Users },
  { href: "/admin/entitlements", label: "權益管理", icon: Shield },
  { href: "/admin/oauth-clients", label: "OAuth 應用", icon: Key },
  { href: "/admin/api-keys", label: "API Keys", icon: FileKey },
  { href: "/admin/logs", label: "操作日誌", icon: ScrollText },
  { href: "/admin/settings", label: "系統設定", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useMember();

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">會員中心管理</h2>
        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
      </div>

      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/admin" && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          登出
        </Button>
      </div>
    </aside>
  );
}
```

### 2.4 MembersManagement.tsx

```tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberWithRoles {
  id: string;
  user_id: string;
  display_name: string | null;
  full_name: string | null;
  subscription_status: string;
  created_at: string;
  roles: string[];
}

export default function MembersManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: members, isLoading, refetch } = useQuery({
    queryKey: ['admin-members', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          display_name,
          full_name,
          subscription_status,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data: profiles, error } = await query;
      if (error) throw error;

      // 獲取用戶角色
      const userIds = profiles?.map(p => p.user_id) || [];
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const rolesMap = new Map<string, string[]>();
      roles?.forEach(r => {
        const existing = rolesMap.get(r.user_id) || [];
        rolesMap.set(r.user_id, [...existing, r.role]);
      });

      return profiles?.map(p => ({
        ...p,
        roles: rolesMap.get(p.user_id) || ['user']
      })) as MemberWithRoles[];
    }
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      trial: "secondary",
      expired: "destructive",
      free: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">會員管理</h1>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            新增會員
          </Button>
        </div>

        {/* 搜尋列 */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋會員名稱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 會員列表 */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>會員</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>訂閱狀態</TableHead>
                <TableHead>加入時間</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    載入中...
                  </TableCell>
                </TableRow>
              ) : members?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    沒有找到會員
                  </TableCell>
                </TableRow>
              ) : (
                members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {member.display_name || member.full_name || '未命名'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.user_id.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {member.roles.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(member.subscription_status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(member.created_at).toLocaleDateString('zh-TW')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>查看詳情</DropdownMenuItem>
                          <DropdownMenuItem>編輯資料</DropdownMenuItem>
                          <DropdownMenuItem>管理權益</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            停用帳號
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
```

### 2.5 路由配置

```tsx
// App.tsx 中新增路由
import AdminDashboard from "@/pages/admin/AdminDashboard";
import MembersManagement from "@/pages/admin/MembersManagement";
import EntitlementsAdmin from "@/pages/admin/EntitlementsAdmin";
import OAuthClientsAdmin from "@/pages/admin/OAuthClientsAdmin";
import ApiKeysAdmin from "@/pages/admin/ApiKeysAdmin";
import AdminLogsPage from "@/pages/admin/AdminLogsPage";

// 在 Routes 中新增
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/members" element={<MembersManagement />} />
<Route path="/admin/entitlements" element={<EntitlementsAdmin />} />
<Route path="/admin/oauth-clients" element={<OAuthClientsAdmin />} />
<Route path="/admin/api-keys" element={<ApiKeysAdmin />} />
<Route path="/admin/logs" element={<AdminLogsPage />} />
```

---

## 3️⃣ Rate Limiting 強化

### 3.1 資料庫函數更新

```sql
-- 更新 rate_limits 表，支援更細緻的限制
ALTER TABLE public.rate_limits 
ADD COLUMN IF NOT EXISTS limit_type TEXT DEFAULT 'ip',
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 更強大的 rate limit 檢查函數
CREATE OR REPLACE FUNCTION public.check_rate_limit_v2(
  p_endpoint TEXT,
  p_identifier TEXT,
  p_limit_type TEXT DEFAULT 'ip',
  p_max_requests INTEGER DEFAULT 100,
  p_window_seconds INTEGER DEFAULT 3600,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
  result JSONB;
BEGIN
  window_start := now() - (p_window_seconds || ' seconds')::interval;

  -- 清理過期記錄
  DELETE FROM rate_limits
  WHERE window_start < now() - INTERVAL '24 hours';

  -- 計算當前窗口的請求數
  SELECT COALESCE(SUM(request_count), 0)
  INTO current_count
  FROM rate_limits
  WHERE endpoint = p_endpoint
    AND identifier = p_identifier
    AND limit_type = p_limit_type
    AND window_start >= window_start;

  -- 檢查是否超過限制
  IF current_count >= p_max_requests THEN
    result := jsonb_build_object(
      'allowed', false,
      'current', current_count,
      'limit', p_max_requests,
      'reset_at', (window_start + (p_window_seconds || ' seconds')::interval)
    );
  ELSE
    -- 記錄請求
    INSERT INTO rate_limits (endpoint, identifier, limit_type, request_count, metadata, window_start)
    VALUES (p_endpoint, p_identifier, p_limit_type, 1, p_metadata, now())
    ON CONFLICT (endpoint, identifier, window_start)
    DO UPDATE SET 
      request_count = rate_limits.request_count + 1,
      metadata = COALESCE(p_metadata, rate_limits.metadata);
    
    result := jsonb_build_object(
      'allowed', true,
      'current', current_count + 1,
      'limit', p_max_requests,
      'remaining', p_max_requests - current_count - 1
    );
  END IF;

  RETURN result;
END;
$$;
```

### 3.2 Edge Function 整合

```typescript
// 通用 rate limiting 中間件
async function checkRateLimit(
  supabase: SupabaseClient,
  endpoint: string,
  identifier: string,
  options: {
    maxRequests?: number;
    windowSeconds?: number;
    limitType?: 'ip' | 'user' | 'api_key';
  } = {}
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
  const { maxRequests = 100, windowSeconds = 3600, limitType = 'ip' } = options;
  
  const { data, error } = await supabase.rpc('check_rate_limit_v2', {
    p_endpoint: endpoint,
    p_identifier: identifier,
    p_limit_type: limitType,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds
  });

  if (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true, headers: {} };
  }

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(data.limit),
    'X-RateLimit-Remaining': String(data.remaining || 0),
  };

  if (data.reset_at) {
    headers['X-RateLimit-Reset'] = data.reset_at;
  }

  return { allowed: data.allowed, headers };
}

// 使用範例
const { allowed, headers } = await checkRateLimit(
  supabaseAdmin,
  '/oauth/token',
  clientIp,
  { maxRequests: 20, windowSeconds: 60 }
);

if (!allowed) {
  return new Response(JSON.stringify({
    error: 'rate_limit_exceeded',
    error_description: 'Too many requests'
  }), {
    status: 429,
    headers: { ...corsHeaders, ...headers, 'Content-Type': 'application/json' }
  });
}
```

---

## 4️⃣ 實作優先順序建議

| 順序 | 項目 | 原因 |
|------|------|------|
| 1 | Rate Limiting 強化 | 安全性基礎，複雜度低 |
| 2 | OAuth Refresh Token | 改善用戶體驗，減少重新授權 |
| 3 | 管理後台 - 統計總覽 | 管理者最常用功能 |
| 4 | 管理後台 - 會員管理 | 核心管理功能 |
| 5 | 管理後台 - 其他頁面 | 按需開發 |

---

## 📎 相關文件

- [架構審查清單](./ARCHITECTURE_REVIEW_CHECKLIST.md)
- [完整遷移打包](./COMPLETE_MIGRATION_PACKAGE.md)
- [缺少組件指南](./MISSING_COMPONENTS_GUIDE.md)
- [樣式同步清單](./STYLE_SYNC_CHECKLIST.md)

---

*文件版本：v1.0 | 更新日期：2026-01-14*
