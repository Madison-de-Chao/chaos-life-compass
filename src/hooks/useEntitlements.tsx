import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  product_id: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  duration_days: number | null;
  created_at: string;
  updated_at: string;
}

export interface Entitlement {
  id: string;
  user_id: string;
  product_id: string;
  plan_id: string | null;
  status: 'active' | 'expired' | 'revoked';
  starts_at: string;
  ends_at: string | null;
  granted_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EntitlementWithDetails extends Entitlement {
  product?: Product;
  plan?: Plan;
  user_email?: string;
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('product_id, name');
      
      if (error) throw error;
      return data as Plan[];
    },
  });
}

export function useMyEntitlements() {
  return useQuery({
    queryKey: ['my-entitlements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('entitlements')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as Entitlement[];
    },
  });
}

export function useAllEntitlements() {
  return useQuery({
    queryKey: ['all-entitlements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entitlements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Entitlement[];
    },
  });
}

export function useCreateEntitlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entitlement: {
      user_id: string;
      product_id: string;
      plan_id?: string;
      status?: 'active' | 'expired' | 'revoked';
      starts_at?: string;
      ends_at?: string | null;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('entitlements')
        .upsert({
          ...entitlement,
          granted_by: user?.id,
        }, { onConflict: 'user_id,product_id' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      queryClient.invalidateQueries({ queryKey: ['my-entitlements'] });
      toast.success('權限已更新');
    },
    onError: (error) => {
      console.error('Failed to create entitlement:', error);
      toast.error('更新權限失敗');
    },
  });
}

export function useUpdateEntitlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Entitlement> & { id: string }) => {
      const { data, error } = await supabase
        .from('entitlements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      queryClient.invalidateQueries({ queryKey: ['my-entitlements'] });
      toast.success('權限已更新');
    },
    onError: (error) => {
      console.error('Failed to update entitlement:', error);
      toast.error('更新權限失敗');
    },
  });
}

export function useDeleteEntitlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('entitlements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      queryClient.invalidateQueries({ queryKey: ['my-entitlements'] });
      toast.success('權限已刪除');
    },
    onError: (error) => {
      console.error('Failed to delete entitlement:', error);
      toast.error('刪除權限失敗');
    },
  });
}

// Search users by email for admin
export function useSearchUsers(email: string) {
  return useQuery({
    queryKey: ['search-users', email],
    queryFn: async () => {
      if (!email || email.length < 3) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .ilike('display_name', `%${email}%`)
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: email.length >= 3,
  });
}
