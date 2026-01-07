import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DownloadRequest {
  shareLink: string;
  password?: string; // Required for password-protected documents
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { shareLink, password }: DownloadRequest = await req.json();

    console.log("Download request received for shareLink:", shareLink);

    // Validate required parameters
    if (!shareLink) {
      console.error("Missing shareLink parameter");
      return new Response(
        JSON.stringify({ error: "缺少必要參數" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get document details using admin client
    const { data: document, error: docError } = await supabaseAdmin
      .from("documents")
      .select("id, file_path, original_name, is_public, password_hash, expires_at")
      .eq("share_link", shareLink)
      .single();

    if (docError || !document) {
      console.error("Document not found:", docError);
      return new Response(
        JSON.stringify({ error: "找不到此文件" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Document found:", document.id);

    // Check if document is public
    if (!document.is_public) {
      console.error("Document is not public");
      return new Response(
        JSON.stringify({ error: "此文件無法存取" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if document has expired
    if (document.expires_at) {
      const expirationDate = new Date(document.expires_at);
      if (expirationDate < new Date()) {
        console.error("Document link has expired");
        return new Response(
          JSON.stringify({ error: "此連結已過期" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Check if document requires password
    if (!document.password_hash) {
      console.error("Document has no password set - not ready for sharing");
      return new Response(
        JSON.stringify({ error: "此文件尚未設定密碼" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SECURITY: Verify password before allowing download
    if (!password) {
      console.error("Password required but not provided");
      return new Response(
        JSON.stringify({ error: "需要密碼才能下載此文件" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify password using secure database function
    const { data: isValidPassword, error: pwdError } = await supabaseAdmin.rpc('verify_document_password', {
      doc_share_link: shareLink,
      pwd: password
    });

    if (pwdError || !isValidPassword) {
      console.error("Invalid password for download:", pwdError);
      return new Response(
        JSON.stringify({ error: "密碼錯誤" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if file_path exists
    if (!document.file_path) {
      console.error("Document has no file path");
      return new Response(
        JSON.stringify({ error: "此文件沒有可下載的檔案" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate signed URL with service role (60 seconds expiry)
    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(document.file_path, 60);

    if (urlError || !signedUrlData?.signedUrl) {
      console.error("Failed to generate signed URL:", urlError);
      return new Response(
        JSON.stringify({ error: "無法生成下載連結" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Signed URL generated successfully for document:", document.id);

    // Log the download attempt for audit purposes
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    console.log("Download audit log:", {
      documentId: document.id,
      shareLink: shareLink,
      fileName: document.original_name,
      clientIP: clientIP,
      userAgent: userAgent.substring(0, 100),
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ 
        signedUrl: signedUrlData.signedUrl,
        fileName: document.original_name
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Error in download-document function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "下載時發生錯誤" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
