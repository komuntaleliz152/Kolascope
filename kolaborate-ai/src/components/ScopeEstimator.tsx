"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3, AlertTriangle, Trash2, RefreshCw } from "lucide-react";

interface ScopeResult {
  summary: string;
  tasks: { name: string; hours: string; complexity: "Low" | "Medium" | "High" }[];
  totalHours: string;
  suggestedRate: string;
  estimatedBudget: string;
  risks: string[];
}

export default function ScopeEstimator() {
  const [projectDesc, setProjectDesc] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [result, setResult] = useState<ScopeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  async function estimateScope() {
    if (!projectDesc.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setVisible(false);

    try {
      const res = await fetch("/api/scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectDesc, hourlyRate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.scope);
      setTimeout(() => setVisible(true), 50);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to estimate scope");
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setProjectDesc("");
    setHourlyRate("");
    setResult(null);
    setError("");
    setVisible(false);
  }

  const complexityStyle = (c: string) => {
    if (c === "Low") return "bg-green-500/10 text-green-400 border border-green-500/20";
    if (c === "Medium") return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    return "bg-red-500/10 text-red-400 border border-red-500/20";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-violet-400" /> Project Details
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Describe the project <span className="text-red-400">*</span></label>
          <Textarea
            placeholder="e.g. Build a landing page with a contact form, integrate with Mailchimp, mobile responsive, 3 sections..."
            className="min-h-[180px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 rounded-xl"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">
            Hourly rate (USD) <span className="text-xs text-white/30 ml-1">optional</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 50"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500 transition-colors"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={estimateScope}
            disabled={loading || !projectDesc.trim()}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 font-medium"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Estimating...</>
            ) : (
              <><BarChart3 className="w-4 h-4 mr-2" /> Estimate Scope</>
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
      </div>

      {/* Output */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Scope Breakdown</h2>
            </div>
            {result && (
              <button
                onClick={estimateScope}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                title="Regenerate"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
            )}
          </div>
        </div>

        {result ? (
          <div className={`space-y-4 flex-1 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            <p className="text-sm text-white/50 bg-white/5 rounded-xl p-3">{result.summary}</p>

            {/* Tasks */}
            <div className="space-y-2">
              {result.tasks.map((task, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm text-white/80">{task.name}</span>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs text-white/40">{task.hours}h</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${complexityStyle(task.complexity)}`}>
                      {task.complexity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                <p className="text-xs text-white/40 mb-1">Total Hours</p>
                <p className="font-bold text-violet-400">{result.totalHours}h</p>
              </div>
              <div className="text-center p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                <p className="text-xs text-white/40 mb-1">Rate/hr</p>
                <p className="font-bold text-violet-400">${result.suggestedRate}</p>
              </div>
              <div className="text-center p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                <p className="text-xs text-white/40 mb-1">Budget</p>
                <p className="font-bold text-violet-400">${result.estimatedBudget}</p>
              </div>
            </div>

            {/* Risks */}
            {result.risks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Watch out for</p>
                {result.risks.map((risk, i) => (
                  <div key={i} className="flex gap-2 text-xs text-yellow-400/80 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {risk}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/10 rounded-xl gap-3">
            <BarChart3 className="w-8 h-8 opacity-30" />
            <p className="text-sm">{loading ? "Analyzing your project..." : "Scope breakdown will appear here"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
