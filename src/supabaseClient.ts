import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Les variables VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquent dans l\'environnement.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
