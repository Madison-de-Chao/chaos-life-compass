-- Create storage bucket for TTS audio cache
INSERT INTO storage.buckets (id, name, public)
VALUES ('tts-cache', 'tts-cache', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to cached TTS audio
CREATE POLICY "Public can read TTS cache"
ON storage.objects FOR SELECT
USING (bucket_id = 'tts-cache');

-- Allow authenticated users to upload TTS cache
CREATE POLICY "Authenticated users can upload TTS cache"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tts-cache');

-- Allow updates to TTS cache
CREATE POLICY "Authenticated users can update TTS cache"
ON storage.objects FOR UPDATE
USING (bucket_id = 'tts-cache');

-- Add tts_audio_urls column to documents table to store cached audio paths
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS tts_audio_urls JSONB DEFAULT '{}'::jsonb;