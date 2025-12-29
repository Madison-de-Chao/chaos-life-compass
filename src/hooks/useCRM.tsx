import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Types
export interface CustomerTag {
  id: string;
  name: string;
  color: string;
  description: string | null;
  created_at: string;
}

export interface CustomerTagAssignment {
  id: string;
  customer_id: string;
  tag_id: string;
  assigned_at: string;
  tag?: CustomerTag;
}

export interface CustomerInteraction {
  id: string;
  customer_id: string;
  interaction_type: string;
  title: string;
  content: string | null;
  interaction_date: string;
  created_at: string;
  created_by: string | null;
  metadata: any;
}

export interface CustomerFollowUp {
  id: string;
  customer_id: string;
  title: string;
  description: string | null;
  due_date: string;
  priority: string;
  status: string;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
  created_by: string | null;
}

export interface CRMStats {
  totalInteractions: number;
  pendingFollowUps: number;
  overdueFollowUps: number;
  tagsCount: number;
}

// Hook for managing tags
export function useCustomerTags() {
  const [tags, setTags] = useState<CustomerTag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("customer_tags")
        .select("*")
        .order("name");

      if (error) throw error;
      setTags(data || []);
    } catch (error: any) {
      console.error("Error fetching tags:", error);
      toast({
        title: "載入標籤失敗",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = async (tag: { name: string; color: string; description?: string }) => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("customer_tags")
      .insert([{ ...tag, created_by: user.user?.id }])
      .select()
      .single();

    if (error) throw error;
    setTags((prev) => [...prev, data]);
    return data;
  };

  const updateTag = async (id: string, updates: Partial<CustomerTag>) => {
    const { error } = await supabase
      .from("customer_tags")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTag = async (id: string) => {
    const { error } = await supabase.from("customer_tags").delete().eq("id", id);
    if (error) throw error;
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, fetchTags, createTag, updateTag, deleteTag };
}

// Hook for customer tag assignments
export function useCustomerTagAssignments(customerId?: string) {
  const [assignments, setAssignments] = useState<CustomerTagAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("customer_tag_assignments")
        .select(`
          *,
          tag:customer_tags(*)
        `)
        .eq("customer_id", customerId);

      if (error) throw error;
      setAssignments(data || []);
    } catch (error: any) {
      console.error("Error fetching tag assignments:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const assignTag = async (tagId: string) => {
    if (!customerId) return;
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("customer_tag_assignments")
      .insert([{ customer_id: customerId, tag_id: tagId, assigned_by: user.user?.id }])
      .select(`*, tag:customer_tags(*)`)
      .single();

    if (error) throw error;
    setAssignments((prev) => [...prev, data]);
    return data;
  };

  const removeTag = async (tagId: string) => {
    if (!customerId) return;
    const { error } = await supabase
      .from("customer_tag_assignments")
      .delete()
      .eq("customer_id", customerId)
      .eq("tag_id", tagId);

    if (error) throw error;
    setAssignments((prev) => prev.filter((a) => a.tag_id !== tagId));
  };

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return { assignments, loading, fetchAssignments, assignTag, removeTag };
}

// Hook for customer interactions
export function useCustomerInteractions(customerId?: string) {
  const [interactions, setInteractions] = useState<CustomerInteraction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInteractions = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("customer_interactions")
        .select("*")
        .eq("customer_id", customerId)
        .order("interaction_date", { ascending: false });

      if (error) throw error;
      setInteractions(data || []);
    } catch (error: any) {
      console.error("Error fetching interactions:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const createInteraction = async (interaction: {
    interaction_type: string;
    title: string;
    content?: string;
    interaction_date?: string;
    metadata?: any;
  }) => {
    if (!customerId) return;
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("customer_interactions")
      .insert([{
        customer_id: customerId,
        ...interaction,
        interaction_date: interaction.interaction_date || new Date().toISOString(),
        created_by: user.user?.id,
      }])
      .select()
      .single();

    if (error) throw error;
    setInteractions((prev) => [data, ...prev]);
    return data;
  };

  const updateInteraction = async (id: string, updates: Partial<CustomerInteraction>) => {
    const { error } = await supabase
      .from("customer_interactions")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    setInteractions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const deleteInteraction = async (id: string) => {
    const { error } = await supabase.from("customer_interactions").delete().eq("id", id);
    if (error) throw error;
    setInteractions((prev) => prev.filter((i) => i.id !== id));
  };

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  return { interactions, loading, fetchInteractions, createInteraction, updateInteraction, deleteInteraction };
}

// Hook for follow-ups
export function useCustomerFollowUps(customerId?: string) {
  const [followUps, setFollowUps] = useState<CustomerFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowUps = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("customer_follow_ups")
        .select("*")
        .eq("customer_id", customerId)
        .order("due_date", { ascending: true });

      if (error) throw error;
      setFollowUps(data || []);
    } catch (error: any) {
      console.error("Error fetching follow-ups:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const createFollowUp = async (followUp: {
    title: string;
    description?: string;
    due_date: string;
    priority?: "low" | "medium" | "high" | "urgent";
  }) => {
    if (!customerId) return;
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("customer_follow_ups")
      .insert([{
        customer_id: customerId,
        ...followUp,
        created_by: user.user?.id,
      }])
      .select()
      .single();

    if (error) throw error;
    setFollowUps((prev) => [...prev, data].sort((a, b) => 
      new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    ));
    return data;
  };

  const updateFollowUp = async (id: string, updates: Partial<CustomerFollowUp>) => {
    const { error } = await supabase
      .from("customer_follow_ups")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const completeFollowUp = async (id: string) => {
    const { data: user } = await supabase.auth.getUser();
    const updates = {
      status: "completed" as const,
      completed_at: new Date().toISOString(),
      completed_by: user.user?.id,
    };
    await updateFollowUp(id, updates);
  };

  const deleteFollowUp = async (id: string) => {
    const { error } = await supabase.from("customer_follow_ups").delete().eq("id", id);
    if (error) throw error;
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  return { followUps, loading, fetchFollowUps, createFollowUp, updateFollowUp, completeFollowUp, deleteFollowUp };
}

// Hook for all pending follow-ups (dashboard)
export function useAllPendingFollowUps() {
  const [followUps, setFollowUps] = useState<(CustomerFollowUp & { customer_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingFollowUps = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("customer_follow_ups")
        .select(`
          *,
          customer:customers(name)
        `)
        .eq("status", "pending")
        .order("due_date", { ascending: true });

      if (error) throw error;
      setFollowUps(
        (data || []).map((f: any) => ({
          ...f,
          customer_name: f.customer?.name,
        }))
      );
    } catch (error: any) {
      console.error("Error fetching pending follow-ups:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingFollowUps();
  }, [fetchPendingFollowUps]);

  const overdueCount = followUps.filter(
    (f) => new Date(f.due_date) < new Date()
  ).length;

  return { followUps, loading, overdueCount, refresh: fetchPendingFollowUps };
}

// Hook for customer activity timeline
export function useCustomerTimeline(customerId?: string) {
  const [activities, setActivities] = useState<{
    id: string;
    type: "interaction" | "follow_up" | "tag" | "document" | "feedback";
    title: string;
    description?: string;
    date: string;
    metadata?: Record<string, unknown>;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch interactions
      const { data: interactions } = await supabase
        .from("customer_interactions")
        .select("*")
        .eq("customer_id", customerId);

      // Fetch follow-ups
      const { data: followUps } = await supabase
        .from("customer_follow_ups")
        .select("*")
        .eq("customer_id", customerId);

      // Fetch documents
      const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .eq("customer_id", customerId);

      // Fetch feedbacks related to customer's documents
      const docIds = documents?.map((d) => d.id) || [];
      const { data: feedbacks } = docIds.length > 0
        ? await supabase
            .from("feedbacks")
            .select("*")
            .in("document_id", docIds)
        : { data: [] };

      // Combine all activities
      const allActivities = [
        ...(interactions || []).map((i) => ({
          id: `interaction-${i.id}`,
          type: "interaction" as const,
          title: i.title,
          description: i.content,
          date: i.interaction_date,
          metadata: { interaction_type: i.interaction_type },
        })),
        ...(followUps || []).map((f) => ({
          id: `followup-${f.id}`,
          type: "follow_up" as const,
          title: f.title,
          description: f.description,
          date: f.due_date,
          metadata: { priority: f.priority, status: f.status },
        })),
        ...(documents || []).map((d) => ({
          id: `document-${d.id}`,
          type: "document" as const,
          title: `報告：${d.original_name}`,
          description: undefined,
          date: d.created_at,
          metadata: { view_count: d.view_count },
        })),
        ...(feedbacks || []).map((f) => ({
          id: `feedback-${f.id}`,
          type: "feedback" as const,
          title: `回饋：${f.document_title}`,
          description: f.message,
          date: f.created_at,
          metadata: { status: f.follow_up_status },
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivities(allActivities);
    } catch (error: any) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  return { activities, loading, refresh: fetchTimeline };
}
