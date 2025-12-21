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
