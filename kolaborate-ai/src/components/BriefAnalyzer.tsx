"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Search, AlertTriangle, CheckCircle, HelpCircle, Lightbulb, Trash2, RefreshCw } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Analysis {
  clarity: "Poor" | "Fair" | "Good" | "Excellent";
  summary: string;
  gaps: string[];
  questions: string[];
  redFlags: string[];
  suggestions: string[];
  readiness: string;
}

interface Props {
  user: User | null;
  onAuthRequired: () => void;
}

export default function BriefAnalyzer({ user, onAuthRequired }: Props) {
  const [brief, setBrief] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  async function analyzeBrief() {
    if (!brief.trim()) return;
    setLoading(true);
    setError("");
    setAnalysis(null);
    setVisible(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setAnalysis(data.analysis);
      setTimeout(() => setVisible(true), 50);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to analyze brief");
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setBrief("");
    setAnalysis(null);
    setError("");
    setVisible(false);
  }

  const clarityColor = (c: string) => {
    if (c === "Excellent") return "text-green-400 bg-green-500/10 border-green-500/20";
    if (c === "Good") return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (c === "Fair") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  const readinessColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-violet-400" /> Brief Analyzer
          </h2>
          <p className="text-sm text-white/40">Paste a client brief to identify gaps and risks before you start</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-white/70">Client Brief <span className="text-red-400">*</span></label>
            <span className="text-xs text-white/30">{brief.length} chars</span>
          </div>
          <Textarea
            placeholder="Paste the client's job description or project brief here..."
            className="min-h-[220px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 rounded-xl"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={analyzeBrief}
            disabled={loading || !brief.trim()}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 font-medium"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Search className="w-4 h-4 mr-2" /> Analyze Brief</>
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
            <button onClick={onAuthRequired} className="text-violet-400 hover:text-violet-300">Sign in</button> to save your analyses
          </p>
        )}
      </div>

      {/* Output */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Analysis</h2>
          {analysis && (
            <button
              onClick={analyzeBrief}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-analyze
            </button>
          )}
        </div>

        {analysis ? (
          <div className={`space-y-4 flex-1 overflow-y-auto max-h-[500px] transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>

            {/* Clarity + Readiness */}
            <div className="flex gap-3">
              <div className={`flex-1 text-center p-3 rounded-xl border ${clarityColor(analysis.clarity)}`}>
                <p className="text-xs opacity-60 mb-1">Clarity</p>
                <p className="font-bold">{analysis.clarity}</p>
              </div>
              <div className="flex-1 text-center p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                <p className="text-xs text-white/40 mb-1">Readiness</p>
                <p className={`font-bold text-2xl ${readinessColor(Number(analysis.readiness))}`}>
                  {analysis.readiness}<span className="text-sm text-white/30">/10</span>
                </p>
              </div>
            </div>

            {/* Summary */}
            <p className="text-sm text-white/50 bg-white/5 rounded-xl p-3">{analysis.summary}</p>

            {/* Gaps */}
            {analysis.gaps.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Missing Information
                </p>
                {analysis.gaps.map((gap, i) => (
                  <div key={i} className="flex gap-2 text-xs text-white/60 bg-white/5 rounded-lg p-2.5">
                    <span className="text-violet-400 shrink-0">•</span> {gap}
                  </div>
                ))}
              </div>
            )}

            {/* Questions */}
            {analysis.questions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Ask the Client
                </p>
                {analysis.questions.map((q, i) => (
                  <div key={i} className="flex gap-2 text-xs text-blue-400/80 bg-blue-500/5 border border-blue-500/10 rounded-lg p-2.5">
                    <span className="shrink-0">{i + 1}.</span> {q}
                  </div>
                ))}
              </div>
            )}

            {/* Red Flags */}
            {analysis.redFlags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Red Flags
                </p>
                {analysis.redFlags.map((flag, i) => (
                  <div key={i} className="flex gap-2 text-xs text-red-400/80 bg-red-500/5 border border-red-500/10 rounded-lg p-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {flag}
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Suggestions
                </p>
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className="flex gap-2 text-xs text-yellow-400/80 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2.5">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/10 rounded-xl gap-3">
            <Search className="w-8 h-8 opacity-30" />
            <p className="text-sm">{loading ? "Analyzing your brief..." : "Analysis will appear here"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
