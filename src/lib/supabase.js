import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wsandsmjztyznzoronhj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzYW5kc21qenR5em56b3JvbmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTY2NTQsImV4cCI6MjA2NjY3MjY1NH0.Gyif7gjnjiqg8g2cIXqGXuU8UQYMtjfC4I986jlfxnQ'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;