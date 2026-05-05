"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, BarChart3, PenLine, FileSearch, LogIn, LogOut, User, Clock, DollarSign, ChevronDown } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import AuthModal from "@/components/AuthModal";

const mainNav = [
  { href: "/scope", label: "Scope Estimator", icon: <BarChart3 className="w-4 h-4" /> },
  { href: "/proposal", label: "Proposal Writer", icon: <PenLine className="w-4 h-4" /> },
  { href: "/analyze", label: "Brief Analyzer", icon: <FileSearch className="w-4 h-4" /> },
  { href: "/rates", label: "Rate Calculator", icon: <DollarSign className="w-4 h-4" /> },
];

const mobileNav = [
  { href: "/scope", label: "Scope", icon: <BarChart3 className="w-4 h-4" /> },
  { href: "/proposal", label: "Proposal", icon: <PenLine className="w-4 h-4" /> },
  { href: "/analyze", label: "Brief", icon: <FileSearch className="w-4 h-4" /> },
  { href: "/rates", label: "Rates", icon: <DollarSign className="w-4 h-4" /> },
  { href: "/history", label: "History", icon: <Clock className="w-4 h-4" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
  }

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <header className="border-b border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base whitespace-nowrap">Kolaborate AI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                  pathname === item.href
                    ? "bg-violet-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth + dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:block max-w-[120px] truncate text-xs">{user.email}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <User className="w-3.5 h-3.5" /> Profile
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Clock className="w-3.5 h-3.5" /> History
                    </Link>
                    <div className="border-t border-white/10" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign out
                    </button>
                  </div>
                )}
              </div>
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
        <div className="lg:hidden flex border-t border-white/5">
          {mobileNav.map((item) => (
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
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}
