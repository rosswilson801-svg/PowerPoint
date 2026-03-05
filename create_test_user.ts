import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oumdlwflmzniiarrvnjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bWRsd2ZsbXpuaWlhcnJ2bmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODU1MTAsImV4cCI6MjA4NTY2MTUxMH0.iWgujy86Ep7t-NpZqum36qNSdBUvFcbvllcEazeu008';

const supabase = createClient(supabaseUrl, supabaseKey);

const guesses = ['password', 'Password', 'password123', 'clarity', 'Clarity123', 'admin', 'admin123'];

async function tryPasswords() {
    for (const pw of guesses) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'clarity@graeme.icu',
            password: pw,
        });
        if (!error && data.user) {
            console.log(`✅ SUCCESS! Password is: "${pw}"`);
            return;
        } else {
            console.log(`❌ Not: "${pw}"`);
        }
    }
    console.log('\nNone of the guesses worked. Need to reset via Supabase dashboard.');
}

tryPasswords();
