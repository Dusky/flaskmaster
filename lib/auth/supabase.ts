import { createClient } from "@supabase/supabase-js";

// Use placeholder values for local development if not configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxxxxxxxxxxxxxxxxxxxx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder";

// Only create Supabase client if we have real credentials
export const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Fallback for local dev without Supabase

// Type definitions for auth
export type AuthUser = {
  id: string;
  email: string;
  username?: string;
};
