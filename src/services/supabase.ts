import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables configured in .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks whether Supabase environment variables have been provided
 * with actual non-placeholder values.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Fallback to safe dummy URL if env is missing so createClient does not crash on module load
const resolvedUrl = (supabaseUrl && supabaseUrl.startsWith('http'))
  ? supabaseUrl
  : 'https://placeholder.supabase.co';

const resolvedAnonKey = supabaseAnonKey || 'placeholder-anon-key';

/**
 * Single reusable Supabase client instance with session persistence.
 */
export const supabase = createClient(resolvedUrl, resolvedAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
