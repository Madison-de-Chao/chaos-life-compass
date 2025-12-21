import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Key, User, FileText } from "lucide-react";

const ApiDocsPage = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yyzcgxnvtprojutnxisz.supabase.co";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Entitlements API 文件</h1>
            <p className="text-muted-foreground">
              用於外部專案驗證用戶權限的 API 參考文件
            </p>
            <div className="flex gap-2">
              <Link to="/admin/external-api-test">
                <Button variant="outline" size="sm">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  前往測試頁面
                </Button>
              </Link>
              <Link to="/admin/api-keys">
                <Button variant="outline" size="sm">
                  <Key className="mr-2 h-4 w-4" />
                  管理 API Keys
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                快速概覽
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">check-entitlement</h3>
                  <p className="text-sm text-muted-foreground">檢查用戶是否有權限存取指定產品</p>
                  <Badge variant="secondary" className="mt-2">API Key + Email</Badge>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">entitlements-me</h3>
                  <p className="text-sm text-muted-foreground">取得當前登入用戶的所有權限</p>
                  <Badge variant="secondary" className="mt-2">JWT</Badge>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">entitlements-lookup</h3>
                  <p className="text-sm text-muted-foreground">根據 email 查詢用戶權限</p>
                  <Badge variant="secondary" className="mt-2">Service Role Key</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Tabs defaultValue="check-entitlement" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="check-entitlement">check-entitlement</TabsTrigger>
              <TabsTrigger value="entitlements-me">entitlements-me</TabsTrigger>
              <TabsTrigger value="entitlements-lookup">entitlements-lookup</TabsTrigger>
            </TabsList>

            {/* check-entitlement */}
            <TabsContent value="check-entitlement" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        check-entitlement
                      </CardTitle>
                      <CardDescription>檢查用戶是否有權限存取指定產品</CardDescription>
                    </div>
                    <Badge>GET</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Endpoint</h4>
                    <code className="block bg-muted p-3 rounded-lg text-sm">
                      GET {supabaseUrl}/functions/v1/check-entitlement
                    </code>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="auth">
                      <AccordionTrigger>認證方式</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-2">
                          <h5 className="font-medium">方式一：API Key + Email（推薦）</h5>
                          <code className="block bg-muted p-3 rounded-lg text-sm">
                            X-API-Key: your-api-key
                          </code>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium">方式二：JWT Token</h5>
                          <code className="block bg-muted p-3 rounded-lg text-sm">
                            Authorization: Bearer &lt;jwt-token&gt;
                          </code>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="params">
                      <AccordionTrigger>查詢參數</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-4">
                            <code className="bg-muted px-2 py-1 rounded text-sm">product_id</code>
                            <div>
                              <Badge variant="destructive" className="mb-1">必填</Badge>
                              <p className="text-sm text-muted-foreground">
                                產品 ID，如 <code>story_builder_hub</code>、<code>report_platform</code>、<code>seek_monster</code>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <code className="bg-muted px-2 py-1 rounded text-sm">email</code>
                            <div>
                              <Badge variant="secondary" className="mb-1">選填</Badge>
                              <p className="text-sm text-muted-foreground">
                                用戶 email（使用 API Key 認證時需要）
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="response">
                      <AccordionTrigger>回應格式</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{`// 成功回應
{
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
}

// 無權限
{
  "hasAccess": false,
  "found": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "product_id": "story_builder_hub",
  "entitlement": null
}

// 用戶不存在
{
  "hasAccess": false,
  "found": false,
  "message": "User not found in central system"
}`}</pre>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="example">
                      <AccordionTrigger>程式碼範例</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{`// JavaScript / TypeScript
async function checkEntitlement(email: string, productId: string) {
  const response = await fetch(
    \`${supabaseUrl}/functions/v1/check-entitlement?product_id=\${productId}&email=\${encodeURIComponent(email)}\`,
    {
      headers: {
        'X-API-Key': process.env.API_KEY!
      }
    }
  );
  
  const data = await response.json();
  return data.hasAccess;
}

// 使用範例
const hasAccess = await checkEntitlement('user@example.com', 'story_builder_hub');
if (hasAccess) {
  // 允許存取
} else {
  // 拒絕存取
}`}</pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* entitlements-me */}
            <TabsContent value="entitlements-me" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
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
                    <code className="block bg-muted p-3 rounded-lg text-sm">
                      GET {supabaseUrl}/functions/v1/entitlements-me
                    </code>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="auth">
                      <AccordionTrigger>認證方式</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">需要有效的 JWT Token</p>
                          <code className="block bg-muted p-3 rounded-lg text-sm">
                            Authorization: Bearer &lt;jwt-token&gt;
                          </code>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="params">
                      <AccordionTrigger>查詢參數</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex items-start gap-4">
                          <code className="bg-muted px-2 py-1 rounded text-sm">product_id</code>
                          <div>
                            <Badge variant="secondary" className="mb-1">選填</Badge>
                            <p className="text-sm text-muted-foreground">
                              指定產品 ID 來篩選權限
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="response">
                      <AccordionTrigger>回應格式</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{`{
  "user_id": "uuid",
  "entitlements": [
    {
      "product_id": "story_builder_hub",
      "status": "active",
      "starts_at": "2024-01-01T00:00:00Z",
      "ends_at": "2025-01-01T00:00:00Z",
      "is_active": true
    }
  ]
}`}</pre>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="example">
                      <AccordionTrigger>程式碼範例</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{`// 使用 Supabase Client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 用戶需先登入
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  \`${supabaseUrl}/functions/v1/entitlements-me\`,
  {
    headers: {
      'Authorization': \`Bearer \${session.access_token}\`
    }
  }
);

const { entitlements } = await response.json();`}</pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* entitlements-lookup */}
            <TabsContent value="entitlements-lookup" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        entitlements-lookup
                      </CardTitle>
                      <CardDescription>根據 email 查詢用戶權限（需要 Service Role Key）</CardDescription>
                    </div>
                    <Badge>GET</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Endpoint</h4>
                    <code className="block bg-muted p-3 rounded-lg text-sm">
                      GET {supabaseUrl}/functions/v1/entitlements-lookup
                    </code>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="auth">
                      <AccordionTrigger>認證方式</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm font-medium text-destructive">⚠️ 僅限伺服器端使用</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              此 API 需要 Service Role Key，請勿在前端程式碼中使用
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium">方式一：API Key</h5>
                            <code className="block bg-muted p-3 rounded-lg text-sm">
                              X-API-Key: your-api-key
                            </code>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium">方式二：Service Role Key</h5>
                            <code className="block bg-muted p-3 rounded-lg text-sm">
                              Authorization: Bearer &lt;service-role-key&gt;
                            </code>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="params">
                      <AccordionTrigger>查詢參數</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-4">
                            <code className="bg-muted px-2 py-1 rounded text-sm">email</code>
                            <div>
                              <Badge variant="destructive" className="mb-1">必填</Badge>
                              <p className="text-sm text-muted-foreground">用戶 email</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <code className="bg-muted px-2 py-1 rounded text-sm">product_id</code>
                            <div>
                              <Badge variant="secondary" className="mb-1">選填</Badge>
                              <p className="text-sm text-muted-foreground">指定產品 ID 來篩選權限</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="response">
                      <AccordionTrigger>回應格式</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{`{
  "found": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "entitlements": [
    {
      "product_id": "story_builder_hub",
      "status": "active",
      "starts_at": "2024-01-01T00:00:00Z",
      "ends_at": "2025-01-01T00:00:00Z",
      "is_active": true
    }
  ]
}`}</pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Product IDs Reference */}
          <Card>
            <CardHeader>
              <CardTitle>產品 ID 參考</CardTitle>
              <CardDescription>可用的產品 ID 列表</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">命理報告平台</p>
                    <code className="text-sm text-muted-foreground">report_platform</code>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">故事建構者</p>
                    <code className="text-sm text-muted-foreground">story_builder_hub</code>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Seek Monster</p>
                    <code className="text-sm text-muted-foreground">seek_monster</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Codes */}
          <Card>
            <CardHeader>
              <CardTitle>錯誤代碼</CardTitle>
              <CardDescription>API 可能回傳的錯誤狀態</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <Badge variant="destructive">400</Badge>
                  <p className="text-sm">缺少必要參數（如 product_id 或 email）</p>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <Badge variant="destructive">401</Badge>
                  <p className="text-sm">認證失敗（無效的 API Key 或 JWT）</p>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <Badge variant="destructive">500</Badge>
                  <p className="text-sm">伺服器內部錯誤</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ApiDocsPage;
