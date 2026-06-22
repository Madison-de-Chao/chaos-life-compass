CREATE TABLE public.page_counters (
  page_key text PRIMARY KEY,
  view_count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_counters TO anon, authenticated;
GRANT ALL ON public.page_counters TO service_role;
ALTER TABLE public.page_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read page counters" ON public.page_counters FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.page_counters (page_key, view_count) VALUES ('portal', 0) ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_page_counter(p_page_key text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count bigint;
BEGIN
  INSERT INTO public.page_counters (page_key, view_count)
  VALUES (p_page_key, 1)
  ON CONFLICT (page_key) DO UPDATE
    SET view_count = public.page_counters.view_count + 1,
        updated_at = now()
  RETURNING view_count INTO v_count;
  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_page_counter(text) TO anon, authenticated;