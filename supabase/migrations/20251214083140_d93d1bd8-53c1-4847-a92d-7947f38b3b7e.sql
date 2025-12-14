-- Create feedbacks table to store customer feedback
CREATE TABLE public.feedbacks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    document_title TEXT NOT NULL,
    customer_name TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Anyone can insert feedback (for public document viewers)
CREATE POLICY "Anyone can submit feedback" 
ON public.feedbacks 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view/manage feedback
CREATE POLICY "Authenticated users can view all feedbacks" 
ON public.feedbacks 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update feedbacks" 
ON public.feedbacks 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete feedbacks" 
ON public.feedbacks 
FOR DELETE 
TO authenticated
USING (true);