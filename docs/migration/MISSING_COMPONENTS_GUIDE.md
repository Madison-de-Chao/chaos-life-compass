# 新專案缺失項目補齊指南

> 根據架構比對分析報告，本指南提供所有缺失組件的完整程式碼

---

## 📋 缺失項目總覽

### 資料庫
| 項目 | 狀態 |
|------|------|
| admin_logs | ❌ 缺少 |

### Edge Functions
| 端點 | 狀態 |
|------|------|
| oauth-authorize | ❌ 缺少 |
| entitlements-me | ❌ 缺少 |
| entitlements-lookup | ❌ 缺少 |

> **注意**：`oauth-token` 和 `oauth-userinfo` 已整合在 `oauth-authorize` 函數內作為子路徑

---

## 1. 資料庫：admin_logs 表格

### 1.1 建立表格 SQL

```sql
-- ============================================================
-- admin_logs 表格 - 管理操作日誌
-- ============================================================

CREATE TABLE public.admin_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action_type TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 建立索引提升查詢效能
CREATE INDEX idx_admin_logs_user_id ON public.admin_logs(user_id);
CREATE INDEX idx_admin_logs_action_type ON public.admin_logs(action_type);
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- 啟用 RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS 政策：只有管理員可以查看日誌
CREATE POLICY "Admins can view all logs"
    ON public.admin_logs FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS 政策：管理員和小幫手可以新增自己的操作日誌
CREATE POLICY "Admin and helpers can insert logs"
    ON public.admin_logs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_helper(auth.uid()) AND auth.uid() = user_id);

-- 註解
COMMENT ON TABLE public.admin_logs IS '管理操作日誌，追蹤所有管理員和小幫手的操作';
COMMENT ON COLUMN public.admin_logs.action_type IS '操作類型，例如：create_entitlement, update_user, delete_product';
COMMENT ON COLUMN public.admin_logs.target_type IS '目標資料類型，例如：entitlement, user, product';
COMMENT ON COLUMN public.admin_logs.target_id IS '目標資料 ID';
COMMENT ON COLUMN public.admin_logs.details IS '操作詳細資訊 JSON';
```

### 1.2 常見 action_type 類型

| action_type | 說明 |
|-------------|------|
| `create_entitlement` | 新增權限 |
| `update_entitlement` | 更新權限 |
| `revoke_entitlement` | 撤銷權限 |
| `create_user` | 新增用戶 |
| `update_user` | 更新用戶資料 |
| `assign_role` | 指派角色 |
| `remove_role` | 移除角色 |
| `create_oauth_client` | 新增 OAuth 客戶端 |
| `revoke_oauth_token` | 撤銷 OAuth Token |
| `create_api_key` | 新增 API 金鑰 |
| `revoke_api_key` | 撤銷 API 金鑰 |

---

## 2. Edge Function: oauth-authorize

### 2.1 supabase/config.toml 新增設定

```toml
[functions.oauth-authorize]
verify_jwt = false
```

### 2.2 supabase/functions/oauth-authorize/index.ts

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * OAuth Authorization Edge Function
 * 
 * 實作 OAuth 2.0 Authorization Code Flow
 * 
 * 端點：
 * 1. GET /oauth-authorize?response_type=code&client_id=xxx&redirect_uri=xxx&state=xxx&scope=xxx
 *    - 返回授權頁面資訊（需用戶已登入）
 * 
 * 2. POST /oauth-authorize
 *    - 用戶確認授權後，生成授權碼並回調
 *    - Body: { client_id, redirect_uri, state, scope, action: 'approve' | 'deny' }
 * 
 * 3. POST /oauth-authorize/token
 *    - 用授權碼交換 Access Token
 *    - Body: { grant_type: 'authorization_code', code, client_id, client_secret, redirect_uri }
 * 
 * 4. GET /oauth-authorize/userinfo
 *    - 用 Access Token 獲取用戶資訊
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// 生成隨機碼
function generateCode(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }
  return result
}

