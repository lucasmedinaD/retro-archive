
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase Env Vars in .env.local');
    process.exit(1);
}

async function diagnose() {
    console.log('🔍 Starting Supabase Diagnostics...');
    console.log(`URL: ${supabaseUrl}`);

    // 1. Test Public Access (Anon Key)
    console.log('\n--- Testing Public Access (Anon Key) ---');
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const { data: publicData, error: publicError } = await supabaseAnon
        .from('transformations')
        .select('id, character_name, series')
        .limit(5);

    if (publicError) {
        console.error('❌ Public Access Failed:', publicError.message);
    } else {
        console.log(`✅ Public Access Success. Found ${publicData.length} items.`);
        if (publicData.length > 0) {
            console.table(publicData);
        } else {
            console.warn('⚠️ No items found via Public Access. Table might be empty or RLS blocking.');
        }
    }

    // 2. Test Admin Access (Service Role)
    if (serviceRoleKey) {
        console.log('\n--- Testing Admin Access (Service Role) ---');
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
        const { data: adminData, error: adminError } = await supabaseAdmin
            .from('transformations')
            .select('id, character_name, series')
            .limit(5);

        if (adminError) {
            console.error('❌ Admin Access Failed:', adminError.message);
        } else {
            console.log(`✅ Admin Access Success. Found ${adminData.length} items.`);
            if (adminData.length > 0) {
                console.table(adminData);
            } else {
                console.warn('⚠️ No items found via Admin Access. The table is definitely empty.');
            }
        }
    } else {
        console.log('\n⚠️ Skipping Admin Test (Missing SUPABASE_SERVICE_ROLE_KEY)');
    }
}

diagnose();
