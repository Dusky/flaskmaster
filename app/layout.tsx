import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import "./globals.css";

// Using system fonts to avoid Google Fonts network issues
// These CSS variables are defined in globals.css

export const metadata: Metadata = {
  title: "The Compound - Fantasy Taskmaster",
  description: "A fantasy sports browser game meets Taskmaster. Pick contestants, place bets, watch chaos unfold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
