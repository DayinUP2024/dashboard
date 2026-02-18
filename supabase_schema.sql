-- Piktag Mission Control: Database Schema

-- 1. Features Table
CREATE TABLE IF NOT EXISTS public.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Idea' CHECK (status IN ('Idea', 'In Progress', 'Review', 'Live')),
    assigned_to TEXT, -- Partner name or Agent ID
    progress_pct INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Version Records Table
CREATE TABLE IF NOT EXISTS public.versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_tag TEXT,
    commit_hash TEXT,
    change_summary TEXT NOT NULL,
    author TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Collaboration Logs (AntiGravity Sync)
CREATE TABLE IF NOT EXISTS public.collaboration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    file_path TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.features;
ALTER PUBLICATION supabase_realtime ADD TABLE public.versions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collaboration_logs;
