import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit configuration: 5 password attempts per minute per IP
// This is intentionally strict to prevent brute force attacks
const PASSWORD_RATE_LIMIT = { maxRequests: 5, windowSeconds: 60 };

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    // Check if IP is blacklisted
    const { data: isBlacklisted, error: blacklistError } = await supabase
      .rpc('is_ip_blacklisted', { p_ip_address: clientIp });

    if (blacklistError) {
      console.error('IP blacklist check error:', blacklistError);
    } else if (isBlacklisted) {
      console.warn(`Blocked request from blacklisted IP: ${clientIp}`);
      
      // Log the blocked attempt
      await supabase.from('admin_logs').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        action_type: 'ip_blocked',
        target_type: 'ip_address',
        target_id: clientIp,
        details: {
          endpoint: 'verify-password',
          reason: 'IP is blacklisted'
        },
        ip_address: clientIp
      });

      return new Response(
        JSON.stringify({ 
          error: '您的 IP 已被封鎖，請聯繫管理員',
          isBlocked: true
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { shareLink, password } = await req.json();

    if (!shareLink || !password) {
      return new Response(
        JSON.stringify({ error: 'Share link and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use combination of IP and shareLink to prevent targeted attacks on specific documents
    const rateLimitIdentifier = `${clientIp}:${shareLink}`;

    // Check rate limit
    const { data: rateLimitResult, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_identifier: rateLimitIdentifier,
        p_endpoint: 'verify-password',
        p_max_requests: PASSWORD_RATE_LIMIT.maxRequests,
        p_window_seconds: PASSWORD_RATE_LIMIT.windowSeconds
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (!rateLimitResult?.allowed) {
      console.warn(`Rate limit exceeded for password verification: ${clientIp} on document ${shareLink}`);
      
      // Log the potential brute force attempt
      await supabase.from('admin_logs').insert({
        user_id: '00000000-0000-0000-0000-000000000000', // System user placeholder
        action_type: 'rate_limit_exceeded',
        target_type: 'document',
        target_id: shareLink,
        details: {
          endpoint: 'verify-password',
          ip_address: clientIp,
          remaining: 0,
          reset_at: rateLimitResult?.reset_at
        },
        ip_address: clientIp
      }).then(({ error }) => {
        if (error) console.error('Failed to log rate limit event:', error);
      });

      return new Response(
        JSON.stringify({ 
          error: '密碼嘗試次數過多，請稍後再試',
          retryAfter: rateLimitResult?.reset_at,
          isRateLimited: true
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult?.reset_at || 0)
          } 
        }
      );
    }

    // Verify password using the secure database function
    const { data: isValid, error: verifyError } = await supabase.rpc('verify_document_password', {
      doc_share_link: shareLink,
      pwd: password
    });

    if (verifyError) {
      console.error('Password verification error:', verifyError);
      return new Response(
        JSON.stringify({ error: '驗證失敗，請重試' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add rate limit headers to response
    const remainingRequests = rateLimitResult?.remaining ?? PASSWORD_RATE_LIMIT.maxRequests - 1;
    
    return new Response(
      JSON.stringify({ 
        valid: isValid === true,
        remaining: remainingRequests
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(remainingRequests)
        } 
      }
    );

  } catch (error: unknown) {
    console.error('Error in verify-password function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
