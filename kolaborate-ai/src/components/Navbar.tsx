"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, BarChart3, PenLine, FileSearch, LogIn, LogOut, User, Clock } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import AuthModal from "@/components/AuthModal";

const navItems = [
  { href: "/scope", label: "Scope Estimator", icon: <BarChart3 className="w-4 h-4" /> },
  { href: "/proposal", label: "Proposal Writer", icon: <PenLine className="w-4 h-4" /> },
  { href: "/analyze", label: "Brief Analyzer", icon: <FileSearch className="w-4 h-4" /> },
  { href: "/history", label: "History", icon: <Clock className="w-4 h-4" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <header className="border-b border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Kolaborate AI</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  pathname === item.href
                    ? "bg-violet-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:block truncate max-w-[140px]">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-1.5 text-xs text-white bg-violet-600 hover:bg-violet-700 px-3 py-1.5 rounded-lg transition-all"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign in
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-t border-white/5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-all ${
                pathname === item.href
                  ? "text-violet-400 border-t-2 border-violet-500"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}
