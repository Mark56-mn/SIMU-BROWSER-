import { createClient } from '@supabase/supabase-js';

// The environment variable should ideally be mapped through Vite (import.meta.env)
// For this SIMU web frontend demo, we fallback to a safe placeholder structure.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
