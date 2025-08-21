import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * Returns a singleton Supabase client configured from environment variables.
 * Requires REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY to be set in the environment.
 */
let supabaseInstance = null;

export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    // Provide a clear developer-facing error but keep app functional.
    // The UI will also show an error banner when operations fail.
    console.error(`
      Supabase configuration error:
      - URL: ${url ? 'Set' : 'Missing'}
      - Key: ${key ? 'Set' : 'Missing'}
      
      Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in your .env file.
      See assets/supabase.md for setup instructions.
    `);
  }

  // Initialize with default options
  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      enabled: true
    }
  };

  supabaseInstance = createClient(url || '', key || '', options);
  return supabaseInstance;
}

// Helper to check if Supabase is properly configured
export function isSupabaseConfigured() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;
  return Boolean(url && key);
}
