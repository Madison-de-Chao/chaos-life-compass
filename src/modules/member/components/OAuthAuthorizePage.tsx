import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useMember } from "../context/MemberContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { OAuthAuthorizationRequest } from "../types";

/**
 * OAuth 授權請求範圍描述
 */
const SCOPE_DESCRIPTIONS: Record<string, string> = {
  profile: "讀取您的基本資料（名稱、頭像）",
  email: "讀取您的電子郵件地址",
  entitlements: "查看您的產品權限",
};

/**
 * OAuth 授權頁面元件
 * 處理外部應用程式的 OAuth 授權流程
 */
const OAuthAuthorizePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useMember();
  const [authRequest, setAuthRequest] = useState<OAuthAuthorizationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const responseType = searchParams.get("response_type");
  const state = searchParams.get("state");
  const scope = searchParams.get("scope") || "profile email";

  useEffect(() => {
    if (authLoading) return;

    // 如果用戶未登入，重定向到登入頁面
    if (!user) {
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // 驗證參數
    if (!clientId || !redirectUri || responseType !== "code") {
      setError("無效的授權請求參數");
      setLoading(false);
      return;
    }

    // 獲取授權請求詳情
    fetchAuthorizationRequest();
  }, [user, authLoading, clientId, redirectUri, responseType]);

  const fetchAuthorizationRequest = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("oauth-authorize", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: null,
      });

      // 由於 invoke 不支援 GET 帶 query params，我們直接從資料庫驗證
      const { data: client, error: clientError } = await supabase
        .from("oauth_clients")
        .select("*")
        .eq("client_id", clientId)
        .eq("is_active", true)
        .single();

      if (clientError || !client) {
        setError("無效的應用程式");
        setLoading(false);
        return;
      }

      // 驗證 redirect_uri
      if (!client.redirect_uris.includes(redirectUri)) {
        setError("無效的重定向網址");
        setLoading(false);
        return;
      }

      setAuthRequest({
        client_id: client.client_id,
        client_name: client.name,
        client_description: client.description,
        redirect_uri: redirectUri!,
        scope: scope,
        state: state || undefined,
        allowed_products: client.allowed_products || [],
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching authorization request:", err);
      setError("無法載入授權請求");
      setLoading(false);
    }
  };

  const handleAuthorize = async (action: "approve" | "deny") => {
    if (!authRequest) return;
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("oauth-authorize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: {
          client_id: authRequest.client_id,
          redirect_uri: authRequest.redirect_uri,
          state: authRequest.state,
          scope: authRequest.scope,
          action,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { redirect_url } = response.data;

      if (redirect_url) {
        // 重定向到外部應用
        window.location.href = redirect_url;
      } else {
        throw new Error("未收到重定向網址");
      }
    } catch (err) {
      console.error("Authorization error:", err);
      toast({
        title: "授權失敗",
        description: err instanceof Error ? err.message : "發生未知錯誤",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          載入中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700/50">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-slate-100">授權請求錯誤</CardTitle>
            <CardDescription className="text-slate-400">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首頁
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scopes = scope.split(" ").filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30">
            <Shield className="w-8 h-8 text-amber-400" />
          </div>
          <CardTitle className="text-xl text-slate-100">授權請求</CardTitle>
          <CardDescription className="text-slate-400">
            <span className="font-semibold text-slate-200">{authRequest?.client_name}</span>
            {" "}請求存取您的帳號
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-slate-500">統一會員平台</p>
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>

          <Separator className="bg-slate-700/50" />

          {/* Requested Permissions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">此應用程式將可以：</h3>
            <ul className="space-y-2">
              {scopes.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-400">
                    {SCOPE_DESCRIPTIONS[s] || s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allowed Products */}
          {authRequest?.allowed_products && authRequest.allowed_products.length > 0 && (
            <>
              <Separator className="bg-slate-700/50" />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">可存取的產品：</h3>
                <div className="flex flex-wrap gap-2">
                  {authRequest.allowed_products.map((product) => (
                    <Badge key={product} variant="secondary" className="bg-slate-700 text-slate-300">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {authRequest?.client_description && (
            <>
              <Separator className="bg-slate-700/50" />
              <p className="text-xs text-slate-500">
                {authRequest.client_description}
              </p>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-slate-600 hover:bg-slate-700"
              onClick={() => handleAuthorize("deny")}
              disabled={submitting}
            >
              拒絕
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              onClick={() => handleAuthorize("approve")}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  處理中...
                </>
              ) : (
                "允許授權"
              )}
            </Button>
          </div>

          {/* Redirect notice */}
          <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
            <ExternalLink className="w-3 h-3" />
            授權後將返回 {new URL(authRequest?.redirect_uri || "https://example.com").hostname}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthAuthorizePage;
