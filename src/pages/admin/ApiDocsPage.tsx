import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Key, User, FileText, Code, Copy, CheckCircle, AlertTriangle, BookOpen, Workflow, Terminal, Download, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const ApiDocsPage = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yyzcgxnvtprojutnxisz.supabase.co";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5emNneG52dHByb2p1dG54aXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2Mzc4NjMsImV4cCI6MjA4MTIxMzg2M30.1MekiqwQCjZ4mWZlBmb7VY-Y2mnqKhHxCaYDJYoqWfw";

  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems({ ...copiedItems, [id]: true });
    toast.success("已複製到剪貼簿");
    setTimeout(() => {
      setCopiedItems({ ...copiedItems, [id]: false });
    }, 2000);
  };

  const CodeBlock = ({ code, language = "typescript", id }: { code: string; language?: string; id: string }) => (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedItems[id] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Entitlements API 完整文件</h1>
                <p className="text-muted-foreground">
                  中央授權系統 API 參考文件 - 用於外部專案驗證用戶權限
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/external-api-test">
                <Button variant="outline" size="sm">
                  <Terminal className="mr-2 h-4 w-4" />
                  測試 API
                </Button>
              </Link>
              <Link to="/admin/api-keys">
                <Button variant="outline" size="sm">
                  <Key className="mr-2 h-4 w-4" />
                  管理 API Keys
                </Button>
              </Link>
              <Link to="/admin/entitlements">
                <Button variant="outline" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  權限管理
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Start */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                快速開始
              </CardTitle>
              <CardDescription>5 分鐘內開始使用 Entitlements API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">1. 取得 API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    前往 <Link to="/admin/api-keys" className="text-primary underline">API Keys 管理頁面</Link> 建立一個新的 API Key
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">2. 發送請求</h4>
                  <CodeBlock
                    id="quickstart"
                    code={`curl -X GET "${supabaseUrl}/functions/v1/check-entitlement?product_id=report_platform&email=user@example.com" \\
  -H "X-API-Key: your-api-key"`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                系統架構概覽
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-8 flex-wrap">
                    <div className="p-4 bg-background rounded-lg border shadow-sm">
                      <p className="font-semibold">外部專案</p>
                      <p className="text-xs text-muted-foreground">Story Builder Hub</p>
                      <p className="text-xs text-muted-foreground">Seek Monster</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 shadow-sm">
                      <p className="font-semibold text-primary">中央授權系統</p>
                      <p className="text-xs text-muted-foreground">Entitlements API</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div className="p-4 bg-background rounded-lg border shadow-sm">
                      <p className="font-semibold">資料庫</p>
                      <p className="text-xs text-muted-foreground">用戶 / 權限 / 訂閱</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">check-entitlement</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">檢查用戶是否有權限存取指定產品</p>
                  <p className="text-xs mt-2 text-muted-foreground">認證：API Key + Email 或 JWT</p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">entitlements-me</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">取得當前登入用戶的所有權限</p>
                  <p className="text-xs mt-2 text-muted-foreground">認證：JWT Token</p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">entitlements-lookup</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">根據 email 查詢用戶權限</p>
                  <p className="text-xs mt-2 text-muted-foreground">認證：API Key 或 Service Role Key</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                連線資訊
              </CardTitle>
              <CardDescription>外部專案連接中央授權系統所需的資訊</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">API Base URL</p>
                    <code className="text-xs text-muted-foreground">{supabaseUrl}</code>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(supabaseUrl, 'base-url')}>
                    {copiedItems['base-url'] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">Anon Key (公開)</p>
                    <code className="text-xs text-muted-foreground break-all">{anonKey.substring(0, 50)}...</code>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(anonKey, 'anon-key')}>
                    {copiedItems['anon-key'] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-700 dark:text-amber-400">重要提醒</p>
                    <p className="text-muted-foreground mt-1">
                      API Key 請妥善保管，不要公開在前端程式碼中。建議在伺服器端使用，或透過環境變數設定。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Tabs defaultValue="check-entitlement" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="check-entitlement" className="text-xs sm:text-sm">check-entitlement</TabsTrigger>
              <TabsTrigger value="entitlements-me" className="text-xs sm:text-sm">entitlements-me</TabsTrigger>
              <TabsTrigger value="entitlements-lookup" className="text-xs sm:text-sm">entitlements-lookup</TabsTrigger>
            </TabsList>

            {/* check-entitlement */}
            <TabsContent value="check-entitlement" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        check-entitlement
                      </CardTitle>
                      <CardDescription>檢查用戶是否有權限存取指定產品（推薦使用）</CardDescription>
                    </div>
                    <Badge>GET</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Endpoint</h4>
                    <CodeBlock
                      id="check-endpoint"
                      code={`GET ${supabaseUrl}/functions/v1/check-entitlement`}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">認證方式</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg bg-green-500/5 border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default" className="bg-green-600">推薦</Badge>
                          <span className="font-medium text-sm">API Key + Email</span>
                        </div>
                        <code className="text-xs block bg-muted p-2 rounded mt-2">X-API-Key: your-api-key</code>
                        <p className="text-xs text-muted-foreground mt-2">適用於外部專案後端呼叫</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">選項</Badge>
                          <span className="font-medium text-sm">JWT Token</span>
                        </div>
                        <code className="text-xs block bg-muted p-2 rounded mt-2">Authorization: Bearer &lt;jwt&gt;</code>
                        <p className="text-xs text-muted-foreground mt-2">適用於用戶已登入中央系統</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">查詢參數</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium">參數</th>
                            <th className="text-left py-2 px-3 font-medium">類型</th>
                            <th className="text-left py-2 px-3 font-medium">必填</th>
                            <th className="text-left py-2 px-3 font-medium">說明</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-3"><code className="bg-muted px-1.5 py-0.5 rounded">product_id</code></td>
                            <td className="py-2 px-3">string</td>
                            <td className="py-2 px-3"><Badge variant="destructive" className="text-xs">必填</Badge></td>
                            <td className="py-2 px-3 text-muted-foreground">產品 ID</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3"><code className="bg-muted px-1.5 py-0.5 rounded">email</code></td>
                            <td className="py-2 px-3">string</td>
                            <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">選填*</Badge></td>
                            <td className="py-2 px-3 text-muted-foreground">用戶 email（使用 API Key 時需要）</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">回應格式</h4>
                    <Tabs defaultValue="success" className="w-full">
                      <TabsList className="w-full justify-start">
                        <TabsTrigger value="success">有權限</TabsTrigger>
                        <TabsTrigger value="no-access">無權限</TabsTrigger>
                        <TabsTrigger value="not-found">用戶不存在</TabsTrigger>
                      </TabsList>
                      <TabsContent value="success">
                        <CodeBlock
                          id="check-success"
                          code={`{
  "hasAccess": true,
  "found": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "product_id": "story_builder_hub",
  "entitlement": {
    "id": "uuid",
    "plan_id": "uuid",
    "status": "active",
    "starts_at": "2024-01-01T00:00:00Z",
    "ends_at": "2025-01-01T00:00:00Z"
  }
}`}
                        />
                      </TabsContent>
                      <TabsContent value="no-access">
                        <CodeBlock
                          id="check-no-access"
                          code={`{
  "hasAccess": false,
  "found": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "product_id": "story_builder_hub",
  "entitlement": null
}`}
                        />
                      </TabsContent>
                      <TabsContent value="not-found">
                        <CodeBlock
                          id="check-not-found"
                          code={`{
  "hasAccess": false,
  "found": false,
  "message": "User not found in central system"
}`}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">程式碼範例</h4>
                    <Tabs defaultValue="node" className="w-full">
                      <TabsList>
                        <TabsTrigger value="node">Node.js</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                      </TabsList>
                      <TabsContent value="node">
                        <CodeBlock
                          id="check-node"
                          code={`// Node.js / TypeScript
async function checkEntitlement(email: string, productId: string): Promise<boolean> {
  const response = await fetch(
    \`${supabaseUrl}/functions/v1/check-entitlement?product_id=\${productId}&email=\${encodeURIComponent(email)}\`,
    {
      headers: {
        'X-API-Key': process.env.ENTITLEMENTS_API_KEY!
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(\`API Error: \${response.status}\`);
  }
  
  const data = await response.json();
  return data.hasAccess;
}

// 使用範例
const hasAccess = await checkEntitlement('user@example.com', 'story_builder_hub');
if (hasAccess) {
  console.log('用戶有權限存取');
} else {
  console.log('用戶無權限');
}`}
                        />
                      </TabsContent>
                      <TabsContent value="python">
                        <CodeBlock
                          id="check-python"
                          code={`# Python
import requests
import os

def check_entitlement(email: str, product_id: str) -> bool:
    response = requests.get(
        f"${supabaseUrl}/functions/v1/check-entitlement",
        params={
            "product_id": product_id,
            "email": email
        },
        headers={
            "X-API-Key": os.environ["ENTITLEMENTS_API_KEY"]
        }
    )
    response.raise_for_status()
    data = response.json()
    return data["hasAccess"]

# 使用範例
has_access = check_entitlement("user@example.com", "story_builder_hub")
print("有權限" if has_access else "無權限")`}
                        />
                      </TabsContent>
                      <TabsContent value="curl">
                        <CodeBlock
                          id="check-curl"
                          code={`# cURL
curl -X GET "${supabaseUrl}/functions/v1/check-entitlement?product_id=story_builder_hub&email=user%40example.com" \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json"`}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* entitlements-me */}
            <TabsContent value="entitlements-me" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        entitlements-me
                      </CardTitle>
                      <CardDescription>取得當前登入用戶的所有權限</CardDescription>
                    </div>
                    <Badge>GET</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Endpoint</h4>
                    <CodeBlock
                      id="me-endpoint"
                      code={`GET ${supabaseUrl}/functions/v1/entitlements-me`}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">認證方式</h4>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">需要有效的 JWT Token（用戶必須已登入中央系統）</p>
                      <code className="text-xs block bg-muted p-2 rounded">Authorization: Bearer &lt;jwt-token&gt;</code>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">查詢參數</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium">參數</th>
                            <th className="text-left py-2 px-3 font-medium">類型</th>
                            <th className="text-left py-2 px-3 font-medium">必填</th>
                            <th className="text-left py-2 px-3 font-medium">說明</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2 px-3"><code className="bg-muted px-1.5 py-0.5 rounded">product_id</code></td>
                            <td className="py-2 px-3">string</td>
                            <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">選填</Badge></td>
                            <td className="py-2 px-3 text-muted-foreground">篩選特定產品的權限</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">回應格式</h4>
                    <CodeBlock
                      id="me-response"
                      code={`{
  "user_id": "uuid",
  "entitlements": [
    {
      "id": "uuid",
      "product_id": "report_platform",
      "plan_id": "uuid",
      "status": "active",
      "starts_at": "2024-01-01T00:00:00Z",
      "ends_at": "2025-01-01T00:00:00Z",
      "is_active": true
    },
    {
      "id": "uuid",
      "product_id": "story_builder_hub",
      "plan_id": null,
      "status": "active",
      "starts_at": "2024-06-01T00:00:00Z",
      "ends_at": null,
      "is_active": true
    }
  ]
}`}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">程式碼範例</h4>
                    <CodeBlock
                      id="me-example"
                      code={`// 使用 Supabase Client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  '${supabaseUrl}',
  '${anonKey}'
);

// 用戶需先登入
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  console.log('用戶未登入');
  return;
}

// 取得所有權限
const response = await fetch(
  \`${supabaseUrl}/functions/v1/entitlements-me\`,
  {
    headers: {
      'Authorization': \`Bearer \${session.access_token}\`,
      'apikey': '${anonKey}'
    }
  }
);

const { entitlements } = await response.json();

// 檢查特定產品權限
const hasReportAccess = entitlements.some(
  e => e.product_id === 'report_platform' && e.is_active
);`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* entitlements-lookup */}
            <TabsContent value="entitlements-lookup" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        entitlements-lookup
                      </CardTitle>
                      <CardDescription>根據 email 查詢用戶權限（伺服器端使用）</CardDescription>
                    </div>
                    <Badge>GET</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-destructive">僅限伺服器端使用</p>
                        <p className="text-muted-foreground mt-1">
                          此 API 需要 API Key 或 Service Role Key，請勿在前端程式碼中使用
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Endpoint</h4>
                    <CodeBlock
                      id="lookup-endpoint"
                      code={`GET ${supabaseUrl}/functions/v1/entitlements-lookup`}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">認證方式</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg bg-green-500/5 border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default" className="bg-green-600">推薦</Badge>
                          <span className="font-medium text-sm">API Key</span>
                        </div>
                        <code className="text-xs block bg-muted p-2 rounded mt-2">X-API-Key: your-api-key</code>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">選項</Badge>
                          <span className="font-medium text-sm">Service Role Key</span>
                        </div>
                        <code className="text-xs block bg-muted p-2 rounded mt-2">Authorization: Bearer &lt;service-role-key&gt;</code>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">查詢參數</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium">參數</th>
                            <th className="text-left py-2 px-3 font-medium">類型</th>
                            <th className="text-left py-2 px-3 font-medium">必填</th>
                            <th className="text-left py-2 px-3 font-medium">說明</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-3"><code className="bg-muted px-1.5 py-0.5 rounded">email</code></td>
                            <td className="py-2 px-3">string</td>
                            <td className="py-2 px-3"><Badge variant="destructive" className="text-xs">必填</Badge></td>
                            <td className="py-2 px-3 text-muted-foreground">用戶 email</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3"><code className="bg-muted px-1.5 py-0.5 rounded">product_id</code></td>
                            <td className="py-2 px-3">string</td>
                            <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">選填</Badge></td>
                            <td className="py-2 px-3 text-muted-foreground">篩選特定產品的權限</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">回應格式</h4>
                    <CodeBlock
                      id="lookup-response"
                      code={`{
  "found": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "profile": {
    "display_name": "用戶名稱",
    "full_name": "真實姓名",
    "nickname": "暱稱",
    "subscription_status": "active"
  },
  "entitlements": [
    {
      "id": "uuid",
      "product_id": "story_builder_hub",
      "plan_id": "uuid",
      "status": "active",
      "starts_at": "2024-01-01T00:00:00Z",
      "ends_at": "2025-01-01T00:00:00Z",
      "notes": "備註",
      "is_active": true
    }
  ],
  "has_active_entitlement": true
}`}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">程式碼範例</h4>
                    <CodeBlock
                      id="lookup-example"
                      code={`// 服務端對服務端查詢（Node.js）
async function lookupUserEntitlements(email: string, productId?: string) {
  const url = new URL('${supabaseUrl}/functions/v1/entitlements-lookup');
  url.searchParams.set('email', email);
  if (productId) {
    url.searchParams.set('product_id', productId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'X-API-Key': process.env.ENTITLEMENTS_API_KEY!
    }
  });

  if (!response.ok) {
    throw new Error(\`Lookup failed: \${response.status}\`);
  }

  return response.json();
}

// 使用範例
const result = await lookupUserEntitlements('user@example.com', 'story_builder_hub');

if (!result.found) {
  console.log('用戶尚未在中央系統註冊');
} else if (result.has_active_entitlement) {
  console.log('用戶有有效權限');
} else {
  console.log('用戶無有效權限');
}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* SDK 下載 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                SDK 與整合範例
              </CardTitle>
              <CardDescription>下載 SDK 或參考整合範例快速開始</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sdk">
                  <AccordionTrigger>TypeScript SDK</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      完整的 TypeScript SDK，包含類型定義、錯誤處理、React Hook 範例等。
                    </p>
                    <CodeBlock
                      id="sdk-install"
                      code={`// 1. 複製 SDK 檔案到你的專案
// 檔案位置：docs/sdk/entitlements-sdk.ts

// 2. 初始化 Client
import { EntitlementsClient, ProductIds } from './entitlements-sdk';

const client = new EntitlementsClient({
  baseUrl: '${supabaseUrl}',
  anonKey: '${anonKey}',
});

// 3. 使用 SDK
const hasAccess = await client.hasAccess(accessToken, ProductIds.REPORT_PLATFORM);`}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="react-hook">
                  <AccordionTrigger>React Hook 範例</AccordionTrigger>
                  <AccordionContent>
                    <CodeBlock
                      id="react-hook"
                      code={`// useProductAccess.ts
import { useState, useEffect } from 'react';
import { EntitlementsClient, ProductId } from './entitlements-sdk';
import { supabase } from './supabase-client';

const client = new EntitlementsClient({
  baseUrl: '${supabaseUrl}',
  anonKey: '${anonKey}',
});

export function useProductAccess(productId: ProductId | string) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setHasAccess(false);
          return;
        }
        
        const result = await client.hasAccess(session.access_token, productId);
        setHasAccess(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkAccess();
  }, [productId]);

  return { hasAccess, isLoading, error };
}

