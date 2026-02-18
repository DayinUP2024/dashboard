const fs = require('fs');
const path = require('path');

const accessToken = 'sbp_455a93255392e32bfd6f9c89d90a271eea93ccac';
const projectRef = 'fawjpvapjphdqvhdwsxf';

async function executeSQL() {
    const sqlPath = path.resolve(__dirname, '../supabase_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🚀 Executing schema SQL on Production (fawjpvapjphdqvhdwsxf)...');

    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query: sql }),
    });

    if (response.ok) {
        const result = await response.json();
        console.log('✅ Schema executed successfully!');
        console.log(JSON.stringify(result).substring(0, 300));
    } else {
        const errorText = await response.text();
        console.error('❌ Failed:', response.status, errorText.substring(0, 300));
    }
}

executeSQL();
