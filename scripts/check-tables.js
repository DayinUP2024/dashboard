const { createClient } = require('@supabase/supabase-js');

const url = 'https://fawjpvapjphdqvhdwsxf.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhd2pwdmFwanBoZHF2aGR3c3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MjA3NTUsImV4cCI6MjA4MjM5Njc1NX0.33B95ZtCuNKWY3-RVbVMyf68BLmFfUKOEfbRu9_VTn4';

const supabase = createClient(url, key);

async function verify() {
    console.log('🔍 Verifying tables...');

    // Check products
    const { data: products, error: pErr } = await supabase.from('products').select('*');
    if (pErr) { console.error('❌ products:', pErr.message); }
    else { console.log(`✅ products: ${products.length} rows`, products.map(p => `${p.id} (${p.name})`)); }

    // Check features
    const { data: features, error: fErr } = await supabase.from('features').select('*').limit(1);
    if (fErr) { console.error('❌ features:', fErr.message); }
    else { console.log(`✅ features: table exists (${features.length} rows)`); }

    // Check feedbacks
    const { data: fb, error: fbErr } = await supabase.from('feedbacks').select('*').limit(1);
    if (fbErr) { console.error('❌ feedbacks:', fbErr.message); }
    else { console.log(`✅ feedbacks: table exists`); }

    // Check pipeline_logs
    const { data: pl, error: plErr } = await supabase.from('pipeline_logs').select('*').limit(1);
    if (plErr) { console.error('❌ pipeline_logs:', plErr.message); }
    else { console.log(`✅ pipeline_logs: table exists`); }

    // Check versions
    const { data: v, error: vErr } = await supabase.from('versions').select('*').limit(1);
    if (vErr) { console.error('❌ versions:', vErr.message); }
    else { console.log(`✅ versions: table exists`); }
}

verify();
