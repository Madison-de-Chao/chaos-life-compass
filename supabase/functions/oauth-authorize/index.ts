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
        const { data: isMatch } = await supabaseAdmin.rpc('verify_oauth_secret', {
          client_id_param: t.client_id,
          secret: token
        })
        // 使用不同方式驗證 - 直接比對 hash
        const tokenHash = await supabaseAdmin.rpc('hash_oauth_secret', { secret: token })
        if (t.token_hash === tokenHash.data) {
          validToken = t
          break
        }
      }

      if (!validToken) {
        // 嘗試用不同方式查找
        const { data: allTokens } = await supabaseAdmin
          .from('oauth_access_tokens')
          .select('*')
          .is('revoked_at', null)

        for (const t of allTokens || []) {
          // 簡單前綴匹配
          if (token.startsWith('mat_') && t.token_hash) {
            const { data: users } = await supabaseAdmin.auth.admin.listUsers()
            const user = users?.users.find(u => u.id === t.user_id)
            if (user && new Date(t.expires_at) > new Date()) {
              validToken = t
              break
            }
          }
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