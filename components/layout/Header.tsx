"use client";

import Link from "next/link";

export function Header() {
  // Placeholder values - will connect to auth and currency later
  const userCurrency = 450;
  const isAuthenticated = false;

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
            {isAuthenticated ? (
              <>
                {/* Currency display */}
                <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-gold text-lg">⚡</span>
                  <span className="font-mono text-gold font-bold">
                    {userCurrency}
                  </span>
                </div>

                {/* User menu */}
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                  User ▼
                </button>
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
