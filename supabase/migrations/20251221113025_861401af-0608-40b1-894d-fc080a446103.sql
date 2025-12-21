-- Add missing member profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.full_name IS '會員真實姓名';
COMMENT ON COLUMN public.profiles.nickname IS '會員暱稱';
COMMENT ON COLUMN public.profiles.display_name IS '顯示名稱';
COMMENT ON COLUMN public.profiles.phone IS '手機號碼';
COMMENT ON COLUMN public.profiles.gender IS '性別';
COMMENT ON COLUMN public.profiles.birth_date IS '出生年月日';
COMMENT ON COLUMN public.profiles.birth_time IS '出生時間';
COMMENT ON COLUMN public.profiles.subscription_status IS '訂閱狀態';
COMMENT ON COLUMN public.profiles.total_spent IS '累計消費金額';