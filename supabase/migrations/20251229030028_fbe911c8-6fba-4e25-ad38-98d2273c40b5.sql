-- Create rate_limits table for tracking request counts
CREATE TABLE public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create unique constraint for identifier + endpoint combination
CREATE UNIQUE INDEX idx_rate_limits_identifier_endpoint ON public.rate_limits (identifier, endpoint);

-- Create index for cleanup queries
CREATE INDEX idx_rate_limits_window_start ON public.rate_limits (window_start);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to manage rate limits (using service role)
-- No user-facing policies needed as this is managed by edge functions

-- Create function to check and update rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_endpoint text,
  p_max_requests integer DEFAULT 10,
  p_window_seconds integer DEFAULT 60
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_record rate_limits%ROWTYPE;
  v_window_start timestamp with time zone;
  v_is_allowed boolean;
  v_remaining integer;
BEGIN
  v_window_start := now() - (p_window_seconds || ' seconds')::interval;
  
  -- Try to get existing record
  SELECT * INTO v_record
  FROM rate_limits
  WHERE identifier = p_identifier AND endpoint = p_endpoint
  FOR UPDATE;
  
  IF v_record IS NULL THEN
    -- First request, create new record
    INSERT INTO rate_limits (identifier, endpoint, request_count, window_start)
    VALUES (p_identifier, p_endpoint, 1, now())
    RETURNING * INTO v_record;
    
    v_is_allowed := true;
    v_remaining := p_max_requests - 1;
  ELSIF v_record.window_start < v_window_start THEN
    -- Window expired, reset counter
    UPDATE rate_limits
    SET request_count = 1, window_start = now()
    WHERE id = v_record.id;
    
    v_is_allowed := true;
    v_remaining := p_max_requests - 1;
  ELSIF v_record.request_count >= p_max_requests THEN
    -- Rate limit exceeded
    v_is_allowed := false;
    v_remaining := 0;
  ELSE
    -- Increment counter
    UPDATE rate_limits
    SET request_count = request_count + 1
    WHERE id = v_record.id;
    
    v_is_allowed := true;
    v_remaining := p_max_requests - v_record.request_count - 1;
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', v_is_allowed,
    'remaining', GREATEST(v_remaining, 0),
    'reset_at', EXTRACT(EPOCH FROM (COALESCE(v_record.window_start, now()) + (p_window_seconds || ' seconds')::interval))::bigint
  );
END;
$$;

-- Create cleanup function to remove old records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < now() - interval '1 hour';
END;
$$;