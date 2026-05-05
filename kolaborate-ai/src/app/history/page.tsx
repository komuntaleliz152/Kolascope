"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FileText, BarChart3, Trash2, ChevronDown, ChevronUp, Copy, CheckCheck, Search } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Proposal {
  id: string;
  job_brief: string;
  freelancer_bio: string;
  tone: string;
  proposal: string;
  created_at: string;
}

interface ScopeEstimate {
  id: string;
  project_desc: string;
  hourly_rate: string;
  result: {
    summary: string;
    tasks: { name: string; hours: string; complexity: string }[];
    totalHours: string;
    suggestedRate: string;
    estimatedBudget: string;
  };
  created_at: string;
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [estimates, setEstimates] = useState<ScopeEstimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"proposals" | "estimates">("proposals");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/");
        return;
      }
      setUser(data.user);
      loadData();
    });
  }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: p }, { data: e }] = await Promise.all([
      supabase.from("proposals").select("*").order("created_at", { ascending: false }),
      supabase.from("scope_estimates").select("*").order("created_at", { ascending: false }),
    ]);
    if (p) setProposals(p);
    if (e) setEstimates(e);
    setLoading(false);
  }

  async function deleteProposal(id: string) {
    await supabase.from("proposals").delete().eq("id", id);
    setProposals(proposals.filter((p) => p.id !== id));
  }

  async function deleteEstimate(id: string) {
    await supabase.from("scope_estimates").delete().eq("id", id);
    setEstimates(estimates.filter((e) => e.id !== id));
  }

  async function copyProposal(proposal: string, id: string) {
    await navigator.clipboard.writeText(proposal);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const complexityStyle = (c: string) => {
    if (c === "Low") return "bg-green-500/10 text-green-400 border border-green-500/20";
    if (c === "Medium") return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    return "bg-red-500/10 text-red-400 border border-red-500/20";
  };

  const filteredProposals = proposals.filter((p) =>
    p.job_brief.toLowerCase().includes(search.toLowerCase()) ||
    p.proposal.toLowerCase().includes(search.toLowerCase()) ||
    p.tone.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEstimates = estimates.filter((e) =>
    e.project_desc.toLowerCase().includes(search.toLowerCase()) ||
    e.result.summary?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">History</h1>
        <p className="text-white/50">Your saved proposals and scope estimates.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search proposals and estimates..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-2.5 text-white/30 hover:text-white text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("proposals")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            activeTab === "proposals"
              ? "bg-violet-600 border-violet-500 text-white"
              : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
          }`}
        >
          <FileText className="w-4 h-4" />
          Proposals ({filteredProposals.length})
        </button>
        <button
          onClick={() => setActiveTab("estimates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            activeTab === "estimates"
              ? "bg-violet-600 border-violet-500 text-white"
              : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Scope Estimates ({filteredEstimates.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30">Loading...</div>
      ) : activeTab === "proposals" ? (
        <div className="space-y-3">
          {filteredProposals.length === 0 ? (
            <div className="text-center py-20 text-white/30 border-2 border-dashed border-white/10 rounded-2xl">
              {search ? `No proposals matching "${search}"` : <>No proposals yet. Go to <a href="/proposal" className="text-violet-400 hover:underline">Proposal Writer</a> to create one.</>}
            </div>
          ) : (
            filteredProposals.map((p) => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{p.job_brief.slice(0, 80)}...</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-violet-400">{p.tone}</span>
                      <span className="text-xs text-white/30">{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => copyProposal(p.proposal, p.id)}
                      className="p-2 text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                    >
                      {copied === p.id ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                      className="p-2 text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                    >
                      {expanded === p.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteProposal(p.id)}
                      className="p-2 text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {expanded === p.id && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-4">
                    <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{p.proposal}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEstimates.length === 0 ? (
            <div className="text-center py-20 text-white/30 border-2 border-dashed border-white/10 rounded-2xl">
              {search ? `No estimates matching "${search}"` : <>No estimates yet. Go to <a href="/scope" className="text-violet-400 hover:underline">Scope Estimator</a> to create one.</>}
            </div>
          ) : (
            filteredEstimates.map((e) => (
              <div key={e.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{e.project_desc.slice(0, 80)}...</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-violet-400">{e.result.totalHours}h · ${e.result.estimatedBudget}</span>
                      <span className="text-xs text-white/30">{new Date(e.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                      className="p-2 text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                    >
                      {expanded === e.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteEstimate(e.id)}
                      className="p-2 text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {expanded === e.id && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-3">
                    <p className="text-sm text-white/50">{e.result.summary}</p>
                    <div className="space-y-2">
                      {e.result.tasks.map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg">
                          <span className="text-xs text-white/70">{task.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40">{task.hours}h</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${complexityStyle(task.complexity)}`}>
                              {task.complexity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-violet-600/10 border border-violet-500/20 rounded-lg">
                        <p className="text-xs text-white/40">Hours</p>
                        <p className="font-bold text-violet-400 text-sm">{e.result.totalHours}h</p>
                      </div>
                      <div className="text-center p-2 bg-violet-600/10 border border-violet-500/20 rounded-lg">
                        <p className="text-xs text-white/40">Rate</p>
                        <p className="font-bold text-violet-400 text-sm">${e.result.suggestedRate}/hr</p>
                      </div>
                      <div className="text-center p-2 bg-violet-600/10 border border-violet-500/20 rounded-lg">
                        <p className="text-xs text-white/40">Budget</p>
                        <p className="font-bold text-violet-400 text-sm">${e.result.estimatedBudget}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
