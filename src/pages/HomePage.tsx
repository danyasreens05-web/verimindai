import {
  Brain, Shield, Search, CheckCircle2, AlertTriangle, BarChart3,
  Eye, Users, Zap, ArrowRight, Database, GitBranch, Cpu,
  TrendingUp, FileSearch, Lock, Activity, ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'analyze' | 'results') => void;
}

const WORKFLOW_STEPS = [
  {
    num: 1, icon: Search, color: 'blue',
    title: 'User Input',
    desc: 'Accept financial questions, company analysis requests, or AI-generated outputs for evaluation.',
  },
  {
    num: 2, icon: Brain, color: 'cyan',
    title: 'AI Reasoning Layer',
    desc: 'LLM generates financial summaries, risk analysis, assumptions, and strategic insights with guardrails applied.',
  },
  {
    num: 3, icon: FileSearch, color: 'teal',
    title: 'Claim Extraction',
    desc: 'Extract verifiable factual claims: revenue figures, ratios, growth rates, market assumptions.',
  },
  {
    num: 4, icon: Database, color: 'green',
    title: 'Verification Layer',
    desc: 'Cross-check claims against financial reports, structured datasets, and rule-based validation.',
  },
  {
    num: 5, icon: AlertTriangle, color: 'amber',
    title: 'Hallucination Detection',
    desc: 'Flag unverifiable statements, fabricated numbers, misleading confidence, and weak reasoning chains.',
  },
  {
    num: 6, icon: BarChart3, color: 'orange',
    title: 'Reliability Scoring',
    desc: 'Generate confidence scores, hallucination risk ratings, evidence coverage and consistency metrics.',
  },
  {
    num: 7, icon: Eye, color: 'blue',
    title: 'Explainability Layer',
    desc: 'Explain why outputs were trusted or flagged, where uncertainty exists, and where human review is needed.',
  },
];

const GUARDRAILS = [
  { icon: Lock, text: 'No fabricated financial data', color: 'emerald' },
  { icon: AlertTriangle, text: 'Explicit uncertainty acknowledgement', color: 'amber' },
  { icon: CheckCircle2, text: 'Evidence-grounded claims only', color: 'blue' },
  { icon: Activity, text: 'Contradiction detection', color: 'cyan' },
  { icon: Users, text: 'Human review checkpoints', color: 'orange' },
  { icon: GitBranch, text: 'Assumption tracking', color: 'teal' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Hallucination Detection',
    desc: 'Multi-layer analysis identifies fabricated metrics, unsupported claims, and overconfident projections with severity ratings.',
    color: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Reliability Scoring',
    desc: 'Composite scores across evidence coverage, reasoning consistency, claim verification, and confidence calibration.',
    color: 'blue',
  },
  {
    icon: Eye,
    title: 'Explainable AI',
    desc: 'Every trust or flag decision includes reasoning traces, explaining the "why" behind each assessment.',
    color: 'cyan',
  },
  {
    icon: Users,
    title: 'Human Oversight',
    desc: 'Structured review points identify where AI reasoning is incomplete, incorrect, or requires expert validation.',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'AI Guardrails',
    desc: 'Negative prompting, uncertainty disclosure, and source grounding requirements embedded in reasoning pipeline.',
    color: 'teal',
  },
  {
    icon: Cpu,
    title: 'Sustainability Layer',
    desc: 'Token efficiency metrics and model size recommendations promote energy-aware, responsible AI deployment.',
    color: 'orange',
  },
];

