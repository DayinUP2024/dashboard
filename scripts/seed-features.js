const { createClient } = require('@supabase/supabase-js');

const url = 'https://fawjpvapjphdqvhdwsxf.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhd2pwdmFwanBoZHF2aGR3c3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MjA3NTUsImV4cCI6MjA4MjM5Njc1NX0.33B95ZtCuNKWY3-RVbVMyf68BLmFfUKOEfbRu9_VTn4';

const supabase = createClient(url, key);

async function seedFeatures() {
    console.log('🌱 Seeding features from product PRDs...');

    // ============================================
    // Dating UP Features (from productContext.md)
    // ============================================
    const datingUpFeatures = [
        { product_id: 'dating-up', name: 'Auth System', description: 'Email/Social Login for Moon Gods and Users', status: 'In Progress', progress_pct: 60, priority: 'Critical' },
        { product_id: 'dating-up', name: 'Moon God Dashboard', description: 'Add Friend form (Photo, Name, Age, Bio, Type) + Requests list + Stats', status: 'In Progress', progress_pct: 40, priority: 'Critical' },
        { product_id: 'dating-up', name: 'Browse Feed', description: 'Public profile list with Gender/Age filtering and Connect button', status: 'Backlog', progress_pct: 0, priority: 'High' },
        { product_id: 'dating-up', name: 'Connection Flow', description: 'User clicks Connect → fills note → Moon God gets notification → approve/reject', status: 'Backlog', progress_pct: 0, priority: 'High' },
        { product_id: 'dating-up', name: 'Match Verification', description: '"We are a couple!" button for Moon God to increment Karma score', status: 'Backlog', progress_pct: 0, priority: 'Medium' },
        { product_id: 'dating-up', name: 'Supabase Setup', description: 'Database schema, RLS policies, API keys configuration', status: 'Backlog', progress_pct: 0, priority: 'Critical' },
        { product_id: 'dating-up', name: 'UI/UX Design', description: 'Mobile-responsive layout with modern design system', status: 'In Progress', progress_pct: 50, priority: 'High' },
        { product_id: 'dating-up', name: 'Profile Management', description: 'Moon God creates/edits friend profiles with photos and preferences', status: 'Backlog', progress_pct: 0, priority: 'High' },
    ];

    // ============================================
    // DayinUPUP Features (from productContext.md)
    // ============================================
    const dayinupFeatures = [
        { product_id: 'dayinup', name: 'JWT Auth & Session', description: 'JWT-based authentication and session management', status: 'In Progress', progress_pct: 70, priority: 'Critical' },
        { product_id: 'dayinup', name: 'User Management', description: 'Profile CRUD and avatar uploads (GCS)', status: 'In Progress', progress_pct: 50, priority: 'Critical' },
        { product_id: 'dayinup', name: 'Chat System', description: 'Real-time chat functionality between users', status: 'Backlog', progress_pct: 0, priority: 'High' },
        { product_id: 'dayinup', name: 'Activity Feed', description: 'Social activity feed for user interactions', status: 'Backlog', progress_pct: 0, priority: 'Medium' },
        { product_id: 'dayinup', name: 'Job Board & Matchmaking', description: 'AI-driven job search and freelancer-hirer matching', status: 'Backlog', progress_pct: 0, priority: 'Critical' },
        { product_id: 'dayinup', name: 'Contract Management', description: 'Contract creation, milestone tracking, and management', status: 'Backlog', progress_pct: 0, priority: 'High' },
        { product_id: 'dayinup', name: 'Payment Integration', description: 'NewebPay payment integration for contracts', status: 'Backlog', progress_pct: 0, priority: 'High' },
        { product_id: 'dayinup', name: 'Backend API', description: 'RESTful API with <200ms p95 response time', status: 'In Progress', progress_pct: 40, priority: 'Critical' },
        { product_id: 'dayinup', name: 'Database Migrations', description: 'Supabase schema and migration management', status: 'Backlog', progress_pct: 0, priority: 'High' },
        { product_id: 'dayinup', name: 'Frontend (Vercel)', description: 'Next.js frontend deployed on Vercel', status: 'In Progress', progress_pct: 30, priority: 'High' },
    ];

    // Clear existing features first
    console.log('🗑️ Clearing old features...');
    const { error: delErr1 } = await supabase.from('features').delete().eq('product_id', 'dating-up');
    const { error: delErr2 } = await supabase.from('features').delete().eq('product_id', 'dayinup');
    if (delErr1) console.error('Delete error (dating-up):', delErr1.message);
    if (delErr2) console.error('Delete error (dayinup):', delErr2.message);

    // Insert Dating UP features
    console.log('📥 Inserting Dating UP features...');
    const { data: d1, error: e1 } = await supabase.from('features').insert(datingUpFeatures).select();
    if (e1) { console.error('❌ Dating UP insert error:', e1.message); }
    else { console.log(`✅ Dating UP: ${d1.length} features inserted`); }

    // Insert DayinUPUP features
    console.log('📥 Inserting DayinUPUP features...');
    const { data: d2, error: e2 } = await supabase.from('features').insert(dayinupFeatures).select();
    if (e2) { console.error('❌ DayinUPUP insert error:', e2.message); }
    else { console.log(`✅ DayinUPUP: ${d2.length} features inserted`); }

    // Summary
    const { data: all } = await supabase.from('features').select('product_id, name, status, priority');
    console.log(`\n📊 Total features: ${all?.length || 0}`);
    all?.forEach(f => console.log(`  [${f.product_id}] ${f.name} — ${f.status} (${f.priority})`));
}

seedFeatures();
