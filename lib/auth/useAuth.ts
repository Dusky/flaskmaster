import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  const signIn = async (email: string, password: string) => {
    const result = await nextAuthSignIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: result.error };
    }

    router.push("/");
    return {};
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Registration failed" };
      }

      // Auto sign in after registration
      return await signIn(email, password);
    } catch (error) {
      return { error: "An unexpected error occurred" };
    }
  };

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false });
    router.push("/login");
  };

  return {
    user: session?.user || null,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
