import { createClient } from "@supabase/supabase-js";

// Check if we have real Supabase credentials (not placeholder values)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const hasRealSupabaseConfig = supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-supabase-url") &&
  supabaseUrl.startsWith("https://");

// Only create Supabase client if we have real credentials
export const supabase = hasRealSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Fallback for local dev without Supabase

// Type definitions for auth
export type AuthUser = {
  id: string;
  email: string;
  username?: string;
};
