import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create initial user if it doesn't exist
async function createInitialUser() {
  const { data: { user }, error } = await supabase.auth.signUp({
    email: 'samsetye',
    password: 'abc123',
  });

  if (error && !error.message.includes('User already registered')) {
    console.error('Error creating initial user:', error);
  }
}

// Call this function when the app initializes
createInitialUser();