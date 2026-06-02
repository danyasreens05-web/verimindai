import { useState } from 'react';
import {
  Brain, Search, CheckCircle2, Loader2, AlertCircle,
  ChevronRight, Shield, Zap, Database, Eye, BarChart3,
  FileSearch, ArrowRight, Info
} from 'lucide-react';
import { useAnalysisEngine } from '../lib/analysisEngine';
import { SAMPLE_QUERIES } from '../data/sampleData';
import type { AnalysisResult, ProcessingStep } from '../types';

interface AnalysisPageProps {
  onComplete: (result: AnalysisResult) => void;
}

const STEP_ICONS = [Search, Brain, FileSearch, Database, AlertCircle, BarChart3, Eye];

const GUARDRAIL_PRESETS = [
  { id: 'no_fabrication', label: 'No fabricated data', defaultOn: true },
  { id: 'uncertainty_ack', label: 'Acknowledge uncertainty', defaultOn: true },
  { id: 'evidence_ground', label: 'Evidence grounding', defaultOn: true },
  { id: 'contradiction', label: 'Contradiction detection', defaultOn: true },
  { id: 'human_review', label: 'Human review flags', defaultOn: true },
  { id: 'neg_prompt', label: 'Negative prompting', defaultOn: false },
];

function StepRow({ step, index }: { step: ProcessingStep; index: number }) {
  const Icon = STEP_ICONS[index] ?? Zap;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
      step.status === 'running' ? 'bg-blue-500/10 border border-blue-500/20' :
      step.status === 'completed' ? 'bg-slate-900/50 border border-slate-800' :
      'border border-transparent opacity-50'
    }`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
        step.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
        step.status === 'running' ? 'bg-blue-500/15 text-blue-400' :
        'bg-slate-800 text-slate-600'
      }`}>
        {step.status === 'completed' ? (
          <CheckCircle2 size={14} />
        ) : step.status === 'running' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Icon size={14} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-slate-300 truncate">{step.name}</div>
        {step.status === 'running' && (
          <div className="text-xs text-blue-400 mt-0.5">Processing...</div>
        )}
        {step.status === 'completed' && step.duration && (
          <div className="text-xs text-slate-600 mt-0.5">{step.duration}ms</div>
        )}
      </div>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
        step.status === 'completed' ? 'bg-emerald-400' :
        step.status === 'running' ? 'bg-blue-400 animate-pulse' :
        'bg-slate-700'
      }`} />
    </div>
  );
}

export default function AnalysisPage({ onComplete }: AnalysisPageProps) {
  const [query, setQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('apple');
  const [guardrails, setGuardrails] = useState<Record<string, boolean>>(
    Object.fromEntries(GUARDRAIL_PRESETS.map(g => [g.id, g.defaultOn]))
  );
  const { isRunning, steps, result, run, reset } = useAnalysisEngine();

  const handleRun = async () => {
    if (!query.trim() && !selectedCompany) return;
    const q = query.trim() || SAMPLE_QUERIES.find(s => s.value === selectedCompany)?.query || '';
    await run(q, selectedCompany);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Analysis Complete</h2>
          <p className="text-slate-400 text-sm mb-6">
            Overall Reliability Score: <span className="text-blue-400 font-bold">{result.scores.overall}%</span>
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onComplete(result)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm"
            >
              View Full Analysis
              <ArrowRight size={15} />
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all text-sm border border-slate-700"
            >
              New Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Brain size={12} />
            VeriMind Analysis Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Financial Reasoning Analyzer</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Submit a financial question or company name. The 7-stage pipeline generates AI reasoning, extracts claims, verifies facts, and detects hallucinations — with full explainability.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: Input panel */}
          <div className="lg:col-span-2 space-y-5">

            {/* Sample queries */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-cyan-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Examples</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {SAMPLE_QUERIES.map(q => (
                  <button
                    key={q.value}
                    onClick={() => { setSelectedCompany(q.value); setQuery(q.query); }}
                    className={`p-3 rounded-lg text-left text-xs transition-all border ${
                      selectedCompany === q.value
                        ? 'bg-blue-600/15 border-blue-500/30 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    <div className="font-semibold mb-0.5">{q.label}</div>
                    <div className="text-slate-500 line-clamp-2">{q.query}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Query input */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Financial Question or Analysis Request
              </label>
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g., 'Analyze whether Apple Inc. is financially healthy and a good investment.'"
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                disabled={isRunning}
              />
              <div className="flex items-center gap-2 mt-2">
                <Info size={12} className="text-slate-600 flex-shrink-0" />
                <span className="text-xs text-slate-600">
                  Demo uses curated sample data for Apple and Tesla analyses with verified claim datasets.
                </span>
              </div>
            </div>

            {/* Guardrails */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-amber-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Guardrails Configuration</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GUARDRAIL_PRESETS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGuardrails(prev => ({ ...prev, [g.id]: !prev[g.id] }))}
                    disabled={isRunning}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-all border text-xs ${
                      guardrails[g.id]
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                      guardrails[g.id] ? 'bg-emerald-500 text-white' : 'bg-slate-700'
                    }`}>
                      {guardrails[g.id] && <CheckCircle2 size={10} />}
                    </div>
                    <span className="font-medium leading-snug">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={isRunning || (!query.trim() && !selectedCompany)}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-blue-500/10"
            >
              {isRunning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Running 7-Stage Pipeline...
                </>
              ) : (
                <>
                  <Brain size={16} />
                  Run VeriMind Analysis
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Right: Pipeline status */}
          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-blue-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pipeline Status</span>
              </div>

              {steps.length === 0 ? (
                <div className="space-y-2">
                  {['User Input Parsing', 'AI Reasoning Generation', 'Claim Extraction', 'Verification Layer', 'Hallucination Detection', 'Reliability Scoring', 'Explainability Generation'].map((name, i) => (
                    <div key={name} className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent opacity-30">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
                        <span className="text-xs text-slate-600">{i + 1}</span>
                      </div>
                      <span className="text-xs text-slate-500">{name}</span>
                    </div>
                  ))}
                  <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                    <p className="text-xs text-slate-500">Configure settings and run analysis to see pipeline execution.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <StepRow key={step.id} step={step} index={idx} />
                  ))}
                  {isRunning && (
                    <div className="mt-3 h-1 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* What to expect */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Analysis Output Includes</div>
              <div className="space-y-2">
                {[
                  { icon: Brain, text: 'AI reasoning with guardrails', color: 'blue' },
                  { icon: FileSearch, text: 'Extracted & verified claims', color: 'cyan' },
                  { icon: AlertCircle, text: 'Hallucination flags with severity', color: 'amber' },
                  { icon: BarChart3, text: 'Multi-dimension reliability scores', color: 'emerald' },
                  { icon: Eye, text: 'Full explainability traces', color: 'teal' },
                  { icon: Shield, text: 'Human review checkpoints', color: 'orange' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-2.5 text-xs text-slate-400">
                      <Icon size={13} className={`text-${item.color}-400 flex-shrink-0`} />
                      {item.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Activity = ({ size, className }: { size: number; className?: string }) => (
  <BarChart3 size={size} className={className} />
);
