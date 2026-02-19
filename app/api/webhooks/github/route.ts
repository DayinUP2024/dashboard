
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'dayinup-secret';

// Helper: Verify Signature
async function verifySignature(req: NextRequest, body: string) {
    const signature = req.headers.get('x-hub-signature-256');
    if (!signature) return false;
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(body).digest('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
    } catch (e) {
        return false;
    }
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();

        // signature verification is recommended for security
        // if (!await verifySignature(req, rawBody)) {
        //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        const payload = JSON.parse(rawBody);

        // Handle "push" event
        if (payload.commits) {
            const repoName = payload.repository.name; // e.g., 'dating-up'
            const branch = payload.ref.replace('refs/heads/', ''); // e.g., 'main'

            console.log(`Received push to ${repoName} (${branch})`);

            // 1. Map repo name to product_id (Using UUIDs from DB)
            let productId = '';

            // Normalize repo name
            const normalizedName = repoName.toLowerCase();

            if (normalizedName.includes('dating-up')) {
                productId = '13ce4743-1678-4504-8b83-a9d948281358'; // Dating UP
            } else if (normalizedName.includes('dayinup-up')) {
                productId = 'a92ba463-bd18-4c8d-8a14-4363294025ad'; // DayinUPUP
            } else if (normalizedName.includes('dashboard')) {
                productId = '5ab49635-4303-469b-8f3a-79659357640a'; // DayinUP Dashboard
            }

            if (!productId) {
                console.log(`No product mapping for repo: ${repoName}`);
                return NextResponse.json({ message: 'Product not found for repo', repo: repoName }, { status: 200 });
            }

            // 2. Process each commit
            for (const commit of payload.commits) {
                const message = commit.message.toLowerCase();
                const author = commit.author.name;

                console.log(`[${productId}] Processing commit: ${message} by ${author}`);

                // A. Log Version/History
                await supabase.from('versions').insert({
                    product_id: productId,
                    version_tag: commit.id.substring(0, 7),
                    commit_hash: commit.id,
                    change_summary: commit.message,
                    author: author,
                    environment: branch === 'main' ? 'production' : 'staging'
                });

                // B. Semantic Progress Update
                const { data: features } = await supabase
                    .from('features')
                    .select('*')
                    .eq('product_id', productId);

                if (features) {
                    for (const feature of features) {
                        // Check if commit message mentions the feature name
                        if (message.includes(feature.name.toLowerCase())) {
                            console.log(`Matched feature: ${feature.name}`);

                            let newStatus = feature.status;
                            let newProgress = feature.progress_pct;

                            // Conventional Commits Logic
                            if (message.startsWith('feat:')) {
                                newStatus = 'In Progress';
                                newProgress = Math.min(newProgress + 15, 90);
                            } else if (message.startsWith('fix:')) {
                                newStatus = 'Testing';
                                newProgress = Math.min(newProgress + 10, 95);
                            } else if (message.includes('finish') || message.includes('complete') || message.includes('done')) {
                                newStatus = 'Staging';
                                newProgress = 100;
                            } else if (message.startsWith('chore:') || message.startsWith('docs:')) {
                                newProgress = Math.min(newProgress + 5, 100);
                            }

                            await supabase
                                .from('features')
                                .update({
                                    status: newStatus,
                                    progress_pct: newProgress,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', feature.id);
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Processed GitHub webhook' });
    } catch (err: any) {
        console.error('Webhook Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
