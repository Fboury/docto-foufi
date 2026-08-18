import { createClient } from '@supabase/supabase-js';

// Utilisation d'un cast 'any' pour éviter le blocage du compilateur TS
const env = (import.meta as any).env;

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
