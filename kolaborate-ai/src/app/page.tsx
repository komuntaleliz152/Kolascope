"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalWriter from "@/components/ProposalWriter";
import ScopeEstimator from "@/components/ScopeEstimator";
import BriefAnalyzer from "@/components/BriefAnalyzer";
import AuthModal from "@/components/AuthModal";
import { supabase } from "@/lib/supabase";
import { Sparkles, PenLine, BarChart3, LogIn, LogOut, User, FileSearch } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Home() {
  const [activeTab, setActiveTab] = useState("scope");
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
    <main className="min-h-screen bg-[#0f0f1a] text-white">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Kolaborate AI</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">{user.email}</span>
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
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          Win more. Scope better.<br />
          <span className="text-violet-500">Earn smarter.</span>
        </h1>
        <p className="text-white/50 text-lg max-w-lg mx-auto">
          Write winning proposals and estimate project scope in seconds.
        </p>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-white/5 border border-white/10 p-1 rounded-xl w-fit mx-auto flex">
            <TabsTrigger
              value="scope"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/50 rounded-lg px-6 py-2 text-sm font-medium transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 mr-2" /> Scope Estimator
            </TabsTrigger>
            <TabsTrigger
              value="proposal"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/50 rounded-lg px-6 py-2 text-sm font-medium transition-all"
            >
              <PenLine className="w-3.5 h-3.5 mr-2" /> Proposal Writer
            </TabsTrigger>
            <TabsTrigger
              value="analyze"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/50 rounded-lg px-6 py-2 text-sm font-medium transition-all"
            >
              <FileSearch className="w-3.5 h-3.5 mr-2" /> Brief Analyzer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scope">
            <ScopeEstimator user={user} onAuthRequired={() => setShowAuth(true)} />
          </TabsContent>

          <TabsContent value="proposal">
            <ProposalWriter user={user} onAuthRequired={() => setShowAuth(true)} />
          </TabsContent>

          <TabsContent value="analyze">
            <BriefAnalyzer user={user} onAuthRequired={() => setShowAuth(true)} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-white/50 py-8 border-t border-white/10">
        Kolaborate AI · Your freelance toolkit
      </footer>
    </main>
  );
}
