"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalWriter from "@/components/ProposalWriter";
import ScopeEstimator from "@/components/ScopeEstimator";
import { Sparkles, PenLine, BarChart3 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("proposal");

  return (
    <main className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Kolaborate AI</span>
            <span className="text-xs bg-violet-600/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <p className="text-sm text-white/40 hidden sm:block">AI toolkit for freelancers</p>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs px-3 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3 h-3" />
          Kolaborate Build Challenge · April 2026
        </div>
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
              value="proposal"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/50 rounded-lg px-6 py-2 text-sm font-medium transition-all"
            >
              <PenLine className="w-3.5 h-3.5 mr-2" /> Proposal Writer
            </TabsTrigger>
            <TabsTrigger
              value="scope"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/50 rounded-lg px-6 py-2 text-sm font-medium transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 mr-2" /> Scope Estimator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposal">
            <ProposalWriter />
          </TabsContent>

          <TabsContent value="scope">
            <ScopeEstimator />
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-white/20 py-8 border-t border-white/5">
        Kolaborate AI · April 2026
      </footer>
    </main>
  );
}
