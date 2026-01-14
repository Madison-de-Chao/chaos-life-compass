// supabase/functions/entitlements-lookup/index.ts
// 依 Email 查詢權限 Edge Function - 複製到新專案

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // 驗證 API Key
    const apiKey = req.headers.get('x-api-key');
    const authHeader = req.headers.get('Authorization');

    let isAuthorized = false;

    if (apiKey) {
      const { data: keyId } = await adminClient.rpc('verify_api_key', { key: apiKey });
      isAuthorized = !!keyId;
    } else if (authHeader === `Bearer ${supabaseServiceKey}`) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const productId = url.searchParams.get('product_id');

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 查詢用戶
    const { data: userData } = await adminClient.auth.admin.listUsers();
    const user = userData?.users?.find(u => u.email === email);

    if (!user) {
      return new Response(
        JSON.stringify({ 
          found: false, 
          message: 'User not found' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 查詢權限
    let query = adminClient
      .from('entitlements')
      .select(`
        *,
        product:products(*),
        plan:plans(*)
      `)
      .eq('user_id', user.id);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data: entitlements, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch entitlements' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 查詢 profile
    const { data: profile } = await adminClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 處理權限狀態
    const processedEntitlements = entitlements?.map(e => ({
      ...e,
      is_active: e.status === 'active' && (!e.ends_at || new Date(e.ends_at) > new Date())
    })) || [];

    return new Response(
      JSON.stringify({
        found: true,
        userId: user.id,
        email: user.email,
        profile: profile || null,
        entitlements: processedEntitlements
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
