import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Copy, Trash2, Eye, EyeOff, RefreshCw, BarChart3, Activity, Key } from "lucide-react";
import { format, subDays } from "date-fns";
import { zhTW } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface ApiKey {
  id: string;
  key_prefix: string;
  name: string;
  description: string | null;
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  is_active: boolean;
  usage_count: number;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyDescription, setNewKeyDescription] = useState("");
  const [newKeyExpiresDays, setNewKeyExpiresDays] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("載入 API Keys 失敗");
      console.error(error);
    } else {
      setApiKeys(data || []);
    }
    setLoading(false);
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'mk_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("請輸入 API Key 名稱");
      return;
    }

    setCreating(true);
    try {
      const plainKey = generateRandomKey();
      const keyPrefix = plainKey.substring(0, 8);

      // Hash the key using database function
      const { data: hashedKey, error: hashError } = await supabase
        .rpc('hash_api_key', { key: plainKey });

      if (hashError) throw hashError;

      const { data: { user } } = await supabase.auth.getUser();
      
      const expiresAt = newKeyExpiresDays 
        ? new Date(Date.now() + newKeyExpiresDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from("api_keys")
        .insert({
          key_hash: hashedKey,
          key_prefix: keyPrefix,
          name: newKeyName.trim(),
          description: newKeyDescription.trim() || null,
          expires_at: expiresAt,
          created_by: user?.id,
        });

      if (error) throw error;

      setGeneratedKey(plainKey);
      setShowKey(true);
      toast.success("API Key 已建立");
      fetchApiKeys();
    } catch (error) {
      console.error(error);
      toast.error("建立 API Key 失敗");
    }
    setCreating(false);
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      toast.success("已複製到剪貼簿");
    }
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewKeyName("");
    setNewKeyDescription("");
    setNewKeyExpiresDays(null);
    setGeneratedKey(null);
    setShowKey(false);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("api_keys")
      .update({ is_active: !isActive })
      .eq("id", id);

    if (error) {
      toast.error("更新失敗");
    } else {
      toast.success(isActive ? "已停用" : "已啟用");
      fetchApiKeys();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個 API Key 嗎？此操作無法復原。")) return;

    const { error } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("刪除失敗");
    } else {
      toast.success("已刪除");
      fetchApiKeys();
    }
  };

  // Calculate statistics
  const totalUsage = apiKeys.reduce((sum, key) => sum + key.usage_count, 0);
  const activeKeys = apiKeys.filter(key => key.is_active).length;
  const expiredKeys = apiKeys.filter(key => key.expires_at && new Date(key.expires_at) < new Date()).length;

  // Prepare data for pie chart (usage distribution)
  const usageDistributionData = apiKeys
    .filter(key => key.usage_count > 0)
    .map(key => ({
      name: key.name,
      value: key.usage_count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Prepare data for bar chart (top API keys by usage)
  const topKeysData = apiKeys
    .map(key => ({
      name: key.name.length > 10 ? key.name.substring(0, 10) + '...' : key.name,
      fullName: key.name,
      usage: key.usage_count,
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 6);

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總 API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeKeys} 個啟用中
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總使用次數</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              所有 API 調用
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">啟用中</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeKeys}</div>
            <p className="text-xs text-muted-foreground">
              可使用的 Keys
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已過期</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{expiredKeys}</div>
            <p className="text-xs text-muted-foreground">
              需要更新
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {apiKeys.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Bar Chart - Top API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">使用量排行</CardTitle>
              <CardDescription>各 API Key 使用次數統計</CardDescription>
            </CardHeader>
            <CardContent>
              {topKeysData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topKeysData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString(), '使用次數']}
                      labelFormatter={(label) => topKeysData.find(d => d.name === label)?.fullName || label}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="usage" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  尚無使用數據
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart - Usage Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">使用比例分布</CardTitle>
              <CardDescription>前 5 名 API Key 使用佔比</CardDescription>
            </CardHeader>
            <CardContent>
              {usageDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={usageDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name.substring(0, 6)}${name.length > 6 ? '..' : ''} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {usageDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString(), '使用次數']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      formatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  尚無使用數據
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Keys Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Keys 管理</CardTitle>
            <CardDescription>
              管理外部網站存取權限的 API Keys
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchApiKeys}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  建立 API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>建立新的 API Key</DialogTitle>
                  <DialogDescription>
                    建立一個新的 API Key 供外部網站使用
                  </DialogDescription>
                </DialogHeader>

                {generatedKey ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800 font-medium mb-2">
                        ⚠️ 請立即複製此 API Key，關閉後將無法再次查看
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          type={showKey ? "text" : "password"}
                          value={generatedKey}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowKey(!showKey)}
                        >
                          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyKey}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCloseCreateDialog}>完成</Button>
                    </DialogFooter>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">名稱 *</Label>
                        <Input
                          id="name"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          placeholder="例如：八字網站"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">描述</Label>
                        <Textarea
                          id="description"
                          value={newKeyDescription}
                          onChange={(e) => setNewKeyDescription(e.target.value)}
                          placeholder="選填，說明此 Key 的用途"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expires">有效期限（天）</Label>
                        <Input
                          id="expires"
                          type="number"
                          value={newKeyExpiresDays || ""}
                          onChange={(e) => setNewKeyExpiresDays(e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="留空表示永不過期"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleCloseCreateDialog}>
                        取消
                      </Button>
                      <Button onClick={handleCreateKey} disabled={creating}>
                        {creating ? "建立中..." : "建立"}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">載入中...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              尚未建立任何 API Key
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名稱</TableHead>
                  <TableHead>Key 前綴</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>使用次數</TableHead>
                  <TableHead>最後使用</TableHead>
                  <TableHead>到期日</TableHead>
                  <TableHead>建立時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => {
                  const isExpired = key.expires_at && new Date(key.expires_at) < new Date();
                  return (
                    <TableRow key={key.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{key.name}</div>
                          {key.description && (
                            <div className="text-sm text-muted-foreground">{key.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {key.key_prefix}...
                        </code>
                      </TableCell>
                      <TableCell>
                        {isExpired ? (
                          <Badge variant="destructive">已過期</Badge>
                        ) : key.is_active ? (
                          <Badge variant="default">啟用中</Badge>
                        ) : (
                          <Badge variant="secondary">已停用</Badge>
                        )}
                      </TableCell>
                      <TableCell>{key.usage_count.toLocaleString()}</TableCell>
                      <TableCell>
                        {key.last_used_at
                          ? format(new Date(key.last_used_at), "yyyy/MM/dd HH:mm", { locale: zhTW })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {key.expires_at
                          ? format(new Date(key.expires_at), "yyyy/MM/dd", { locale: zhTW })
                          : "永久"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(key.created_at), "yyyy/MM/dd", { locale: zhTW })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(key.id, key.is_active)}
                          >
                            {key.is_active ? "停用" : "啟用"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">使用方式</h4>
            <p className="text-sm text-muted-foreground mb-2">
              在 HTTP 請求中加入 <code className="bg-muted px-1 py-0.5 rounded">X-API-Key</code> header：
            </p>
            <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`fetch('https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1/entitlements-lookup?email=user@example.com', {
  headers: {
    'X-API-Key': 'mk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
})`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}