// 使用範例
function ProtectedFeature() {
  const { hasAccess, isLoading } = useProductAccess('report_platform');
  
  if (isLoading) return <Loading />;
  if (!hasAccess) return <AccessDenied />;
  return <FeatureContent />;
}`}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="nextjs-middleware">
                  <AccordionTrigger>Next.js Middleware 範例</AccordionTrigger>
                  <AccordionContent>
                    <CodeBlock
                      id="nextjs-middleware"
                      code={`// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    const response = await fetch(
      \`${supabaseUrl}/functions/v1/check-entitlement?product_id=report_platform\`,
      {
        headers: {
          'Authorization': \`Bearer \${token}\`
        }
      }
    );
    
    const data = await response.json();
    
    if (!data.hasAccess) {
      return NextResponse.redirect(new URL('/subscribe', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Entitlement check failed:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: '/protected/:path*',
};`}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Product IDs Reference */}
          <Card>
            <CardHeader>
              <CardTitle>產品 ID 參考</CardTitle>
              <CardDescription>可用的產品 ID 列表</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors">
                  <div>
                    <p className="font-medium">命理報告平台</p>
                    <code className="text-sm text-muted-foreground">report_platform</code>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard('report_platform', 'pid-1')}>
                    {copiedItems['pid-1'] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors">
                  <div>
                    <p className="font-medium">故事建構者</p>
                    <code className="text-sm text-muted-foreground">story_builder_hub</code>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard('story_builder_hub', 'pid-2')}>
                    {copiedItems['pid-2'] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors">
                  <div>
                    <p className="font-medium">Seek Monster</p>
                    <code className="text-sm text-muted-foreground">seek_monster</code>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard('seek_monster', 'pid-3')}>
                    {copiedItems['pid-3'] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Codes */}
          <Card>
            <CardHeader>
              <CardTitle>錯誤代碼</CardTitle>
              <CardDescription>API 可能回傳的錯誤狀態與處理建議</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <Badge variant="secondary" className="shrink-0">200</Badge>
                  <div>
                    <p className="text-sm font-medium">成功</p>
                    <p className="text-xs text-muted-foreground">請求成功，檢查 hasAccess 或 found 欄位判斷結果</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <Badge variant="destructive" className="shrink-0">400</Badge>
                  <div>
                    <p className="text-sm font-medium">請求錯誤</p>
                    <p className="text-xs text-muted-foreground">缺少必要參數（如 product_id 或 email）</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <Badge variant="destructive" className="shrink-0">401</Badge>
                  <div>
                    <p className="text-sm font-medium">認證失敗</p>
                    <p className="text-xs text-muted-foreground">無效的 API Key 或 JWT Token。請檢查認證資訊是否正確。</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <Badge variant="destructive" className="shrink-0">500</Badge>
                  <div>
                    <p className="text-sm font-medium">伺服器錯誤</p>
                    <p className="text-xs text-muted-foreground">內部錯誤，請稍後重試或聯繫管理員</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                最佳實踐
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">✓ 建議做法</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 在伺服器端儲存和使用 API Key</li>
                    <li>• 快取權限檢查結果（建議 5-15 分鐘）</li>
                    <li>• 實作錯誤重試機制（指數退避）</li>
                    <li>• 使用環境變數管理敏感資訊</li>
                    <li>• 記錄 API 呼叫日誌以便除錯</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-destructive">✗ 避免做法</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 在前端程式碼暴露 API Key</li>
                    <li>• 每次請求都呼叫 API（無快取）</li>
                    <li>• 忽略錯誤處理</li>
                    <li>• 硬編碼認證資訊</li>
                    <li>• 在日誌中記錄敏感資訊</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="border-muted">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  有問題？前往 <Link to="/admin/external-api-test" className="text-primary underline">API 測試頁面</Link> 進行除錯，
                  或聯繫系統管理員。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ApiDocsPage;
