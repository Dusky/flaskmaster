"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "./supabase";

interface AuthContextType {
  user: AuthUser | null;
  session: null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<AuthUser | null>(null);
  const [loading] = useState(false);
  const router = useRouter();

  // NO AUTH - disabled

  const signIn = async (_email: string, _password: string) => {
    return { error: "Authentication is currently disabled." };
  };

  const signUp = async (_email: string, _password: string, _username: string) => {
    return { error: "Authentication is currently disabled." };
  };

  const signOut = async () => {
    // No auth to sign out from
  };

  return (
    <AuthContext.Provider value={{ user, session: null, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
