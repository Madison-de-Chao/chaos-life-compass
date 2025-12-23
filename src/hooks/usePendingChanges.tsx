import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PendingChange {
  id: string;
  submitted_by: string;
  change_type: 'create' | 'update' | 'delete';
  target_table: string;
  target_id: string | null;
  change_data: Record<string, unknown>;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  batch_id: string | null;
  notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  submitter_email?: string;
  submitter_name?: string;
  reviewer_email?: string;
  reviewer_name?: string;
}

export interface CreatePendingChangeInput {
  change_type: 'create' | 'update' | 'delete';
  target_table: string;
  target_id?: string;
  change_data: Record<string, unknown>;
  notes?: string;
}

export function usePendingChanges() {
  const [draftChanges, setDraftChanges] = useState<PendingChange[]>([]);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [allChanges, setAllChanges] = useState<PendingChange[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch draft changes for current user (helper view)
  const fetchDraftChanges = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase
      .from('pending_changes' as any)
      .select('*')
      .eq('submitted_by', userData.user.id)
      .eq('status', 'draft')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching draft changes:', error);
    } else {
      setDraftChanges((data || []) as unknown as PendingChange[]);
    }
  }, []);

  // Fetch pending changes for admin review
  const fetchPendingChanges = useCallback(async () => {
    const { data, error } = await supabase
      .from('pending_changes' as any)
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending changes:', error);
    } else {
      setPendingChanges((data || []) as unknown as PendingChange[]);
    }
  }, []);

  // Fetch all changes (admin view)
  const fetchAllChanges = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pending_changes' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Error fetching all changes:', error);
    } else {
      setAllChanges((data || []) as unknown as PendingChange[]);
    }
    setLoading(false);
  }, []);

  // Add a new draft change
  const addDraftChange = async (input: CreatePendingChangeInput): Promise<boolean> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast({ title: "請先登入", variant: "destructive" });
      return false;
    }

    const { error } = await supabase
      .from('pending_changes' as any)
      .insert({
        submitted_by: userData.user.id,
        change_type: input.change_type,
        target_table: input.target_table,
        target_id: input.target_id || null,
        change_data: input.change_data,
        notes: input.notes || null,
        status: 'draft',
      } as any);

    if (error) {
      console.error('Error adding draft change:', error);
      toast({ title: "新增變更失敗", description: error.message, variant: "destructive" });
      return false;
    }

    toast({ title: "已加入待送審清單" });
    await fetchDraftChanges();
    return true;
  };

  // Update a draft change
  const updateDraftChange = async (id: string, updates: Partial<CreatePendingChangeInput>): Promise<boolean> => {
    const { error } = await supabase
      .from('pending_changes' as any)
      .update({
        ...(updates.change_type && { change_type: updates.change_type }),
        ...(updates.target_table && { target_table: updates.target_table }),
        ...(updates.target_id !== undefined && { target_id: updates.target_id }),
        ...(updates.change_data && { change_data: updates.change_data }),
        ...(updates.notes !== undefined && { notes: updates.notes }),
      } as any)
      .eq('id', id);

    if (error) {
      console.error('Error updating draft change:', error);
      toast({ title: "更新失敗", variant: "destructive" });
      return false;
    }

    await fetchDraftChanges();
    return true;
  };

  // Delete a draft change
  const deleteDraftChange = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('pending_changes' as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting draft change:', error);
      toast({ title: "刪除失敗", variant: "destructive" });
      return false;
    }

    toast({ title: "已移除變更" });
    await fetchDraftChanges();
    return true;
  };

  // Submit all draft changes for review (batch submit)
  const submitForReview = async (changeIds?: string[]): Promise<boolean> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const batchId = crypto.randomUUID();
    
    // Get IDs to submit
    const idsToSubmit = changeIds || draftChanges.map(c => c.id);
    
    if (idsToSubmit.length === 0) {
      toast({ title: "沒有待送審的變更", variant: "destructive" });
      return false;
    }

    const { error } = await supabase
      .from('pending_changes' as any)
      .update({ status: 'pending', batch_id: batchId } as any)
      .in('id', idsToSubmit)
      .eq('status', 'draft');

    if (error) {
      console.error('Error submitting for review:', error);
      toast({ title: "送審失敗", description: error.message, variant: "destructive" });
      return false;
    }

    toast({ title: `已送出 ${idsToSubmit.length} 項變更審核` });
    await fetchDraftChanges();
    return true;
  };

  // Admin: Approve a change
  const approveChange = async (id: string, reviewNotes?: string): Promise<boolean> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase
      .from('pending_changes' as any)
      .update({
        status: 'approved',
        reviewed_by: userData.user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
      } as any)
      .eq('id', id);

    if (error) {
      console.error('Error approving change:', error);
      toast({ title: "核准失敗", variant: "destructive" });
      return false;
    }

    toast({ title: "已核准變更" });
    return true;
  };

  // Admin: Reject a change
  const rejectChange = async (id: string, reviewNotes?: string): Promise<boolean> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase
      .from('pending_changes' as any)
      .update({
        status: 'rejected',
        reviewed_by: userData.user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
      } as any)
      .eq('id', id);

    if (error) {
      console.error('Error rejecting change:', error);
      toast({ title: "拒絕失敗", variant: "destructive" });
      return false;
    }

    toast({ title: "已拒絕變更" });
    return true;
  };

  // Admin: Batch approve changes
  const batchApprove = async (ids: string[], reviewNotes?: string): Promise<boolean> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase
      .from('pending_changes' as any)
      .update({
        status: 'approved',
        reviewed_by: userData.user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
      } as any)
      .in('id', ids);

    if (error) {
      console.error('Error batch approving:', error);
      toast({ title: "批量核准失敗", variant: "destructive" });
      return false;
    }

    toast({ title: `已核准 ${ids.length} 項變更` });
    return true;
  };

  // Admin: Batch reject changes
  const batchReject = async (ids: string[], reviewNotes?: string): Promise<boolean> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase
      .from('pending_changes' as any)
      .update({
        status: 'rejected',
        reviewed_by: userData.user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
      } as any)
      .in('id', ids);

    if (error) {
      console.error('Error batch rejecting:', error);
      toast({ title: "批量拒絕失敗", variant: "destructive" });
      return false;
    }

    toast({ title: `已拒絕 ${ids.length} 項變更` });
    return true;
  };

  useEffect(() => {
    fetchDraftChanges();
  }, [fetchDraftChanges]);

  return {
    draftChanges,
    pendingChanges,
    allChanges,
    loading,
    fetchDraftChanges,
    fetchPendingChanges,
    fetchAllChanges,
    addDraftChange,
    updateDraftChange,
    deleteDraftChange,
    submitForReview,
    approveChange,
    rejectChange,
    batchApprove,
    batchReject,
    draftCount: draftChanges.length,
  };
}
