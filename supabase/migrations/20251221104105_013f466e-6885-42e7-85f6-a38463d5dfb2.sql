-- Create entitlement_status enum
CREATE TYPE public.entitlement_status AS ENUM ('active', 'expired', 'revoked');

-- Create products table
CREATE TABLE public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert the 3 products
INSERT INTO public.products (id, name, description) VALUES 
  ('report_platform', '報告閱讀平台', '默默超命理報告閱讀網站'),
  ('story_builder_hub', 'Story Builder Hub', '故事建構中心'),
  ('seek_monster', 'Seek Monster', '尋找怪獸');

-- Create plans table
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric,
  currency text DEFAULT 'TWD',
  duration_days integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default plans for each product
INSERT INTO public.plans (product_id, name, description, price, duration_days) VALUES 
  ('report_platform', '基本方案', '報告閱讀平台基本存取權限', 0, NULL),
  ('story_builder_hub', '基本方案', 'Story Builder Hub 基本存取權限', 0, NULL),
  ('seek_monster', '基本方案', 'Seek Monster 基本存取權限', 0, NULL);

-- Create entitlements table
CREATE TABLE public.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL,
  status public.entitlement_status NOT NULL DEFAULT 'active',
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone,
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can view (public info)
CREATE POLICY "Anyone can view products" ON public.products
FOR SELECT USING (true);

-- Products: Only admins can manage
CREATE POLICY "Admins can manage products" ON public.products
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Plans: Anyone can view (public info)
CREATE POLICY "Anyone can view plans" ON public.plans
FOR SELECT USING (true);

-- Plans: Only admins can manage
CREATE POLICY "Admins can manage plans" ON public.plans
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Entitlements: Users can only view their own
CREATE POLICY "Users can view own entitlements" ON public.entitlements
FOR SELECT USING (auth.uid() = user_id);

-- Entitlements: Admins can manage all
CREATE POLICY "Admins can manage all entitlements" ON public.entitlements
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add updated_at triggers
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entitlements_updated_at
BEFORE UPDATE ON public.entitlements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX idx_entitlements_product_id ON public.entitlements(product_id);
CREATE INDEX idx_entitlements_status ON public.entitlements(status);