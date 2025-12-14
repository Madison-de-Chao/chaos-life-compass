import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'onyx', documentId, pageIndex } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate cache key based on document and page
    const cacheKey = documentId && pageIndex !== undefined 
      ? `${documentId}/page-${pageIndex}.mp3`
      : null;

    // Check if cached audio exists
    if (cacheKey) {
      const { data: existingFile } = await supabase.storage
        .from('tts-cache')
        .list(documentId, { limit: 100 });

      const cachedFile = existingFile?.find(f => f.name === `page-${pageIndex}.mp3`);
      
      if (cachedFile) {
        console.log(`Using cached audio for ${cacheKey}`);
        const { data: publicUrl } = supabase.storage
          .from('tts-cache')
          .getPublicUrl(cacheKey);
        
        return new Response(
          JSON.stringify({ 
            audioUrl: publicUrl.publicUrl,
            cached: true 
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    console.log(`Generating speech for text: ${text.substring(0, 100)}...`);

    // Generate speech from text using OpenAI TTS
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI TTS error:', errorText);
      throw new Error(`OpenAI TTS error: ${response.status}`);
    }

    // Get the audio as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    console.log(`Generated audio, size: ${audioBuffer.byteLength} bytes`);

    // If we have cache key, upload to storage
    if (cacheKey) {
      const { error: uploadError } = await supabase.storage
        .from('tts-cache')
        .upload(cacheKey, audioBuffer, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Failed to cache audio:', uploadError);
      } else {
        console.log(`Cached audio to ${cacheKey}`);
        
        // Return public URL for cached file
        const { data: publicUrl } = supabase.storage
          .from('tts-cache')
          .getPublicUrl(cacheKey);
        
        return new Response(
          JSON.stringify({ 
            audioUrl: publicUrl.publicUrl,
            cached: false 
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    // Fallback: return base64 encoded audio if caching fails or not requested
    const base64Audio = base64Encode(audioBuffer);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Error in text-to-speech function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
