import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MEMBER_CENTER_BASE_URL = "https://yrdtgwoxxjksesynrjss.supabase.co/functions/v1";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const email = url.searchParams.get("email");
    const productId = url.searchParams.get("product_id");

    // Get API Key from secrets
    const memberCenterApiKey = Deno.env.get("MEMBER_CENTER_API_KEY");
    if (!memberCenterApiKey) {
      console.error("MEMBER_CENTER_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Member center not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Optionally verify user is authenticated (for some actions)
    const authHeader = req.headers.get("Authorization");
    let userEmail: string | null = email;

    // If authenticated, get user email from session
    if (authHeader?.startsWith("Bearer ")) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && !userEmail) {
        userEmail = user.email;
      }
    }

    // Route to appropriate action
    switch (action) {
      case "check-entitlement": {
        if (!userEmail || !productId) {
          return new Response(
            JSON.stringify({ error: "email and product_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const response = await fetch(
          `${MEMBER_CENTER_BASE_URL}/check-entitlement?email=${encodeURIComponent(userEmail)}&product_id=${encodeURIComponent(productId)}`,
          {
            headers: {
              "x-api-key": memberCenterApiKey,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        return new Response(
          JSON.stringify(data),
          { 
            status: response.status, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      case "entitlements-lookup": {
        if (!userEmail) {
          return new Response(
            JSON.stringify({ error: "email required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const response = await fetch(
          `${MEMBER_CENTER_BASE_URL}/entitlements-lookup?email=${encodeURIComponent(userEmail)}`,
          {
            headers: {
              "x-api-key": memberCenterApiKey,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        return new Response(
          JSON.stringify(data),
          { 
            status: response.status, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action. Use 'check-entitlement' or 'entitlements-lookup'" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    console.error("Error in member-center-proxy:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