// 生成 Access Token
function generateAccessToken(): string {
  return `mat_${generateCode(40)}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    })

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const subPath = pathParts[pathParts.length - 1]

    // ===== Token Exchange Endpoint =====
    if (subPath === 'token' && req.method === 'POST') {
      const body = await req.json()
      const { grant_type, code, client_id, client_secret, redirect_uri } = body

      if (grant_type !== 'authorization_code') {
        return new Response(
          JSON.stringify({ error: 'unsupported_grant_type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!code || !client_id || !client_secret || !redirect_uri) {
        return new Response(
          JSON.stringify({ error: 'invalid_request', error_description: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 驗證 client_secret
      const { data: isValid } = await supabaseAdmin.rpc('verify_oauth_secret', {
        client_id_param: client_id,
        secret: client_secret
      })

      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'invalid_client' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 查詢授權碼
      const { data: authCode, error: codeError } = await supabaseAdmin
        .from('oauth_authorization_codes')
        .select('*')
        .eq('code', code)
        .eq('client_id', client_id)
        .single()

      if (codeError || !authCode) {
        return new Response(
          JSON.stringify({ error: 'invalid_grant', error_description: 'Authorization code not found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 檢查是否過期或已使用
      if (authCode.used_at || new Date(authCode.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'invalid_grant', error_description: 'Authorization code expired or already used' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 檢查 redirect_uri 匹配
      if (authCode.redirect_uri !== redirect_uri) {
        return new Response(
          JSON.stringify({ error: 'invalid_grant', error_description: 'redirect_uri mismatch' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 標記授權碼為已使用
      await supabaseAdmin
        .from('oauth_authorization_codes')
        .update({ used_at: new Date().toISOString() })
        .eq('id', authCode.id)

      // 生成 Access Token
      const accessToken = generateAccessToken()
      const tokenHash = await supabaseAdmin.rpc('hash_oauth_secret', { secret: accessToken })
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 小時

      const { error: tokenError } = await supabaseAdmin
        .from('oauth_access_tokens')
        .insert({
          token_hash: tokenHash.data,
          client_id: client_id,
          user_id: authCode.user_id,
          scope: authCode.scope,
          expires_at: expiresAt.toISOString()
        })

      if (tokenError) {
        console.error('Error creating token:', tokenError)
        return new Response(
          JSON.stringify({ error: 'server_error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Token issued for user:', authCode.user_id)

      return new Response(
        JSON.stringify({
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: 86400, // 24 小時
          scope: authCode.scope || 'profile email'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===== User Info Endpoint =====
    if (subPath === 'userinfo' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'invalid_token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const token = authHeader.replace('Bearer ', '')

      // 查找並驗證 token
      const { data: tokens } = await supabaseAdmin
        .from('oauth_access_tokens')
        .select('*')
        .is('revoked_at', null)
        .gt('expires_at', new Date().toISOString())

      let validToken = null
      for (const t of tokens || []) {
        const tokenHash = await supabaseAdmin.rpc('hash_oauth_secret', { secret: token })
        if (t.token_hash === tokenHash.data) {
          validToken = t
          break
        }
      }

      if (!validToken) {
        return new Response(
          JSON.stringify({ error: 'invalid_token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 獲取用戶資訊
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(validToken.user_id)
      if (!userData?.user) {
        return new Response(
          JSON.stringify({ error: 'user_not_found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 獲取 profile
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', validToken.user_id)
        .single()

      return new Response(
        JSON.stringify({
          sub: userData.user.id,
          email: userData.user.email,
          email_verified: userData.user.email_confirmed_at !== null,
          name: profile?.display_name || profile?.full_name || userData.user.email,
          nickname: profile?.nickname,
          picture: profile?.avatar_url,
          updated_at: profile?.updated_at || userData.user.updated_at
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===== Authorization Request (GET) =====
    if (req.method === 'GET') {
      const clientId = url.searchParams.get('client_id')
      const redirectUri = url.searchParams.get('redirect_uri')
      const responseType = url.searchParams.get('response_type')
      const state = url.searchParams.get('state')
      const scope = url.searchParams.get('scope') || 'profile email'

      if (!clientId || !redirectUri || responseType !== 'code') {
        return new Response(
          JSON.stringify({ 
            error: 'invalid_request',
            error_description: 'Missing or invalid parameters. Required: client_id, redirect_uri, response_type=code'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 驗證 client
      const { data: client, error: clientError } = await supabaseAdmin
        .from('oauth_clients')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .single()

      if (clientError || !client) {
        return new Response(
          JSON.stringify({ error: 'invalid_client', error_description: 'Client not found or inactive' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 驗證 redirect_uri
      if (!client.redirect_uris.includes(redirectUri)) {
        return new Response(
          JSON.stringify({ error: 'invalid_redirect_uri', error_description: 'redirect_uri not registered' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 檢查用戶是否已登入
      const authHeader = req.headers.get('Authorization')
      let userId: string | null = null
      let userEmail: string | null = null

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const supabaseUser = createClient(supabaseUrl, anonKey, {
          global: { headers: { Authorization: authHeader } },
        })
        const { data: { user } } = await supabaseUser.auth.getUser()
        if (user) {
          userId = user.id
          userEmail = user.email || null
        }
      }

      // 返回授權請求資訊
      return new Response(
        JSON.stringify({
          authorization_request: {
            client_id: clientId,
            client_name: client.name,
            client_description: client.description,
            redirect_uri: redirectUri,
            scope: scope,
            state: state,
            allowed_products: client.allowed_products
          },
          user: userId ? {
            id: userId,
            email: userEmail,
            logged_in: true
          } : {
            logged_in: false,
            login_url: `/auth/login?redirect=${encodeURIComponent(`/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state || ''}&scope=${scope}`)}`
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===== Authorization Grant (POST) =====
    if (req.method === 'POST' && subPath === 'oauth-authorize') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'unauthorized', error_description: 'User must be logged in' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const supabaseUser = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      })
      const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: 'unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const body = await req.json()
      const { client_id, redirect_uri, state, scope, action } = body

      if (!client_id || !redirect_uri) {
        return new Response(
          JSON.stringify({ error: 'invalid_request' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 用戶拒絕授權
      if (action === 'deny') {
        const denyUrl = new URL(redirect_uri)
        denyUrl.searchParams.set('error', 'access_denied')
        denyUrl.searchParams.set('error_description', 'User denied authorization')
        if (state) denyUrl.searchParams.set('state', state)
        
        return new Response(
          JSON.stringify({ redirect_url: denyUrl.toString() }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 驗證 client
      const { data: client } = await supabaseAdmin
        .from('oauth_clients')
        .select('*')
        .eq('client_id', client_id)
        .eq('is_active', true)
        .single()

      if (!client || !client.redirect_uris.includes(redirect_uri)) {
        return new Response(
          JSON.stringify({ error: 'invalid_client' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 生成授權碼
      const code = generateCode(32)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 分鐘

      const { error: insertError } = await supabaseAdmin
        .from('oauth_authorization_codes')
        .insert({
          code,
          client_id,
          user_id: user.id,
          redirect_uri,
          scope: scope || 'profile email',
          state,
          expires_at: expiresAt.toISOString()
        })

      if (insertError) {
        console.error('Error creating auth code:', insertError)
        return new Response(
          JSON.stringify({ error: 'server_error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Authorization code issued for user:', user.id, 'client:', client_id)

      // 構建回調 URL
      const callbackUrl = new URL(redirect_uri)
      callbackUrl.searchParams.set('code', code)
      if (state) callbackUrl.searchParams.set('state', state)

      return new Response(
        JSON.stringify({ redirect_url: callbackUrl.toString() }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    console.error('OAuth error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'server_error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## 3. Edge Function: entitlements-me

### 3.1 supabase/config.toml 新增設定

```toml
[functions.entitlements-me]
verify_jwt = true
```

### 3.2 supabase/functions/entitlements-me/index.ts

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.log('Missing authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with the user's auth token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('User authentication failed:', userError?.message)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Fetching entitlements for user:', user.id)

    // Optional: Filter by product_id query param
    const url = new URL(req.url)
    const productId = url.searchParams.get('product_id')

    // Fetch user's entitlements
    let query = supabase
      .from('entitlements')
      .select(`
        id,
        product_id,
        plan_id,
        status,
        starts_at,
        ends_at
      `)
      .eq('user_id', user.id)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data: entitlements, error: entitlementsError } = await query

    if (entitlementsError) {
      console.error('Error fetching entitlements:', entitlementsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch entitlements' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Process entitlements to check for active status
    const processedEntitlements = entitlements.map(e => {
      const isExpired = e.ends_at && new Date(e.ends_at) < new Date()
      return {
        ...e,
        is_active: e.status === 'active' && !isExpired,
      }
    })

    console.log('Found', processedEntitlements.length, 'entitlements')

    return new Response(
      JSON.stringify({
        user_id: user.id,
        entitlements: processedEntitlements,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

---

## 4. Edge Function: entitlements-lookup

### 4.1 supabase/config.toml 新增設定

```toml
[functions.entitlements-lookup]
verify_jwt = false
```

### 4.2 supabase/functions/entitlements-lookup/index.ts

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create admin client
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    })

    // Check for API key first (preferred for external apps)
    const apiKey = req.headers.get('X-API-Key')
    const authHeader = req.headers.get('Authorization')
    
    let isAuthorized = false
    let apiKeyId: string | null = null

    if (apiKey) {
      // Verify API key using database function
      const { data: keyId, error: keyError } = await supabase
        .rpc('verify_api_key', { key: apiKey })
      
      if (keyError) {
        console.error('Error verifying API key:', keyError)
      }
      
      if (keyId) {
        isAuthorized = true
        apiKeyId = keyId
        console.log('Authenticated via API key:', apiKeyId)
      }
    }
    
    // Fallback to service role key (for backward compatibility)
    if (!isAuthorized && authHeader) {
      const token = authHeader.replace('Bearer ', '')
      if (token === serviceRoleKey) {
        isAuthorized = true
        console.log('Authenticated via service role key')
      }
    }

    if (!isAuthorized) {
      console.log('Authentication failed - no valid API key or service role key')
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Provide a valid X-API-Key header or service role key'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get query parameters
    const url = new URL(req.url)
    const email = url.searchParams.get('email')
    const productId = url.searchParams.get('product_id')

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'email parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Looking up entitlements for email:', email)

    // Find user by email in auth.users
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error fetching users:', userError)
      return new Response(
        JSON.stringify({ error: 'Failed to lookup user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      console.log('User not found for email:', email)
      return new Response(
        JSON.stringify({ 
          found: false,
          email,
          entitlements: [] 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch user's entitlements
    let query = supabase
      .from('entitlements')
      .select(`
        id,
        product_id,
        plan_id,
        status,
        starts_at,
        ends_at,
        notes
      `)
      .eq('user_id', user.id)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data: entitlements, error: entitlementsError } = await query

    if (entitlementsError) {
      console.error('Error fetching entitlements:', entitlementsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch entitlements' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, full_name, nickname, subscription_status')
      .eq('user_id', user.id)
      .single()

    // Process entitlements
    const processedEntitlements = entitlements.map(e => {
      const isExpired = e.ends_at && new Date(e.ends_at) < new Date()
      return {
        ...e,
        is_active: e.status === 'active' && !isExpired,
      }
    })

    console.log('Found', processedEntitlements.length, 'entitlements for user:', user.id)

    return new Response(
      JSON.stringify({
        found: true,
        user_id: user.id,
        email: user.email,
        profile: profile || null,
        entitlements: processedEntitlements,
        has_active_entitlement: processedEntitlements.some(e => e.is_active),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## 5. 完整 config.toml 範例

```toml
project_id = "your-project-id"

[functions.check-entitlement]
verify_jwt = false

[functions.oauth-authorize]
verify_jwt = false

[functions.entitlements-me]
verify_jwt = true

[functions.entitlements-lookup]
verify_jwt = false
```

---

## 6. 快速部署檢查清單

### 資料庫
- [ ] 執行 admin_logs 建立 SQL
- [ ] 確認 RLS 政策已啟用
- [ ] 確認 has_role 和 is_admin_or_helper 函數存在

### Edge Functions
- [ ] 建立 `supabase/functions/oauth-authorize/index.ts`
- [ ] 建立 `supabase/functions/entitlements-me/index.ts`
- [ ] 建立 `supabase/functions/entitlements-lookup/index.ts`
- [ ] 更新 `supabase/config.toml` 加入所有函數設定

### 測試端點
```bash
# entitlements-me (需 JWT)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://YOUR_PROJECT.supabase.co/functions/v1/entitlements-me

# entitlements-lookup (需 API Key)
curl -H "X-API-Key: YOUR_API_KEY" \
  "https://YOUR_PROJECT.supabase.co/functions/v1/entitlements-lookup?email=test@example.com"

# oauth-authorize (測試 client 驗證)
curl "https://YOUR_PROJECT.supabase.co/functions/v1/oauth-authorize?client_id=YOUR_CLIENT&redirect_uri=https://example.com/callback&response_type=code"
```

---

## 7. 相關文件

- [會員系統完整規格書](./docs/MEMBER_SYSTEM_SPECIFICATION.md)
- [完整遷移包指南](./docs/migration/COMPLETE_MIGRATION_PACKAGE.md)
- [資料庫 Schema](./docs/migration/schema.sql)
