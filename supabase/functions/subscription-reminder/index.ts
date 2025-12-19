import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY");

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  subscription_status: string;
  subscription_expires_at: string | null;
}

interface AuthUser {
  id: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Starting subscription-reminder job...");

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find profiles with subscriptions expiring in the next 7 days
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: expiringProfiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_id, display_name, subscription_status, subscription_expires_at")
      .in("subscription_status", ["active", "trial"])
      .not("subscription_expires_at", "is", null)
      .gte("subscription_expires_at", now.toISOString())
      .lte("subscription_expires_at", sevenDaysFromNow.toISOString());

    if (profileError) {
      console.error("Error fetching expiring profiles:", profileError);
      throw profileError;
    }

    console.log(`Found ${expiringProfiles?.length || 0} expiring subscriptions`);

    // Also find expired subscriptions that need status update
    const { data: expiredProfiles, error: expiredError } = await supabase
      .from("profiles")
      .select("id, user_id, display_name, subscription_status, subscription_expires_at")
      .in("subscription_status", ["active", "trial"])
      .not("subscription_expires_at", "is", null)
      .lt("subscription_expires_at", now.toISOString());

    if (expiredError) {
      console.error("Error fetching expired profiles:", expiredError);
    }

    // Update expired subscriptions
    if (expiredProfiles && expiredProfiles.length > 0) {
      console.log(`Found ${expiredProfiles.length} expired subscriptions to update`);
      
      for (const profile of expiredProfiles) {
        // Check if auto-renew is enabled
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("metadata")
          .eq("user_id", profile.user_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const autoRenew = subscription?.metadata?.auto_renew;

        if (autoRenew) {
          // Auto-renew: extend subscription by 30 days
          const newExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          
          await supabase
            .from("profiles")
            .update({
              subscription_expires_at: newExpiry.toISOString(),
            })
            .eq("user_id", profile.user_id);

          // Log the auto-renewal
          await supabase
            .from("member_interactions")
            .insert({
              user_id: profile.user_id,
              interaction_type: "subscription_auto_renew",
              content: `訂閱已自動續訂，新到期日: ${newExpiry.toISOString().split("T")[0]}`,
              metadata: { auto_renewed: true },
            });

          console.log(`Auto-renewed subscription for user ${profile.user_id}`);
        } else {
          // Mark as expired
          await supabase
            .from("profiles")
            .update({
              subscription_status: "expired",
            })
            .eq("user_id", profile.user_id);

          // Log the expiration
          await supabase
            .from("member_interactions")
            .insert({
              user_id: profile.user_id,
              interaction_type: "subscription_expired",
              content: "訂閱已過期",
            });

          console.log(`Marked subscription as expired for user ${profile.user_id}`);
        }
      }
    }

    // Send reminder emails for expiring subscriptions
    const remindersSent: string[] = [];
    const remindersSkipped: string[] = [];

    if (expiringProfiles && expiringProfiles.length > 0 && resendApiKey) {
      const resend = new Resend(resendApiKey);

      for (const profile of expiringProfiles) {
        // Get user email from auth
        const { data: authData } = await supabase.auth.admin.getUserById(profile.user_id);
        const userEmail = authData?.user?.email;

        if (!userEmail) {
          console.log(`No email found for user ${profile.user_id}`);
          remindersSkipped.push(profile.user_id);
          continue;
        }

        // Check if we already sent a reminder in the last 24 hours
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const { data: recentReminder } = await supabase
          .from("member_interactions")
          .select("id")
          .eq("user_id", profile.user_id)
          .eq("interaction_type", "expiration_reminder")
          .gte("created_at", oneDayAgo.toISOString())
          .limit(1);

        if (recentReminder && recentReminder.length > 0) {
          console.log(`Already sent reminder to ${profile.user_id} within 24 hours`);
          remindersSkipped.push(profile.user_id);
          continue;
        }

        const expiryDate = new Date(profile.subscription_expires_at!);
        const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const displayName = profile.display_name || "會員";

        try {
          await resend.emails.send({
            from: "默默命理 <noreply@resend.dev>",
            to: [userEmail],
            subject: `⏰ 您的訂閱將在 ${daysRemaining} 天後到期`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">親愛的 ${displayName}，</h2>
                <p>您的訂閱將於 <strong>${expiryDate.toLocaleDateString("zh-TW")}</strong> 到期。</p>
                <p>為了確保您能繼續享有完整的會員權益，請儘早續訂您的會員資格。</p>
                <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
                  <p style="margin: 0; color: #666;">
                    剩餘天數：<strong style="color: #e67e22;">${daysRemaining} 天</strong>
                  </p>
                </div>
                <p>如有任何問題，歡迎隨時與我們聯繫。</p>
                <p style="color: #666; margin-top: 24px;">
                  默默命理團隊
                </p>
              </div>
            `,
          });

          // Log the reminder
          await supabase
            .from("member_interactions")
            .insert({
              user_id: profile.user_id,
              interaction_type: "expiration_reminder",
              content: `已發送到期提醒郵件，剩餘 ${daysRemaining} 天`,
              metadata: { email_sent_to: userEmail, days_remaining: daysRemaining },
            });

          remindersSent.push(profile.user_id);
          console.log(`Sent reminder to ${userEmail}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${userEmail}:`, emailError);
          remindersSkipped.push(profile.user_id);
        }
      }
    }

    const result = {
      processed_at: now.toISOString(),
      expiring_count: expiringProfiles?.length || 0,
      expired_count: expiredProfiles?.length || 0,
      reminders_sent: remindersSent.length,
      reminders_skipped: remindersSkipped.length,
    };

    console.log("Job completed:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in subscription-reminder:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
