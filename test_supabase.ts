import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oumdlwflmzniiarrvnjn.supabase.co';
const supabaseKey = 'sb_publishable_QcqhDJDPThhubntRiZpwHQ_xmMx-VCR';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Testing supabase...");
    const { data, error } = await supabase.from('teacher_schedules').select('*').limit(1);
    console.log("Data:", data);
    console.log("Error:", error);
}

test();
