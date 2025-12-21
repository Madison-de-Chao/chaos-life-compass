import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * check-entitlement Edge Function
 * 
 * 用於外部專案查詢用戶權限
 * 支援兩種認證方式：
 * 1. X-API-Key: 使用 API Key（推薦）
 * 2. Authorization: Bearer <email> + X-API-Key 組合
 * 
 * 查詢參數：
 * - product_id: 產品 ID（必填）
 * - email: 用戶 email（可選，也可從 JWT 解析）
 */

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
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    // Create admin client for database operations
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    })

    // Get authentication headers
    const apiKey = req.headers.get('X-API-Key')
    const authHeader = req.headers.get('Authorization')

    // Get query parameters
    const url = new URL(req.url)
    const productId = url.searchParams.get('product_id')
    const emailParam = url.searchParams.get('email')

    if (!productId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameter: product_id',
          hasAccess: false 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Check entitlement request for product:', productId)

    let userId: string | null = null
    let userEmail: string | null = emailParam

    // Method 1: API Key + email parameter
    if (apiKey) {
      const { data: keyId, error: keyError } = await supabaseAdmin
        .rpc('verify_api_key', { key: apiKey })
      
      if (keyError || !keyId) {
        console.log('Invalid API key')
        return new Response(
          JSON.stringify({ 
            error: 'Invalid API key',
            hasAccess: false 
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      console.log('Authenticated via API key:', keyId)
      
      // If email provided, look up user
      if (userEmail) {
        const { data: users } = await supabaseAdmin.auth.admin.listUsers()
        const user = users?.users.find(u => u.email?.toLowerCase() === userEmail?.toLowerCase())
        
        if (user) {
          userId = user.id
          userEmail = user.email || null
        }
      }
    }
    // Method 2: JWT token (for users logged into central system)
    else if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      
      // Try to validate as user JWT
      const supabaseUser = createClient(supabaseUrl, anonKey, {
        global: {
          headers: { Authorization: authHeader },
        },
      })
      
      const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
      
      if (userError || !user) {
        console.log('Invalid JWT token:', userError?.message)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid JWT',
            hasAccess: false,
            details: userError?.message
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      userId = user.id
      userEmail = user.email || null
      console.log('Authenticated via JWT, user:', userId)
    }
    else {
      return new Response(
        JSON.stringify({ 
          error: 'No authentication provided',
          hasAccess: false,
          message: 'Provide X-API-Key header with email parameter, or Authorization header with valid JWT'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If we don't have a user ID yet but have email, look up the user
    if (!userId && userEmail) {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const user = users?.users.find(u => u.email?.toLowerCase() === userEmail?.toLowerCase())
      
      if (user) {
        userId = user.id
      }
    }

    if (!userId) {
      console.log('User not found')
      return new Response(
        JSON.stringify({ 
          hasAccess: false,
          found: false,
          message: 'User not found in central system'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check entitlements for this user and product
    const { data: entitlements, error: entError } = await supabaseAdmin
      .from('entitlements')
      .select('id, product_id, plan_id, status, starts_at, ends_at')
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (entError) {
      console.error('Error fetching entitlements:', entError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to check entitlements',
          hasAccess: false
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if any entitlement is active
    const now = new Date()
    const activeEntitlement = entitlements?.find(e => {
      if (e.status !== 'active') return false
      if (e.ends_at && new Date(e.ends_at) < now) return false
      return true
    })

    const hasAccess = !!activeEntitlement

    console.log('Entitlement check result:', { userId, productId, hasAccess, entitlementsCount: entitlements?.length })

    return new Response(
      JSON.stringify({
        hasAccess,
        found: true,
        user_id: userId,
        email: userEmail,
        product_id: productId,
        entitlement: activeEntitlement ? {
          id: activeEntitlement.id,
          plan_id: activeEntitlement.plan_id,
          status: activeEntitlement.status,
          starts_at: activeEntitlement.starts_at,
          ends_at: activeEntitlement.ends_at,
        } : null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        hasAccess: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
