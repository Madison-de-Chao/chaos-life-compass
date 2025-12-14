import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
