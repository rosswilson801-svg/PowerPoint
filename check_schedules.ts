import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oumdlwflmzniiarrvnjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bWRsd2ZsbXpuaWlhcnJ2bmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODU1MTAsImV4cCI6MjA4NTY2MTUxMH0.iWgujy86Ep7t-NpZqum36qNSdBUvFcbvllcEazeu008';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchedules() {
    console.log("Checking teacher_schedules table...");
    const { data, error } = await supabase.from('teacher_schedules').select('*');
    if (error) {
        console.error("Error fetching schedules:", error);
    } else {
        console.log(`Found ${data.length} schedules in the database.`);
        if (data.length > 0) {
            console.log("Sample schedules:");
            console.log(data.slice(0, 5));
        }
    }
}

checkSchedules();
