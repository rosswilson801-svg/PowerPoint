import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oumdlwflmzniiarrvnjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bWRsd2ZsbXpuaWlhcnJ2bmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODU1MTAsImV4cCI6MjA4NTY2MTUxMH0.iWgujy86Ep7t-NpZqum36qNSdBUvFcbvllcEazeu008';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTestRun() {
    console.log("--- 🕵️ Verifying Test Run Results in Supabase ---\n");

    // 0. Check Auth Users (using service role key if possible, but let's just check profiles as proxy or try admin api)
    // NOTE: Without service_role key, we might not be able to list auth.users directly. We'll rely on profiles.

    // 1. Check Auth Users & Profiles
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('*, schools(name)');
    console.log("👤 User Profiles Registered:");
    if (pErr) console.error(pErr);
    else console.log(JSON.stringify(profiles, null, 2));
    console.log("\n");

    // 2. Check Pending Invitations
    const { data: invites, error: iErr } = await supabase.from('pending_invitations').select('*');
    console.log("✉️ Pending Teacher Invitations:");
    if (iErr) console.error(iErr);
    else console.log(`Found ${invites?.length || 0} invites.`);
    if (invites && invites.length > 0) console.log(JSON.stringify(invites, null, 2));
    console.log("\n");

    // 3. Check Teacher Schedules
    const { data: schedules, error: sErr } = await supabase.from('teacher_schedules').select('*');
    console.log("📅 Scheduled Lessons in Master Schedule:");
    if (sErr) console.error(sErr);
    else console.log(`Found ${schedules?.length || 0} scheduled lessons.`);

    if (schedules && schedules.length > 0) {
        console.log(`Sample of first lesson scheduled:`, schedules[0]);
    }
}

verifyTestRun();
