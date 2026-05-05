"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, CheckCheck, Wand2, RefreshCw, Trash2, FileText, Briefcase, Handshake, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const TONES = [
  { label: "Professional", icon: <Briefcase className="w-3 h-3" /> },
  { label: "Friendly", icon: <Handshake className="w-3 h-3" /> },
  { label: "Bold", icon: <Zap className="w-3 h-3" /> },
];

interface SavedProposal {
  id: string;
  job_brief?: string;
  brief?: string;
  proposal: string;
  tone: string;
  created_at: string;
}

interface Props {
  user: User | null;
  onAuthRequired: () => void;
}

export default function ProposalWriter({ user, onAuthRequired }: Props) {
  const [jobBrief, setJobBrief] = useState("");
  const [freelancerBio, setFreelancerBio] = useState("");
  const [tone, setTone] = useState("Professional");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<SavedProposal[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      const saved = localStorage.getItem("proposal-history");
      if (saved) setHistory(JSON.parse(saved));
    }
  }, [user]);

  async function loadHistory() {
    const { data } = await supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setHistory(data);
  }

  async function generateProposal() {
    if (!jobBrief.trim()) return;
    setLoading(true);
    setError("");
    setProposal("");
    setVisible(false);

    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobBrief, freelancerBio, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setProposal(data.proposal);
      setTimeout(() => setVisible(true), 50);

      if (user) {
        await supabase.from("proposals").insert({
          user_id: user.id,
          job_brief: jobBrief,
          freelancer_bio: freelancerBio,
          tone,
          proposal: data.proposal,
        });
        loadHistory();
      } else {
        const entry = {
          id: Date.now().toString(),
          brief: jobBrief.slice(0, 60) + "...",
          proposal: data.proposal,
          tone,
          created_at: new Date().toLocaleDateString(),
        };
        const updated = [entry, ...history].slice(0, 5);
        setHistory(updated);
        localStorage.setItem("proposal-history", JSON.stringify(updated));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate proposal");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function clearForm() {
    setJobBrief("");
    setFreelancerBio("");
    setProposal("");
    setError("");
    setVisible(false);
  }

  function loadFromHistory(item: SavedProposal) {
    setProposal(item.proposal);
    setVisible(true);
    setShowHistory(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
              <Wand2 className="w-4 h-4 text-violet-400" /> Job Details
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Proposal Tone</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setTone(t.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    tone === t.label
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-white/70">Job Brief <span className="text-red-400">*</span></label>
              <span className="text-xs text-white/30">{jobBrief.length} chars</span>
            </div>
            <Textarea
              placeholder="Paste the job description or client brief here..."
              className="min-h-[150px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 rounded-xl"
              value={jobBrief}
              onChange={(e) => setJobBrief(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-white/70">Your Bio <span className="text-xs text-white/30 ml-1">optional</span></label>
              <span className="text-xs text-white/30">{freelancerBio.length} chars</span>
            </div>
            <Textarea
              placeholder="e.g. 3 years React dev, built e-commerce apps..."
              className="min-h-[90px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 rounded-xl"
              value={freelancerBio}
              onChange={(e) => setFreelancerBio(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={generateProposal}
              disabled={loading || !jobBrief.trim()}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 font-medium"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Wand2 className="w-4 h-4 mr-2" /> Generate Proposal</>
              )}
            </Button>
            <button
              onClick={clearForm}
              className="px-3 h-11 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!user && (
            <p className="text-xs text-white/30 text-center">
              <button onClick={onAuthRequired} className="text-violet-400 hover:text-violet-300">Sign in</button> to save your proposals
            </p>
          )}
        </div>

        {/* Output */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Proposal</h2>
            </div>
            {proposal && (
              <div className="flex gap-2">
                <button
                  onClick={generateProposal}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  {copied ? <><CheckCheck className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>
            )}
          </div>

          {proposal ? (
            <div
              className={`whitespace-pre-wrap text-sm leading-relaxed text-white/80 bg-white/5 rounded-xl p-4 max-h-[380px] overflow-y-auto flex-1 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              {proposal}
            </div>
          ) : (
            <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/10 rounded-xl gap-3">
              <Wand2 className="w-8 h-8 opacity-30" />
              <p className="text-sm">{loading ? "Writing your proposal..." : "Your proposal will appear here"}</p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors w-full"
          >
            <FileText className="w-4 h-4" />
            Recent Proposals ({history.length})
            <span className="ml-auto text-xs">{showHistory ? "▲ Hide" : "▼ Show"}</span>
          </button>
          {showHistory && (
            <div className="mt-4 space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-white/60 truncate">
                      {item.job_brief ? item.job_brief.slice(0, 60) + "..." : item.brief}
                    </p>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <span className="text-xs text-violet-400">{item.tone}</span>
                      <span className="text-xs text-white/30">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
