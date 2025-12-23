import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PendingChange {
  id: string;
  change_type: 'create' | 'update' | 'delete';
  target_table: string;
  target_id: string | null;
  change_data: Record<string, unknown>;
  status: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get the auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user is an admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error("User authentication failed:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await userClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.error("Admin check failed:", roleError);
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { changeIds, action, reviewNotes } = await req.json();

    if (!changeIds || !Array.isArray(changeIds) || changeIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "changeIds array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return new Response(
        JSON.stringify({ error: "action must be 'approve' or 'reject'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${action} for ${changeIds.length} changes by admin ${user.id}`);

    // Use service role for database operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the pending changes
    const { data: changes, error: fetchError } = await adminClient
      .from('pending_changes')
      .select('*')
      .in('id', changeIds)
      .eq('status', 'pending');

    if (fetchError) {
      console.error("Error fetching changes:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch pending changes" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!changes || changes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No pending changes found with the provided IDs" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { id: string; success: boolean; error?: string }[] = [];

    if (action === 'approve') {
      // Execute each approved change
      for (const change of changes as PendingChange[]) {
        console.log(`Applying change ${change.id}: ${change.change_type} on ${change.target_table}`);
        
        try {
          let operationError: Error | null = null;

          // Validate target_table to prevent injection
          const allowedTables = ['profiles', 'customers', 'documents', 'notes', 'member_documents', 'subscriptions'];
          if (!allowedTables.includes(change.target_table)) {
            throw new Error(`Invalid target table: ${change.target_table}`);
          }

          switch (change.change_type) {
            case 'create':
              const { error: insertError } = await adminClient
                .from(change.target_table)
                .insert(change.change_data);
              operationError = insertError;
              break;

            case 'update':
              if (!change.target_id) {
                throw new Error("target_id is required for update operations");
              }
              const { error: updateError } = await adminClient
                .from(change.target_table)
                .update(change.change_data)
                .eq('id', change.target_id);
              operationError = updateError;
              break;

            case 'delete':
              if (!change.target_id) {
                throw new Error("target_id is required for delete operations");
              }
              const { error: deleteError } = await adminClient
                .from(change.target_table)
                .delete()
                .eq('id', change.target_id);
              operationError = deleteError;
              break;

            default:
              throw new Error(`Unknown change type: ${change.change_type}`);
          }

          if (operationError) {
            throw operationError;
          }

          // Mark change as approved
          await adminClient
            .from('pending_changes')
            .update({
              status: 'approved',
              reviewed_by: user.id,
              reviewed_at: new Date().toISOString(),
              review_notes: reviewNotes || null,
            })
            .eq('id', change.id);

          results.push({ id: change.id, success: true });
          console.log(`Successfully applied change ${change.id}`);

        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error(`Failed to apply change ${change.id}:`, errorMessage);
          
          // Mark as rejected with error
          await adminClient
            .from('pending_changes')
            .update({
              status: 'rejected',
              reviewed_by: user.id,
              reviewed_at: new Date().toISOString(),
              review_notes: `自動執行失敗: ${errorMessage}. ${reviewNotes || ''}`,
            })
            .eq('id', change.id);

          results.push({ id: change.id, success: false, error: errorMessage });
        }
      }
    } else {
      // Reject all changes
      for (const change of changes as PendingChange[]) {
        await adminClient
          .from('pending_changes')
          .update({
            status: 'rejected',
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
            review_notes: reviewNotes || null,
          })
          .eq('id', change.id);

        results.push({ id: change.id, success: true });
      }
      console.log(`Rejected ${changes.length} changes`);
    }

    // Log admin action
    await adminClient.from('admin_logs').insert({
      user_id: user.id,
      action_type: action === 'approve' ? 'approve_changes' : 'reject_changes',
      target_type: 'pending_changes',
      target_id: changeIds.join(','),
      details: {
        change_count: changes.length,
        results,
        review_notes: reviewNotes,
      },
    });

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: action === 'approve' 
          ? `已核准並執行 ${successCount} 項變更${failCount > 0 ? `，${failCount} 項失敗` : ''}`
          : `已拒絕 ${changes.length} 項變更`,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in apply-approved-changes:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
