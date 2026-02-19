const { createClient } = require('@supabase/supabase-js');

// Use the Anon Key and URL from Vercel env
const supabaseUrl = 'https://fawjpvapjphdqvhdwsxf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhd2pwdmFwanBoZHF2aGR3c3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MjA3NTUsImV4cCI6MjA4MjM5Njc1NX0.33B95ZtCuNKWY3-RVbVMyf68BLmFfUKOEfbRu9_VTn4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- Checking Products Table ---');
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Products found:', data.length);
        console.table(data);
        // Also log as JSON for easier parsing
        console.log(JSON.stringify(data, null, 2));
    }
}

main();
