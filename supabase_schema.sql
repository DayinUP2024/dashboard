-- ============================================
-- DayinUP Command Center: Database Schema v2
-- ============================================

-- 0. Products Table (管理所有產品)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,                    -- e.g. 'dating-up', 'dayinup'
    name TEXT NOT NULL,                      -- Display name
    description TEXT,
    repo_url TEXT,                            -- GitHub repo URL
    staging_url TEXT,                         -- Staging deployment URL
    production_url TEXT,                      -- Production deployment URL
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'paused')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 1. Features Table (功能追蹤)
CREATE TABLE IF NOT EXISTS public.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Backlog' CHECK (status IN ('Backlog', 'In Progress', 'Testing', 'Staging', 'Live')),
    assigned_to TEXT,
    progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Version Records Table (版本紀錄)
CREATE TABLE IF NOT EXISTS public.versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id),
    version_tag TEXT NOT NULL,
    commit_hash TEXT,
    change_summary TEXT NOT NULL,
    author TEXT,
    environment TEXT DEFAULT 'staging' CHECK (environment IN ('staging', 'production')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Feedback Table (評論與截圖)
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id),
    feature_id UUID REFERENCES public.features(id),
    author TEXT NOT NULL DEFAULT 'Partner',
    text TEXT NOT NULL,
    screenshot_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'fixing', 'staged', 'verified', 'deployed', 'rejected'
    )),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Pipeline Logs Table (自動化流水線紀錄)
CREATE TABLE IF NOT EXISTS public.pipeline_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id),
    feedback_id UUID REFERENCES public.feedbacks(id),
    stage TEXT NOT NULL CHECK (stage IN (
        'ai_fix', 'unit_test', 'build', 'deploy_staging', 'deploy_production'
    )),
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN (
        'running', 'success', 'failed', 'skipped'
    )),
    logs TEXT,
    duration_ms INTEGER,
    triggered_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Collaboration Logs (協作紀錄)
CREATE TABLE IF NOT EXISTS public.collaboration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES public.products(id),
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_features_product ON public.features(product_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_product ON public.feedbacks(product_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON public.feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_product ON public.pipeline_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_feedback ON public.pipeline_logs(feedback_id);
CREATE INDEX IF NOT EXISTS idx_versions_product ON public.versions(product_id);

-- ============================================
-- Enable Realtime
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.features;
ALTER PUBLICATION supabase_realtime ADD TABLE public.versions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedbacks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pipeline_logs;

-- ============================================
-- Seed Data: DayinUP Products
-- ============================================
INSERT INTO public.products (id, name, description, repo_url) VALUES
('dating-up', 'Dating UP', 'Moon God matchmaking platform - 月老交友配對', 'https://github.com/DayinUP2024/dating-up'),
('dayinup', 'DayinUPUP', 'Freelancer ecosystem - 自由工作者媒合平台', 'https://github.com/DayinUP2024/dayinup-up')
ON CONFLICT (id) DO NOTHING;
