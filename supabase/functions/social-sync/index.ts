import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Facebook and Instagram tokens from secrets
    const facebookAccessToken = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
    const facebookPageId = Deno.env.get("FACEBOOK_PAGE_ID");
    const instagramBusinessAccountId = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID");

    const { noteId, platform } = await req.json();

    if (!noteId || !platform) {
      return new Response(
        JSON.stringify({ error: "Missing noteId or platform" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the note
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .single();

    if (noteError || !note) {
      console.error("Note fetch error:", noteError);
      return new Response(
        JSON.stringify({ error: "Note not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!note.is_published) {
      return new Response(
        JSON.stringify({ error: "Note is not published" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch attachments for images
    const { data: attachments } = await supabase
      .from("note_attachments")
      .select("*")
      .eq("note_id", noteId)
      .eq("file_type", "image")
      .order("sort_order", { ascending: true })
      .limit(10);

    const content = note.content as { text?: string } | null;
    const noteUrl = `${Deno.env.get("PUBLIC_SITE_URL") || "https://your-domain.com"}/notes/${note.share_link}`;
    
    // Prepare message content
    const message = `${note.title}\n\n${note.excerpt || content?.text?.substring(0, 200) || ""}\n\n閱讀全文：${noteUrl}`;

    let result: { success: boolean; postId?: string; error?: string } = { success: false };

    // Create sync record
    const { data: syncRecord, error: syncError } = await supabase
      .from("note_social_syncs")
      .insert({
        note_id: noteId,
        platform,
        status: "pending",
      })
      .select()
      .single();

    if (syncError) {
      console.error("Sync record creation error:", syncError);
    }

    if (platform === "facebook") {
      if (!facebookAccessToken || !facebookPageId) {
        result = { success: false, error: "Facebook credentials not configured" };
      } else {
        try {
          // Post to Facebook Page
          const fbUrl = `https://graph.facebook.com/v18.0/${facebookPageId}/feed`;
          
          const postData: Record<string, string> = {
            access_token: facebookAccessToken,
            message,
          };

          // Add link if no images
          if (!attachments || attachments.length === 0) {
            postData.link = noteUrl;
          }

          const fbResponse = await fetch(fbUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(postData),
          });

          const fbResult = await fbResponse.json();
          
          if (fbResult.id) {
            result = { success: true, postId: fbResult.id };
            console.log("Facebook post created:", fbResult.id);

            // If there are images, post them as photos
            if (attachments && attachments.length > 0) {
              for (const attachment of attachments) {
                const photoUrl = `https://graph.facebook.com/v18.0/${facebookPageId}/photos`;
                await fetch(photoUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/x-www-form-urlencoded" },
                  body: new URLSearchParams({
                    access_token: facebookAccessToken,
                    url: attachment.file_url,
                    caption: message,
                  }),
                });
              }
            }
          } else {
            result = { success: false, error: fbResult.error?.message || "Facebook API error" };
            console.error("Facebook error:", fbResult);
          }
        } catch (error: unknown) {
          console.error("Facebook sync error:", error);
          result = { success: false, error: error instanceof Error ? error.message : String(error) };
        }
      }
    } else if (platform === "instagram") {
      if (!facebookAccessToken || !instagramBusinessAccountId) {
        result = { success: false, error: "Instagram credentials not configured" };
      } else {
        try {
          // Instagram requires an image for posts
          const imageUrl = note.cover_image_url || attachments?.[0]?.file_url;
          
          if (!imageUrl) {
            result = { success: false, error: "Instagram posts require an image" };
          } else {
            // Step 1: Create media container
            const containerUrl = `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media`;
            const containerResponse = await fetch(containerUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                access_token: facebookAccessToken,
                image_url: imageUrl,
                caption: message,
              }),
            });

            const containerResult = await containerResponse.json();

            if (containerResult.id) {
              // Step 2: Publish the container
              const publishUrl = `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media_publish`;
              const publishResponse = await fetch(publishUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                  access_token: facebookAccessToken,
                  creation_id: containerResult.id,
                }),
              });

              const publishResult = await publishResponse.json();

              if (publishResult.id) {
                result = { success: true, postId: publishResult.id };
                console.log("Instagram post published:", publishResult.id);
              } else {
                result = { success: false, error: publishResult.error?.message || "Instagram publish error" };
                console.error("Instagram publish error:", publishResult);
              }
            } else {
              result = { success: false, error: containerResult.error?.message || "Instagram container error" };
              console.error("Instagram container error:", containerResult);
            }
          }
        } catch (error: unknown) {
          console.error("Instagram sync error:", error);
          result = { success: false, error: error instanceof Error ? error.message : String(error) };
        }
      }
    } else {
      result = { success: false, error: `Unsupported platform: ${platform}` };
    }

    // Update sync record
    if (syncRecord) {
      await supabase
        .from("note_social_syncs")
        .update({
          status: result.success ? "success" : "failed",
          external_post_id: result.postId || null,
          error_message: result.error || null,
          synced_at: result.success ? new Date().toISOString() : null,
        })
        .eq("id", syncRecord.id);
    }

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Social sync error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
