-- Create enum for note visibility
CREATE TYPE public.note_visibility AS ENUM ('public', 'members', 'paid_members');

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content JSONB,
  excerpt TEXT,
  cover_image_url TEXT,
  visibility note_visibility NOT NULL DEFAULT 'public',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER NOT NULL DEFAULT 0,
  share_link TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create note attachments table for media files
CREATE TABLE public.note_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social sync log table
CREATE TABLE public.note_social_syncs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  external_post_id TEXT,
  error_message TEXT,
  synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_social_syncs ENABLE ROW LEVEL SECURITY;

-- Notes RLS policies
CREATE POLICY "Admins can manage all notes"
ON public.notes
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view public published notes"
ON public.notes
FOR SELECT
USING (visibility = 'public' AND is_published = true);

CREATE POLICY "Members can view member notes"
ON public.notes
FOR SELECT
USING (
  is_published = true AND
  visibility IN ('public', 'members') AND
  is_member(auth.uid())
);

CREATE POLICY "Paid members can view paid notes"
ON public.notes
FOR SELECT
USING (
  is_published = true AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND subscription_status IN ('active', 'trial')
  )
);

-- Note attachments RLS policies
CREATE POLICY "Admins can manage all attachments"
ON public.note_attachments
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view attachments of accessible notes"
ON public.note_attachments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.notes n
    WHERE n.id = note_id
    AND n.is_published = true
    AND (
      n.visibility = 'public'
      OR (n.visibility = 'members' AND is_member(auth.uid()))
      OR (n.visibility = 'paid_members' AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid()
        AND subscription_status IN ('active', 'trial')
      ))
    )
  )
);

-- Social syncs RLS policies
CREATE POLICY "Admins can manage social syncs"
ON public.note_social_syncs
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for note media
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('note-media', 'note-media', true, 104857600)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for note media
CREATE POLICY "Admins can upload note media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'note-media'
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update note media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'note-media'
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete note media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'note-media'
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can view note media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'note-media');

-- Function to increment note view count
CREATE OR REPLACE FUNCTION public.increment_note_view_count(note_share_link text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.notes
  SET view_count = view_count + 1
  WHERE share_link = note_share_link;
END;
$$;