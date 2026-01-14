// supabase/functions/oauth-authorize/index.ts
// OAuth 授權流程 Edge Function - 複製到新專案

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function generateCode(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

function generateAccessToken(): string {
  return `at_${generateCode(48)}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Token 交換端點
    if (pathname.endsWith('/token') && req.method === 'POST') {
      const body = await req.json();
      const { grant_type, code, client_id, client_secret, redirect_uri } = body;

      if (grant_type !== 'authorization_code') {
        return new Response(
          JSON.stringify({ error: 'unsupported_grant_type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 驗證 client secret
      const { data: isValid } = await adminClient.rpc('verify_oauth_secret', {
        client_id_param: client_id,
        secret: client_secret
      });

      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'invalid_client' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 查詢授權碼
      const { data: authCode, error: codeError } = await adminClient
        .from('oauth_authorization_codes')
        .select('*')
        .eq('code', code)
        .eq('client_id', client_id)
        .single();

      if (codeError || !authCode) {
        return new Response(
          JSON.stringify({ error: 'invalid_grant' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 驗證授權碼
      if (authCode.used_at || new Date(authCode.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'invalid_grant' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 標記為已使用
      await adminClient
        .from('oauth_authorization_codes')
        .update({ used_at: new Date().toISOString() })
        .eq('id', authCode.id);

      // 生成 access token
      const accessToken = generateAccessToken();
      const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 小時

      await adminClient
        .from('oauth_access_tokens')
        .insert({
          token_hash: accessToken, // 實際應用中應使用 hash
          client_id: client_id,
          user_id: authCode.user_id,
          scope: authCode.scope,
          expires_at: expiresAt.toISOString()
        });

      return new Response(
        JSON.stringify({
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: 3600,
          scope: authCode.scope
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // UserInfo 端點
    if (pathname.endsWith('/userinfo') && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'invalid_token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const token = authHeader.replace('Bearer ', '');

      const { data: tokenData, error: tokenError } = await adminClient
        .from('oauth_access_tokens')
        .select('*')
        .eq('token_hash', token)
        .is('revoked_at', null)
        .single();

      if (tokenError || !tokenData || new Date(tokenData.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'invalid_token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 取得用戶資訊
      const { data: userData } = await adminClient.auth.admin.getUserById(tokenData.user_id);
      const { data: profile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('user_id', tokenData.user_id)
        .single();

      return new Response(
        JSON.stringify({
          sub: tokenData.user_id,
          email: userData.user?.email,
          name: profile?.display_name || profile?.full_name,
          picture: profile?.avatar_url
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 授權頁面 GET - 返回授權請求資訊
    if (req.method === 'GET') {
      const clientId = url.searchParams.get('client_id');
      const redirectUri = url.searchParams.get('redirect_uri');
      const responseType = url.searchParams.get('response_type');
      const scope = url.searchParams.get('scope');
      const state = url.searchParams.get('state');

      if (!clientId || !redirectUri || responseType !== 'code') {
        return new Response(
          JSON.stringify({ error: 'invalid_request' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 驗證 client
      const { data: client, error: clientError } = await adminClient
        .from('oauth_clients')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .single();

      if (clientError || !client) {
        return new Response(
          JSON.stringify({ error: 'invalid_client' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 驗證 redirect_uri
      if (!client.redirect_uris.includes(redirectUri)) {
        return new Response(
          JSON.stringify({ error: 'invalid_redirect_uri' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          client_name: client.name,
          client_description: client.description,
          scope: scope || 'profile',
          redirect_uri: redirectUri,
          state: state
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 授權決定 POST - 用戶同意或拒絕
    if (req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const token = authHeader.replace('Bearer ', '');
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      });

      const { data: { user }, error: authError } = await userClient.auth.getUser();
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body = await req.json();
      const { client_id, redirect_uri, scope, state, decision } = body;

      if (decision !== 'approve') {
        const redirectUrl = new URL(redirect_uri);
        redirectUrl.searchParams.set('error', 'access_denied');
        if (state) redirectUrl.searchParams.set('state', state);
        
        return new Response(
          JSON.stringify({ redirect_url: redirectUrl.toString() }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 生成授權碼
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分鐘

      await adminClient
        .from('oauth_authorization_codes')
        .insert({
          code,
          client_id,
          user_id: user.id,
          redirect_uri,
          scope,
          state,
          expires_at: expiresAt.toISOString()
        });

      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set('code', code);
      if (state) redirectUrl.searchParams.set('state', state);

      return new Response(
        JSON.stringify({ redirect_url: redirectUrl.toString() }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
