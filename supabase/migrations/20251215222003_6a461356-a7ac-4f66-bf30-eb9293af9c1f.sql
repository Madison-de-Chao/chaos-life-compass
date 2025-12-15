-- Add tracking capabilities to feedbacks table
ALTER TABLE public.feedbacks 
ADD COLUMN admin_notes text,
ADD COLUMN follow_up_status text DEFAULT 'pending' CHECK (follow_up_status IN ('pending', 'in_progress', 'resolved', 'no_action_needed')),
ADD COLUMN follow_up_date timestamp with time zone,
ADD COLUMN resolved_at timestamp with time zone;

-- Create feedback_tracking table for detailed tracking history
CREATE TABLE public.feedback_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id uuid REFERENCES public.feedbacks(id) ON DELETE CASCADE,
  note text NOT NULL,
  status_change text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.feedback_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback_tracking
CREATE POLICY "Admins can manage feedback tracking"
ON public.feedback_tracking
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add index for performance
CREATE INDEX idx_feedback_tracking_feedback_id ON public.feedback_tracking(feedback_id);
CREATE INDEX idx_feedbacks_follow_up_status ON public.feedbacks(follow_up_status);