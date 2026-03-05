import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = 'https://oumdlwflmzniiarrvnjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bWRsd2ZsbXpuaWlhcnJ2bmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODU1MTAsImV4cCI6MjA4NTY2MTUxMH0.iWgujy86Ep7t-NpZqum36qNSdBUvFcbvllcEazeu008';

const supabase = createClient(supabaseUrl, supabaseKey);

async function simulatePurchase(schoolName: string, region: string, teacherLimit: number) {
    const token = crypto.randomUUID();
    const { data, error } = await supabase.from('schools').insert({
        name: schoolName,
        region: region,
        teacher_limit: teacherLimit,
        onboarding_token: token
    }).select();

    if (error) {
        console.error("Error creating purchase:", error);
        process.exit(1);
    }

    console.log(`--- ${schoolName} ---`);
    console.log(`Onboarding Link: http://localhost:5173/onboarding?token=${token}\n`);
    return token;
}

async function run() {
    console.log("Simulating WooCommerce purchases...\n");

    // Create a small one for the AI to test
    await simulatePurchase("AI Test Academy", "UK", 3);

    // Create the 10-pack for the user
    await simulatePurchase("Test School (10 Teacher Pack)", "UK", 10);
}

run();
