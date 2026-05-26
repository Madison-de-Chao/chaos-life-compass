import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SSRF protection: block private/loopback/metadata addresses
function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.internal') || h.endsWith('.local')) return true;
  // IPv6 loopback / any
  if (h === '::1' || h === '[::1]' || h === '::' || h === '[::]') return true;
  // Cloud metadata endpoints
  if (h === '169.254.169.254' || h === 'metadata.google.internal') return true;
  // IPv4 private ranges
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1]), parseInt(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true;
  }
  return false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authenticated admin user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: isAdmin, error: roleErr } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });
    if (roleErr || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden: admin role required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const externalApiKey = Deno.env.get('EXTERNAL_API_KEY');
    if (!externalApiKey) {
      return new Response(JSON.stringify({ error: 'External API key not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { endpoint, method = 'GET', body, headers: customHeaders } = await req.json();

    if (!endpoint || typeof endpoint !== 'string') {
      return new Response(JSON.stringify({ error: 'Endpoint is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate URL — must be https and not point to internal/private hosts (SSRF protection)
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(endpoint);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid endpoint URL' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (parsedUrl.protocol !== 'https:') {
      return new Response(JSON.stringify({ error: 'Only https endpoints are allowed' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (isBlockedHost(parsedUrl.hostname)) {
      return new Response(JSON.stringify({ error: 'Endpoint host is not allowed' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${externalApiKey}`,
        'Content-Type': 'application/json',
        ...customHeaders,
      },
      redirect: 'manual', // prevent redirect-based SSRF
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(parsedUrl.toString(), fetchOptions);
    const contentType = response.headers.get('content-type') || '';

    let responseData;
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'External API error', status: response.status, details: responseData }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in external-api function:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
