"use client";

import { useState, useEffect } from "react";
import ProposalWriter from "@/components/ProposalWriter";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function ProposalPage() {
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
        <h1 className="text-3xl font-bold mb-2">Proposal Writer</h1>
        <p className="text-white/50">Generate a tailored, client-ready proposal in seconds.</p>
      </div>
      <ProposalWriter user={user} onAuthRequired={() => setShowAuth(true)} />
    </main>
  );
}
