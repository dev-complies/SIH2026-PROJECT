import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Standard Supabase client instance for client-side and server-side read operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to check if live Supabase service is configured
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    !url.includes("placeholder-project") &&
    anonKey &&
    !anonKey.includes("placeholder-anon-key")
  );
}
