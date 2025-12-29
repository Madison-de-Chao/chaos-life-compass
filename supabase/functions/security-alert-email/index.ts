import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "momo741006@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SecurityAlertRequest {
  alertType: 'ip_auto_blocked' | 'rate_limit_exceeded' | 'brute_force_attempt';
  ipAddress: string;
  details: {
    violationCount?: number;
    threshold?: number;
    windowHours?: number;
    expiresAt?: string;
    endpoint?: string;
  };
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { alertType, ipAddress, details }: SecurityAlertRequest = await req.json();
    
    console.log(`Processing security alert: ${alertType} for IP ${ipAddress}`);

    let subject = '';
    let htmlContent = '';
    const timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    switch (alertType) {
      case 'ip_auto_blocked':
        subject = `⚠️ 安全警報：IP 已被自動封鎖 - ${ipAddress}`;
        htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🚨 IP 自動封鎖警報</h1>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 16px 0; color: #991b1b; font-weight: 600;">
                系統偵測到可疑活動，已自動封鎖以下 IP 地址：
              </p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; color: #7f1d1d; font-weight: 500;">IP 地址</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; color: #dc2626; font-family: monospace; font-size: 16px;">${ipAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; color: #7f1d1d; font-weight: 500;">違規次數</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; color: #374151;">${details.violationCount} 次</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; color: #7f1d1d; font-weight: 500;">偵測時間窗口</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; color: #374151;">${details.windowHours} 小時內</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; color: #7f1d1d; font-weight: 500;">封鎖到期時間</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; color: #374151;">${details.expiresAt ? new Date(details.expiresAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) : '24 小時後'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #7f1d1d; font-weight: 500;">發生時間</td>
                  <td style="padding: 8px 0; color: #374151;">${timestamp}</td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px;">
                此 IP 已被自動加入黑名單。如需手動解除封鎖，請至管理後台的 IP 黑名單頁面操作。
              </p>
            </div>
            <div style="margin-top: 16px; padding: 12px; background: #f3f4f6; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                此郵件由系統自動發送，請勿直接回覆。
              </p>
            </div>
          </div>
        `;
        break;

      default:
        subject = `🔔 安全通知：${alertType}`;
        htmlContent = `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>安全事件通知</h2>
            <p>事件類型: ${alertType}</p>
            <p>IP 地址: ${ipAddress}</p>
            <p>發生時間: ${timestamp}</p>
            <pre>${JSON.stringify(details, null, 2)}</pre>
          </div>
        `;
    }

    // Send email using Resend API directly via fetch
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "安全警報 <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: subject,
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Failed to send security alert email:", emailResult);
      return new Response(
        JSON.stringify({ error: emailResult.message || "Failed to send email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Security alert email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending security alert email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
