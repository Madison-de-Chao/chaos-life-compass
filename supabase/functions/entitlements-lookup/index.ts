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
    // Verify service role key for server-to-server calls
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.log('Missing authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    // Only allow service role key (server-to-server)
    if (token !== serviceRoleKey) {
      console.log('Invalid service role key')
      return new Response(
        JSON.stringify({ error: 'Unauthorized - service role key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabase = createClient(supabaseUrl, serviceRoleKey!, {
      auth: { persistSession: false }
    })

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
