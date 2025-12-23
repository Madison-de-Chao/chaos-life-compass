-- 為 products 表新增購買類型欄位
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS purchase_type text NOT NULL DEFAULT 'one_time',
ADD COLUMN IF NOT EXISTS price numeric,
ADD COLUMN IF NOT EXISTS duration_days integer;

-- 添加 check constraint 確保 purchase_type 只能是 'subscription' 或 'one_time'
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_purchase_type_check;

ALTER TABLE public.products 
ADD CONSTRAINT products_purchase_type_check 
CHECK (purchase_type IN ('subscription', 'one_time'));