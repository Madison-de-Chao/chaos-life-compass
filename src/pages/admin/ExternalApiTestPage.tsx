import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send, Copy, Check } from "lucide-react";
import { Header } from "@/components/Header";

const ExternalApiTestPage = () => {
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("");
  const [customHeaders, setCustomHeaders] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!endpoint) {
      toast.error("請輸入 API Endpoint");
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      let parsedBody = undefined;
      let parsedHeaders = undefined;

      if (requestBody.trim()) {
        try {
          parsedBody = JSON.parse(requestBody);
        } catch {
          toast.error("Request Body 格式錯誤，請輸入有效的 JSON");
          setIsLoading(false);
          return;
        }
      }

      if (customHeaders.trim()) {
        try {
          parsedHeaders = JSON.parse(customHeaders);
        } catch {
          toast.error("Custom Headers 格式錯誤，請輸入有效的 JSON");
          setIsLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke('external-api', {
        body: {
          endpoint,
          method,
          body: parsedBody,
          headers: parsedHeaders,
        }
      });

      if (error) {
        throw error;
      }

      setResponse(JSON.stringify(data, null, 2));
      toast.success("API 呼叫成功");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "未知錯誤";
      setResponse(JSON.stringify({ error: errorMessage }, null, 2));
      toast.error(`API 呼叫失敗: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = async () => {
    if (response) {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      toast.success("已複製到剪貼簿");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">External API 測試</h1>
            <p className="text-muted-foreground mt-2">
              使用 EXTERNAL_API_KEY 測試呼叫外部 API
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Request Form */}
            <Card>
              <CardHeader>
                <CardTitle>請求設定</CardTitle>
                <CardDescription>設定 API 請求參數</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">API Endpoint *</Label>
                    <Input
                      id="endpoint"
                      placeholder="https://api.example.com/data"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method</Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Request Body (JSON)</Label>
                    <Textarea
                      id="body"
                      placeholder='{"key": "value"}'
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headers">Custom Headers (JSON)</Label>
                    <Textarea
                      id="headers"
                      placeholder='{"X-Custom-Header": "value"}'
                      value={customHeaders}
                      onChange={(e) => setCustomHeaders(e.target.value)}
                      rows={3}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        發送中...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        發送請求
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Response */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>回應結果</CardTitle>
                  <CardDescription>API 回傳的資料</CardDescription>
                </div>
                {response && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyResponse}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] rounded-lg bg-muted p-4 overflow-auto">
                  {response ? (
                    <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                      {response}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      發送請求後，回應結果將顯示在這裡
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Example */}
          <Card>
            <CardHeader>
              <CardTitle>使用說明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                此 Edge Function 會自動在請求中加入 <code className="bg-muted px-1 rounded">Authorization: Bearer EXTERNAL_API_KEY</code> header。
              </p>
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm font-mono overflow-x-auto">{`// 在程式碼中使用
const { data } = await supabase.functions.invoke('external-api', {
  body: {
    endpoint: 'https://api.example.com/data',
    method: 'POST',
    body: { key: 'value' },
    headers: { 'X-Custom-Header': 'value' }
  }
});`}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ExternalApiTestPage;
