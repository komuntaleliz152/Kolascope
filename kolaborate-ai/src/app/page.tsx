import Link from "next/link";
import { BarChart3, PenLine, FileSearch, ArrowRight } from "lucide-react";

const tools = [
  {
    href: "/scope",
    icon: <BarChart3 className="w-6 h-6 text-violet-400" />,
    title: "Scope Estimator",
    description: "Describe a project and get a full breakdown of tasks, time estimates, budget range, and risks.",
    cta: "Estimate a project",
  },
  {
    href: "/proposal",
    icon: <PenLine className="w-6 h-6 text-violet-400" />,
    title: "Proposal Writer",
    description: "Paste a job brief and get a tailored, client-ready proposal in seconds. Choose your tone.",
    cta: "Write a proposal",
  },
  {
    href: "/analyze",
    icon: <FileSearch className="w-6 h-6 text-violet-400" />,
    title: "Brief Analyzer",
    description: "Paste a vague client brief and get clarity scores, red flags, and questions to ask before starting.",
    cta: "Analyze a brief",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f1a]">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Win more. Scope better.<br />
          <span className="text-violet-500">Earn smarter.</span>
        </h1>
        <p className="text-white/50 text-xl max-w-xl mx-auto mb-10">
          Three AI tools built for freelancers — scope projects, write proposals, and analyze client briefs in seconds.
        </p>
        <Link
          href="/scope"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
        >
          Get started <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white/5 border border-white/10 hover:border-violet-500/50 rounded-2xl p-6 transition-all hover:bg-white/8"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
                {tool.icon}
              </div>
              <h2 className="text-lg font-semibold mb-2">{tool.title}</h2>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">{tool.description}</p>
              <span className="flex items-center gap-1.5 text-sm text-violet-400 group-hover:gap-2.5 transition-all">
                {tool.cta} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-white/30 py-8 border-t border-white/5">
        Kolaborate AI · Your freelance toolkit
      </footer>
    </main>
  );
}
