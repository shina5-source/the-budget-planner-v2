import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xabtpqjbbbkgqhljffrl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhYnRwcWpiYmJrZ3FobGpmZnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTYwMzQsImV4cCI6MjA4MDMzMjAzNH0.eH9_BG4ZewM9UUMwl8YxuAb2R77g8j2oT75L9CsRuh0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)