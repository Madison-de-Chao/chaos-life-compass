import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit configuration: 5 feedback submissions per minute per IP
const FEEDBACK_RATE_LIMIT = { maxRequests: 5, windowSeconds: 60 };

interface FeedbackRequest {
  documentId?: string;
  documentTitle: string;
  customerName?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    // Check rate limit
    const { data: rateLimitResult, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_identifier: clientIp,
        p_endpoint: 'submit-feedback',
        p_max_requests: FEEDBACK_RATE_LIMIT.maxRequests,
        p_window_seconds: FEEDBACK_RATE_LIMIT.windowSeconds
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (!rateLimitResult?.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ 
          error: "提交次數過多，請稍後再試",
          retryAfter: rateLimitResult?.reset_at 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult?.reset_at || 0)
          } 
        }
      );
    }

    const { documentId, documentTitle, customerName, message }: FeedbackRequest = await req.json();

    console.log("Received feedback submission:", { documentId, documentTitle, customerName, messageLength: message?.length });

    // Validate input
    if (!message || message.trim().length === 0) {
      console.error("Empty message received");
      return new Response(
        JSON.stringify({ error: "反饋內容不能為空" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!documentTitle || documentTitle.trim().length === 0) {
      console.error("Empty document title received");
      return new Response(
        JSON.stringify({ error: "文件標題不能為空" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert feedback into database (using supabase client created earlier)

    // Insert feedback into database
    const { data: feedbackData, error: dbError } = await supabase
      .from("feedbacks")
      .insert({
        document_id: documentId || null,
        document_title: documentTitle.trim(),
        customer_name: customerName?.trim() || null,
        message: message.trim(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "儲存反饋失敗" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Feedback saved to database:", feedbackData.id);

    // Send email notification using Resend API directly
    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "反饋通知 <onboarding@resend.dev>",
          to: ["momo741006@gmail.com"],
          subject: `[報告反饋] ${documentTitle}`,
          html: `
            <div style="font-family: 'Noto Serif TC', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #8b5a3c; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
                新的反饋通知
              </h1>
              
              <div style="background: #faf5ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #666;">
                  <strong>報告標題：</strong> ${documentTitle}
                </p>
                <p style="margin: 0 0 10px 0; color: #666;">
                  <strong>客戶姓名：</strong> ${customerName || "匿名"}
                </p>
                <p style="margin: 0; color: #666;">
                  <strong>提交時間：</strong> ${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}
                </p>
              </div>
              
              <div style="background: #fff; padding: 20px; border: 1px solid #d4a574; border-radius: 8px;">
                <h3 style="color: #8b5a3c; margin-top: 0;">反饋內容：</h3>
                <p style="color: #333; line-height: 1.8; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
                © ${new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所
              </p>
            </div>
          `,
        }),
      });

      const emailResult = await emailResponse.json();
      console.log("Email sent successfully:", emailResult);
    } catch (emailError) {
      // Log email error but don't fail the request - feedback is already saved
      console.error("Email sending error:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "反饋已成功提交",
        feedbackId: feedbackData.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in submit-feedback function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "提交反饋時發生錯誤" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
