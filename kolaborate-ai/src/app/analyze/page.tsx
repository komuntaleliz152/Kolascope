"use client";

import { useState, useEffect } from "react";
import BriefAnalyzer from "@/components/BriefAnalyzer";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AnalyzePage() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Brief Analyzer</h1>
        <p className="text-white/50">Identify gaps, red flags, and questions before you start work.</p>
      </div>
      <BriefAnalyzer user={user} onAuthRequired={() => setShowAuth(true)} />
    </main>
  );
}
