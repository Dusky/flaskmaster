// Supabase is NOT being used in this application
// This file is kept for compatibility but returns null
export const supabase = null as any;

// Type definitions for auth
export type AuthUser = {
  id: string;
  email: string;
  username?: string;
};
