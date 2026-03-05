import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oumdlwflmzniiarrvnjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bWRsd2ZsbXpuaWlhcnJ2bmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODU1MTAsImV4cCI6MjA4NTY2MTUxMH0.iWgujy86Ep7t-NpZqum36qNSdBUvFcbvllcEazeu008';

async function checkSchema() {
    const res = await fetch(`${supabaseUrl}/rest/v1/teacher_schedules`, {
        method: 'OPTIONS',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });
    const text = await res.text();
    console.log("OPTIONS:", text);
}
checkSchema();
