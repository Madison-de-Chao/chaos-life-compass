-- 1. 建立客戶標籤表
CREATE TABLE public.customer_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. 建立客戶與標籤的關聯表（多對多）
CREATE TABLE public.customer_tag_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.customer_tags(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(customer_id, tag_id)
);

-- 3. 建立客戶互動紀錄表
CREATE TABLE public.customer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- call, meeting, email, message, note, other
  title TEXT NOT NULL,
  content TEXT,
  interaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. 建立跟進提醒表
CREATE TABLE public.customer_follow_ups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 啟用 RLS
ALTER TABLE public.customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_follow_ups ENABLE ROW LEVEL SECURITY;

-- 管理員可以管理所有標籤
CREATE POLICY "Admins can manage tags"
ON public.customer_tags FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 小幫手可以查看標籤
CREATE POLICY "Helpers can view tags"
ON public.customer_tags FOR SELECT
USING (has_role(auth.uid(), 'helper'::app_role));

-- 管理員可以管理標籤分配
CREATE POLICY "Admins can manage tag assignments"
ON public.customer_tag_assignments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 小幫手可以查看標籤分配
CREATE POLICY "Helpers can view tag assignments"
ON public.customer_tag_assignments FOR SELECT
USING (has_role(auth.uid(), 'helper'::app_role));

-- 管理員可以管理互動紀錄
CREATE POLICY "Admins can manage interactions"
ON public.customer_interactions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 小幫手可以查看和新增互動紀錄
CREATE POLICY "Helpers can view interactions"
ON public.customer_interactions FOR SELECT
USING (has_role(auth.uid(), 'helper'::app_role));

CREATE POLICY "Helpers can create interactions"
ON public.customer_interactions FOR INSERT
WITH CHECK (has_role(auth.uid(), 'helper'::app_role));

-- 管理員可以管理跟進提醒
CREATE POLICY "Admins can manage follow-ups"
ON public.customer_follow_ups FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 小幫手可以查看和新增跟進提醒
CREATE POLICY "Helpers can view follow-ups"
ON public.customer_follow_ups FOR SELECT
USING (has_role(auth.uid(), 'helper'::app_role));

CREATE POLICY "Helpers can create follow-ups"
ON public.customer_follow_ups FOR INSERT
WITH CHECK (has_role(auth.uid(), 'helper'::app_role));

CREATE POLICY "Helpers can update own follow-ups"
ON public.customer_follow_ups FOR UPDATE
USING (has_role(auth.uid(), 'helper'::app_role) AND created_by = auth.uid());

-- 建立索引提升查詢效能
CREATE INDEX idx_customer_interactions_customer ON public.customer_interactions(customer_id);
CREATE INDEX idx_customer_interactions_date ON public.customer_interactions(interaction_date DESC);
CREATE INDEX idx_customer_follow_ups_customer ON public.customer_follow_ups(customer_id);
CREATE INDEX idx_customer_follow_ups_due_date ON public.customer_follow_ups(due_date);
CREATE INDEX idx_customer_follow_ups_status ON public.customer_follow_ups(status);
CREATE INDEX idx_customer_tag_assignments_customer ON public.customer_tag_assignments(customer_id);

-- 插入預設標籤
INSERT INTO public.customer_tags (name, color, description) VALUES
('VIP', '#eab308', 'VIP 貴賓客戶'),
('潛在客戶', '#3b82f6', '有興趣但尚未成交'),
('已成交', '#22c55e', '已完成交易的客戶'),
('需跟進', '#f97316', '需要主動跟進聯繫'),
('高價值', '#a855f7', '高價值客戶'),
('新客戶', '#06b6d4', '最近加入的新客戶');