import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oumdlwflmzniiarrvnjn.supabase.co';
const supabaseKey = 'sb_publishable_QcqhDJDPThhubntRiZpwHQ_xmMx-VCR';

export const supabase = createClient(supabaseUrl, supabaseKey);
