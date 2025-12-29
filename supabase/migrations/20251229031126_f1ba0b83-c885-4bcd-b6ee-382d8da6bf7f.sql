-- Create function to auto-block IP after multiple rate limit violations
CREATE OR REPLACE FUNCTION public.auto_block_ip_if_needed(
  p_ip_address text,
  p_threshold integer DEFAULT 3,
  p_window_hours integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_violation_count integer;
  v_already_blocked boolean;
BEGIN
  -- Check if already blocked
  SELECT EXISTS (
    SELECT 1 FROM public.ip_blacklist
    WHERE ip_address = p_ip_address
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  ) INTO v_already_blocked;
  
  IF v_already_blocked THEN
    RETURN false; -- Already blocked
  END IF;
  
  -- Count rate limit violations in the time window
  SELECT COUNT(*) INTO v_violation_count
  FROM public.admin_logs
  WHERE action_type = 'rate_limit_exceeded'
    AND ip_address = p_ip_address
    AND created_at > now() - (p_window_hours || ' hours')::interval;
  
  -- If threshold exceeded, add to blacklist
  IF v_violation_count >= p_threshold THEN
    INSERT INTO public.ip_blacklist (
      ip_address,
      reason,
      expires_at,
      is_active
    ) VALUES (
      p_ip_address,
      '自動封鎖：在 ' || p_window_hours || ' 小時內觸發 ' || v_violation_count || ' 次 rate limit',
      now() + interval '24 hours', -- Auto-block for 24 hours
      true
    )
    ON CONFLICT (ip_address) DO UPDATE SET
      is_active = true,
      reason = EXCLUDED.reason,
      expires_at = EXCLUDED.expires_at,
      blocked_at = now();
    
    -- Log the auto-block action
    INSERT INTO public.admin_logs (
      user_id,
      action_type,
      target_type,
      target_id,
      ip_address,
      details
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'ip_auto_blocked',
      'ip_address',
      p_ip_address,
      p_ip_address,
      jsonb_build_object(
        'violation_count', v_violation_count,
        'threshold', p_threshold,
        'window_hours', p_window_hours,
        'expires_at', now() + interval '24 hours'
      )
    );
    
    RETURN true; -- IP was blocked
  END IF;
  
  RETURN false; -- Not blocked
END;
$$;