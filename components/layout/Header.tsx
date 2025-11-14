"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const [userCurrency, setUserCurrency] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch user currency from API
      fetch(`/api/user/${user.id}/currency`)
        .then((res) => res.json())
        .then((data) => setUserCurrency(data.currency))
        .catch(() => setUserCurrency(1000)); // Default if fetch fails
    } else {
      setUserCurrency(null);
    }
  }, [user]);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gold font-sans">
              THE COMPOUND
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/seasons"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Seasons
            </Link>
            <Link
              href="/contestants"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Contestants
            </Link>
            <Link
              href="/bets"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Betting
            </Link>
            <Link
              href="/stats"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Stats
            </Link>
          </nav>

          {/* User section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Currency display */}
                <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-gold text-lg">⚡</span>
                  <span className="font-mono text-gold font-bold">
                    {userCurrency !== null ? userCurrency : "..."}
                  </span>
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {user.username || user.name || user.email?.split("@")[0]} ▼
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-lg shadow-card-hover overflow-hidden">
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-text-primary hover:bg-background transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/my-bets"
                        className="block px-4 py-3 text-text-primary hover:bg-background transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Bets
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 text-danger hover:bg-background transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gold hover:text-[#f7b77e] transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
