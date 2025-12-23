-- Create pending_changes table for helper submissions
CREATE TABLE public.pending_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL, -- 'create', 'update', 'delete'
  target_table TEXT NOT NULL, -- e.g. 'documents', 'customers', 'notes'
  target_id UUID, -- for update/delete
  change_data JSONB NOT NULL, -- the actual change payload
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'pending', 'approved', 'rejected'
  batch_id UUID, -- groups changes submitted together
  notes TEXT, -- helper's notes about the change
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT, -- admin's notes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pending_changes ENABLE ROW LEVEL SECURITY;

-- Helpers can view and manage their own draft/pending changes
CREATE POLICY "Helpers can view own changes"
ON public.pending_changes
FOR SELECT
USING (
  submitted_by = auth.uid() OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Helpers can insert own changes"
ON public.pending_changes
FOR INSERT
WITH CHECK (
  submitted_by = auth.uid() AND 
  (has_role(auth.uid(), 'helper'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Helpers can update own draft changes"
ON public.pending_changes
FOR UPDATE
USING (
  (submitted_by = auth.uid() AND status = 'draft') OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Helpers can delete own draft changes"
ON public.pending_changes
FOR DELETE
USING (
  (submitted_by = auth.uid() AND status = 'draft') OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add trigger for updated_at
CREATE TRIGGER update_pending_changes_updated_at
BEFORE UPDATE ON public.pending_changes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();