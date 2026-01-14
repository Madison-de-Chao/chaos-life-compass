// supabase/functions/check-entitlement/index.ts
// 權限檢查 Edge Function - 複製到新專案的 supabase/functions/check-entitlement/ 目錄

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get('product_id');
    const emailParam = url.searchParams.get('email');
    
    if (!productId) {
      return new Response(
        JSON.stringify({ error: 'product_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // 認證方式 1: API Key
    const apiKey = req.headers.get('x-api-key');
    if (apiKey) {
      const { data: keyId } = await adminClient.rpc('verify_api_key', { key: apiKey });
      
      if (!keyId) {
        return new Response(
          JSON.stringify({ error: 'Invalid API key' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!emailParam) {
        return new Response(
          JSON.stringify({ error: 'email is required when using API key' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 查詢用戶
      const { data: userData } = await adminClient.auth.admin.listUsers();
      const user = userData?.users?.find(u => u.email === emailParam);

      if (!user) {
        return new Response(
          JSON.stringify({ 
            hasAccess: false, 
            found: false, 
            message: 'User not found' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 檢查權限
      const { data: entitlements } = await adminClient
        .from('entitlements')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('status', 'active');

      const activeEntitlement = entitlements?.find(e => 
        !e.ends_at || new Date(e.ends_at) > new Date()
      );

      return new Response(
        JSON.stringify({
          hasAccess: !!activeEntitlement,
          found: true,
          userId: user.id,
          email: user.email,
          productId,
          entitlement: activeEntitlement || null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 認證方式 2: JWT Token
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      });

      const { data: { user }, error } = await userClient.auth.getUser();
      
      if (error || !user) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: entitlements } = await adminClient
        .from('entitlements')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('status', 'active');

      const activeEntitlement = entitlements?.find(e => 
        !e.ends_at || new Date(e.ends_at) > new Date()
      );

      return new Response(
        JSON.stringify({
          hasAccess: !!activeEntitlement,
          found: true,
          userId: user.id,
          email: user.email,
          productId,
          entitlement: activeEntitlement || null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