const colorMap: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const iconBg: Record<string, string> = {
  blue: 'bg-blue-500/15 text-blue-400',
  cyan: 'bg-cyan-500/15 text-cyan-400',
  teal: 'bg-teal-500/15 text-teal-400',
  green: 'bg-emerald-500/15 text-emerald-400',
  amber: 'bg-amber-500/15 text-amber-400',
  orange: 'bg-orange-500/15 text-orange-400',
  emerald: 'bg-emerald-500/15 text-emerald-400',
};

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6">
              <Shield size={12} />
              Reliability-Aware AI Framework
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-none">
              <span className="text-white">VeriMind</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> AI</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-4 leading-relaxed">
              A Reliability-Aware Financial Reasoning and Hallucination Detection Framework
            </p>

            <p className="text-base text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Not a finance chatbot. A structured system for responsible AI collaboration — verifying claims, detecting hallucinations, scoring reliability, and enforcing human oversight in AI-generated financial reasoning.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate('analyze')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 text-sm"
              >
                <Brain size={16} />
                Launch Analyzer
                <ArrowRight size={16} />
              </button>
              <a
                href="#workflow"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all text-sm border border-slate-700"
              >
                Explore Workflow
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: '7', label: 'Pipeline Stages', sub: 'end-to-end' },
              { value: '6+', label: 'AI Guardrails', sub: 'enforced' },
              { value: '4', label: 'Score Dimensions', sub: 'reliability' },
              { value: '100%', label: 'Explainable', sub: 'decisions' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-300">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="py-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">7-Stage Verification Pipeline</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every financial query passes through a structured, explainable pipeline — from raw input to reliability-scored, human-reviewed output.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-slate-700 to-transparent -translate-x-1/2" />

            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-0">
              {WORKFLOW_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isLeft = idx % 2 === 0;
                return (
                  <div key={step.num} className={`lg:flex lg:items-center lg:gap-8 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <div className={`lg:w-1/2 ${isLeft ? 'lg:text-right lg:pr-12' : 'lg:pl-12'} mb-4 lg:mb-8`}>
                      <div className={`inline-flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all max-w-sm ${isLeft ? 'lg:ml-auto' : ''}`}>
                        <div className={`p-2 rounded-lg flex-shrink-0 ${iconBg[step.color]}`}>
                          <Icon size={18} />
                        </div>
                        <div className={isLeft ? 'lg:text-right' : ''}>
                          <div className="text-xs text-slate-500 font-medium mb-0.5">Stage {step.num}</div>
                          <div className="text-sm font-bold text-white mb-1">{step.title}</div>
                          <div className="text-xs text-slate-400 leading-relaxed">{step.desc}</div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:flex w-8 h-8 rounded-full bg-slate-900 border-2 border-blue-500/40 items-center justify-center flex-shrink-0 z-10 mx-auto">
                      <span className="text-xs font-bold text-blue-400">{step.num}</span>
                    </div>

                    <div className="lg:w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Core System Capabilities</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every component designed to improve trustworthiness, explainability, and human oversight of AI-generated financial reasoning.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${iconBg[f.color]}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guardrails */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-5">
                <Shield size={12} />
                AI Safety Mechanisms
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Built-in AI Guardrails
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                VeriMind embeds safety mechanisms directly into the reasoning pipeline — not as an afterthought, but as structural constraints that shape every AI output from the first token.
              </p>
              <p className="text-slate-400 leading-relaxed text-sm">
                Guardrail violations are tracked, logged, and surfaced to human reviewers. The system demonstrates responsible AI usage by treating AI as a reasoning collaborator — not a final authority.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GUARDRAILS.map(g => {
                const Icon = g.icon;
                return (
                  <div key={g.text} className={`p-4 rounded-xl border ${colorMap[g.color]} flex items-start gap-3`}>
                    <Icon size={16} className="mt-0.5 flex-shrink-0" />
                    <span className="text-xs font-medium leading-snug">{g.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Research framing */}
      <section className="py-20 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-800/30">
            <TrendingUp className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-4">Research Question</h2>
            <blockquote className="text-lg text-slate-300 italic leading-relaxed mb-6 max-w-2xl mx-auto">
              "How can AI-generated financial reasoning be made more reliable, explainable, and hallucination-aware through structured verification workflows and human oversight?"
            </blockquote>
            <p className="text-slate-500 text-sm mb-8">
              VeriMind AI is positioned not as an AI finance chatbot, but as a reliability-aware reasoning framework for trustworthy financial and educational decision support.
            </p>
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm"
            >
              Experience the Framework
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <Brain size={13} className="text-white" />
            </div>
            <span className="text-slate-400 text-sm font-semibold">VeriMind AI</span>
          </div>
          <p className="text-slate-600 text-xs text-center">
            Reliability-Aware AI Financial Reasoning and Hallucination Detection Framework
          </p>
        </div>
      </footer>
    </div>
  );
}
