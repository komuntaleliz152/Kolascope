import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-violet-400" />
      </div>
      <h1 className="text-6xl font-extrabold text-violet-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page not found</h2>
      <p className="text-white/40 max-w-sm mb-8">
        This page doesn't exist. Head back to the toolkit and keep building.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
    </main>
  );
}
