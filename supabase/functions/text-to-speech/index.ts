import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit configuration for TTS: 20 requests per minute per IP
const TTS_RATE_LIMIT = { maxRequests: 20, windowSeconds: 60 };

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    // Check rate limit
    const { data: rateLimitResult, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_identifier: clientIp,
        p_endpoint: 'text-to-speech',
        p_max_requests: TTS_RATE_LIMIT.maxRequests,
        p_window_seconds: TTS_RATE_LIMIT.windowSeconds
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (!rateLimitResult?.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult?.reset_at 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult?.reset_at || 0)
          } 
        }
      );
    }

    const { text, voice = 'onyx', documentId, pageIndex } = await req.json();

    // Validate required fields
    if (!text) {
      throw new Error('Text is required');
    }
    
    if (!documentId) {
      console.error('Document ID is required for TTS');
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Security: Verify the document exists and is public before processing
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('id, is_public')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      console.error('Document not found:', documentId);
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!doc.is_public) {
      console.error('Access denied: Document is not public:', documentId);
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate cache key based on document and page
    const cacheKey = pageIndex !== undefined 
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

    console.log(`Generating speech for document ${documentId}, text: ${text.substring(0, 100)}...`);

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
