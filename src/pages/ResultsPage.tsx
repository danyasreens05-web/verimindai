import { useState } from 'react';
import {
  Brain, FileSearch, AlertTriangle, BarChart3, Eye, Users, Shield,
  CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp,
  ArrowLeft, Zap, TrendingUp, AlertCircle, Info, Leaf, Clock
} from 'lucide-react';
import type {
  AnalysisResult, FinancialClaim, HallucinationFlag,
  ExplainabilityEntry, HumanReviewPoint, ClaimStatus, SeverityLevel, RiskLevel
} from '../types';
import { useCountUp } from '../lib/analysisEngine';

const TAB_LIST = [
  { id: 'reasoning', icon: Brain, label: 'AI Reasoning' },
  { id: 'claims', icon: FileSearch, label: 'Claims' },
  { id: 'hallucinations', icon: AlertTriangle, label: 'Hallucinations' },
  { id: 'scores', icon: BarChart3, label: 'Reliability' },
  { id: 'explainability', icon: Eye, label: 'Explainability' },
  { id: 'human', icon: Users, label: 'Human Review' },
];

function claimStatusBadge(status: ClaimStatus) {
  const map: Record<ClaimStatus, string> = {
    verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    unverified: 'bg-slate-700/50 text-slate-400 border-slate-600',
    disputed: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    hallucinated: 'bg-red-500/15 text-red-400 border-red-500/20',
  };
  const label: Record<ClaimStatus, string> = {
    verified: 'Verified',
    unverified: 'Unverified',
    disputed: 'Disputed',
    hallucinated: 'Hallucinated',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function severityBadge(severity: SeverityLevel) {
  const map: Record<SeverityLevel, string> = {
    low: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    high: 'bg-red-500/15 text-red-400 border-red-500/20',
    critical: 'bg-red-600/20 text-red-300 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold capitalize ${map[severity]}`}>
      {severity}
    </span>
  );
}

function riskBadge(risk: RiskLevel) {
  const map: Record<RiskLevel, string> = {
    low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    high: 'bg-red-500/15 text-red-400 border-red-500/20',
  };
  return (
    <span className={`px-3 py-1 rounded-full border text-sm font-bold capitalize ${map[risk]}`}>
      {risk} Risk
    </span>
  );
}

function ScoreRing({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' | 'lg' }) {
  const animated = useCountUp(score, 1200, true);
  const sizes = { sm: 64, md: 96, lg: 128 };
  const dim = sizes[size];
  const r = (dim / 2) * 0.8;
  const circ = 2 * Math.PI * r;
  const dash = (animated / 100) * circ;

  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={size === 'lg' ? 10 : 8} />
        <circle
          cx={dim / 2} cy={dim / 2} r={r} fill="none"
          stroke={color} strokeWidth={size === 'lg' ? 10 : 8}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.05s' }}
        />
      </svg>
      <div className="text-center -mt-1" style={{ marginTop: `-${dim * 0.55}px`, marginBottom: `${dim * 0.1}px` }}>
        <div className={`font-black text-white ${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-base'}`}>
          {animated}%
        </div>
      </div>
      {label && (
        <div style={{ marginTop: `${dim * 0.22}px` }} className="text-xs text-slate-400 font-medium text-center max-w-16">{label}</div>
      )}
    </div>
  );
}

function ScoreBar({ label, value, description }: { label: string; value: number; description: string }) {
  const animated = useCountUp(value, 1000, true);
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">{label}</span>
        <span className="text-sm font-bold text-white">{animated}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${animated}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

function ClaimCard({ claim }: { claim: FinancialClaim }) {
  const [expanded, setExpanded] = useState(false);
  const categoryColors: Record<string, string> = {
    revenue: 'text-blue-400 bg-blue-500/10',
    profitability: 'text-emerald-400 bg-emerald-500/10',
    debt: 'text-amber-400 bg-amber-500/10',
    valuation: 'text-cyan-400 bg-cyan-500/10',
    market: 'text-teal-400 bg-teal-500/10',
    growth: 'text-orange-400 bg-orange-500/10',
    other: 'text-slate-400 bg-slate-700/50',
  };
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-200 font-medium leading-relaxed flex-1">{claim.text}</p>
        {claimStatusBadge(claim.status)}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${categoryColors[claim.category]}`}>
          {claim.category}
        </span>
        <div className="flex items-center gap-1">
          <div className="w-20 h-1.5 rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full ${claim.confidence >= 80 ? 'bg-emerald-500' : claim.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${claim.confidence}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{claim.confidence}% conf.</span>
        </div>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? 'Hide details' : 'Show verification details'}
      </button>
      {expanded && (
        <div className="space-y-2 pt-1 border-t border-slate-800">
          {claim.source && (
            <div className="flex items-start gap-2">
              <span className="text-xs text-slate-600 w-12 flex-shrink-0">Source:</span>
              <span className="text-xs text-slate-400">{claim.source}</span>
            </div>
          )}
          {claim.evidence && (
            <div className="flex items-start gap-2">
              <span className="text-xs text-slate-600 w-12 flex-shrink-0">Evidence:</span>
              <span className="text-xs text-slate-400">{claim.evidence}</span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <span className="text-xs text-slate-600 w-12 flex-shrink-0">Note:</span>
            <span className="text-xs text-slate-400 leading-relaxed">{claim.verificationNote}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function HallucinationCard({ flag }: { flag: HallucinationFlag }) {
  const [expanded, setExpanded] = useState(false);
  const typeLabel: Record<string, string> = {
    fabricated_metric: 'Fabricated Metric',
    unsupported_claim: 'Unsupported Claim',
    overconfident: 'Overconfident',
    vague: 'Vague Statement',
    contradictory: 'Contradiction',
    missing_evidence: 'Missing Evidence',
  };
  const typeColor: Record<string, string> = {
    fabricated_metric: 'text-red-400 bg-red-500/10',
    unsupported_claim: 'text-amber-400 bg-amber-500/10',
    overconfident: 'text-orange-400 bg-orange-500/10',
    vague: 'text-blue-400 bg-blue-500/10',
    contradictory: 'text-red-400 bg-red-500/10',
    missing_evidence: 'text-slate-400 bg-slate-700/50',
  };
  return (
    <div className={`p-4 rounded-xl border space-y-3 ${
      flag.severity === 'high' || flag.severity === 'critical'
        ? 'bg-red-950/20 border-red-800/30'
        : flag.severity === 'medium'
        ? 'bg-amber-950/20 border-amber-800/30'
        : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <AlertTriangle size={14} className={`flex-shrink-0 mt-0.5 ${
            flag.severity === 'high' || flag.severity === 'critical' ? 'text-red-400' :
            flag.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
          }`} />
          <p className="text-sm text-slate-200 font-medium leading-relaxed">{flag.text}</p>
        </div>
        {severityBadge(flag.severity)}
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeColor[flag.type]}`}>
          {typeLabel[flag.type]}
        </span>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? 'Hide explanation' : 'View explanation & correction'}
      </button>
      {expanded && (
        <div className="space-y-3 pt-2 border-t border-slate-800/50">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">Explanation</div>
            <p className="text-xs text-slate-400 leading-relaxed">{flag.explanation}</p>
          </div>
          {flag.suggestedCorrection && (
            <div>
              <div className="text-xs font-semibold text-emerald-600 mb-1">Suggested Correction</div>
              <p className="text-xs text-emerald-400/80 leading-relaxed italic">{flag.suggestedCorrection}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExplainabilityCard({ entry }: { entry: ExplainabilityEntry }) {
  const decisionStyle: Record<string, string> = {
    trusted: 'bg-emerald-500/10 border-emerald-500/20',
    flagged: 'bg-red-500/10 border-red-500/20',
    uncertain: 'bg-amber-500/10 border-amber-500/20',
  };
  const DecisionIcon = entry.decision === 'trusted' ? CheckCircle2 :
    entry.decision === 'flagged' ? XCircle : HelpCircle;
  const iconColor = entry.decision === 'trusted' ? 'text-emerald-400' :
    entry.decision === 'flagged' ? 'text-red-400' : 'text-amber-400';
  return (
    <div className={`p-4 rounded-xl border space-y-2.5 ${decisionStyle[entry.decision]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <DecisionIcon size={15} className={`flex-shrink-0 ${iconColor}`} />
          <span className="text-sm font-bold text-white">{entry.subject}</span>
        </div>
        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${
          entry.decision === 'trusted' ? 'text-emerald-400 border-emerald-500/20' :
          entry.decision === 'flagged' ? 'text-red-400 border-red-500/20' :
          'text-amber-400 border-amber-500/20'
        }`}>
          {entry.decision}
        </span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{entry.reasoning}</p>
      {entry.requiresHumanReview && (
        <div className="flex items-center gap-1.5 text-xs text-orange-400">
          <Users size={11} />
          Requires human review
        </div>
      )}
    </div>
  );
}

function HumanReviewCard({ point }: { point: HumanReviewPoint }) {
  const priorityColor: Record<string, string> = {
    high: 'bg-red-500/15 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  };
  return (
    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-orange-400 flex-shrink-0" />
          <span className="text-sm font-bold text-white">{point.area}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${priorityColor[point.priority]}`}>
          {point.priority} priority
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-0.5">AI Conclusion</div>
          <div className="text-xs text-slate-300 italic">"{point.aiConclusion}"</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-amber-600 mb-0.5">Concern</div>
          <p className="text-xs text-slate-400 leading-relaxed">{point.concern}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/20">
          <div className="text-xs font-semibold text-emerald-600 mb-0.5">Recommendation</div>
          <p className="text-xs text-emerald-400/80 leading-relaxed">{point.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

interface ResultsPageProps {
  result: AnalysisResult;
  onBack: () => void;
  onNewAnalysis: () => void;
}

export default function ResultsPage({ result, onBack, onNewAnalysis }: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState('reasoning');
  const overallScore = useCountUp(result.scores.overall, 1200, true);

  const verifiedCount = result.claims.filter(c => c.status === 'verified').length;
  const flaggedCount = result.hallucinationFlags.length;
  const reviewCount = result.humanReviewPoints.filter(h => h.priority === 'high').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3"
            >
              <ArrowLeft size={13} />
              Back to Analyzer
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">{result.company}</h1>
            <p className="text-slate-400 text-sm">{result.query}</p>
            <div className="flex items-center gap-2 mt-2">
              <Clock size={12} className="text-slate-600" />
              <span className="text-xs text-slate-600">
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onNewAnalysis}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all text-sm border border-slate-700"
            >
              New Analysis
            </button>
          </div>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className={`text-3xl font-black mb-0.5 ${
              result.scores.overall >= 80 ? 'text-emerald-400' :
              result.scores.overall >= 60 ? 'text-amber-400' : 'text-red-400'
            }`}>{overallScore}%</div>
            <div className="text-xs text-slate-400 font-semibold">Overall Reliability</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-3xl font-black text-white mb-0.5">{verifiedCount}/{result.claims.length}</div>
            <div className="text-xs text-slate-400 font-semibold">Claims Verified</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className={`text-3xl font-black mb-0.5 ${flaggedCount > 3 ? 'text-red-400' : flaggedCount > 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {flaggedCount}
            </div>
            <div className="text-xs text-slate-400 font-semibold">Hallucination Flags</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className={`mb-0.5 ${result.scores.hallucinationRisk === 'low' ? 'text-emerald-400' : result.scores.hallucinationRisk === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>
              {riskBadge(result.scores.hallucinationRisk)}
            </div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Hallucination Risk</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {TAB_LIST.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="space-y-4">

          {/* Reasoning tab */}
          {activeTab === 'reasoning' && (
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={16} className="text-blue-400" />
                  <span className="text-sm font-bold text-white">AI-Generated Financial Reasoning</span>
                  <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                    <Shield size={11} />
                    Guardrails Applied
                  </div>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  {result.aiReasoning.split('\n\n').map((para, i) => (
                    <p key={i} className="text-slate-300 leading-relaxed mb-4 last:mb-0">{para}</p>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={14} className="text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Key Insights</span>
                  </div>
                  <ul className="space-y-2">
                    {result.keyInsights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Tracked Assumptions</span>
                  </div>
                  <ul className="space-y-2">
                    {result.assumptions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Guardrail violations */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={14} className="text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Guardrail Audit</span>
                </div>
                <div className="space-y-2">
                  {result.guardrailViolations.map(v => (
                    <div key={v.rule} className={`flex items-start gap-3 p-3 rounded-lg border ${
                      v.triggered ? 'bg-red-950/20 border-red-800/30' : 'bg-emerald-950/10 border-emerald-800/20'
                    }`}>
                      {v.triggered
                        ? <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                        : <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
                      <div>
                        <div className="text-xs font-semibold text-slate-300">{v.rule}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{v.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Claims tab */}
          {activeTab === 'claims' && (
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                {(['verified', 'disputed', 'unverified', 'hallucinated'] as ClaimStatus[]).map(s => {
                  const count = result.claims.filter(c => c.status === s).length;
                  return count > 0 ? (
                    <div key={s} className="flex items-center gap-1.5">
                      {claimStatusBadge(s)}
                      <span className="text-xs text-slate-500">{count}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="space-y-3">
                {result.claims.map(claim => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>
            </div>
          )}

          {/* Hallucinations tab */}
          {activeTab === 'hallucinations' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30">
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-amber-300 mb-1">Hallucination Detection Report</div>
                    <p className="text-xs text-amber-400/70 leading-relaxed">
                      {result.hallucinationFlags.length} issue{result.hallucinationFlags.length !== 1 ? 's' : ''} identified across the AI-generated output.
                      High-severity flags require immediate human review before any decision-making use.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {result.hallucinationFlags.map(flag => (
                  <HallucinationCard key={flag.id} flag={flag} />
                ))}
              </div>
            </div>
          )}

          {/* Scores tab */}
          {activeTab === 'scores' && (
            <div className="space-y-5">
              {/* Main score rings */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Reliability Scorecard</div>
                <div className="flex flex-wrap justify-around gap-6">
                  <div className="text-center">
                    <ScoreRing score={result.scores.overall} label="Overall" size="lg" />
                    <div className="mt-2 text-xs text-slate-500">Composite Score</div>
                  </div>
                  <div className="flex gap-6 flex-wrap justify-center">
                    <ScoreRing score={result.scores.evidenceCoverage} label="Evidence" size="md" />
                    <ScoreRing score={result.scores.reasoningConsistency} label="Consistency" size="md" />
                    <ScoreRing score={result.scores.claimVerification} label="Verification" size="md" />
                    <ScoreRing score={result.scores.confidenceCalibration} label="Calibration" size="md" />
                  </div>
                </div>
              </div>

              {/* Score bars */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Breakdown</div>
                <ScoreBar
                  label="Evidence Coverage"
                  value={result.scores.evidenceCoverage}
                  description="Percentage of claims supported by verifiable, cited evidence"
                />
                <ScoreBar
                  label="Reasoning Consistency"
                  value={result.scores.reasoningConsistency}
                  description="Internal logical consistency across the generated analysis"
                />
                <ScoreBar
                  label="Claim Verification"
                  value={result.scores.claimVerification}
                  description="Share of extracted claims that match authoritative sources"
                />
                <ScoreBar
                  label="Confidence Calibration"
                  value={result.scores.confidenceCalibration}
                  description="Alignment between stated confidence and actual verification outcomes"
                />
              </div>

              {/* Hallucination risk */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hallucination Risk Level</span>
                  {riskBadge(result.scores.hallucinationRisk)}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Based on {result.hallucinationFlags.length} detected issues,
                  including {result.hallucinationFlags.filter(f => f.severity === 'high' || f.severity === 'critical').length} high-severity flags.
                  {result.scores.hallucinationRisk === 'medium'
                    ? ' This output requires careful review before use in any financial decision-making context.'
                    : result.scores.hallucinationRisk === 'high'
                    ? ' This output contains material errors and should not be used without thorough expert review.'
                    : ' This output is relatively reliable but still requires standard verification before use.'}
                </p>
              </div>
            </div>
          )}

          {/* Explainability tab */}
          {activeTab === 'explainability' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={14} className="text-cyan-400" />
                  <span className="text-xs font-bold text-white">Decision Trace</span>
                </div>
                <p className="text-xs text-slate-500">
                  For every claim and conclusion, VeriMind explains why it was trusted, flagged, or marked uncertain — enabling transparent, accountable AI reasoning.
                </p>
              </div>
              <div className="space-y-3">
                {result.explainability.map((entry, i) => (
                  <ExplainabilityCard key={i} entry={entry} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {(['trusted', 'flagged', 'uncertain'] as const).map(d => {
                  const count = result.explainability.filter(e => e.decision === d).length;
                  const color = d === 'trusted' ? 'text-emerald-400' : d === 'flagged' ? 'text-red-400' : 'text-amber-400';
                  return (
                    <div key={d} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <div className={`text-2xl font-black ${color} mb-0.5`}>{count}</div>
                      <div className="text-xs text-slate-500 capitalize">{d}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Human Review tab */}
          {activeTab === 'human' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-800/30">
                <div className="flex items-start gap-3">
                  <Users size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-orange-300 mb-1">Human Oversight Required</div>
                    <p className="text-xs text-orange-400/70 leading-relaxed">
                      {reviewCount} high-priority item{reviewCount !== 1 ? 's' : ''} require expert human review.
                      AI output is a reasoning collaborator — not a final authority. The items below demonstrate situations where AI reasoning was incomplete, incorrect, or insufficiently grounded.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {result.humanReviewPoints.map(point => (
                  <HumanReviewCard key={point.id} point={point} />
                ))}
              </div>

              {/* Sustainability metrics */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 mt-2">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Sustainability Metrics</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800 text-center">
                    <div className="text-lg font-black text-white">{result.sustainabilityMetrics.tokensUsed.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Tokens Used</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 text-center">
                    <div className="text-lg font-black text-white">{result.sustainabilityMetrics.estimatedEnergyWh} Wh</div>
                    <div className="text-xs text-slate-500">Est. Energy</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 text-center">
                    <div className="text-sm font-black text-white">{result.sustainabilityMetrics.modelSize}</div>
                    <div className="text-xs text-slate-500">Model Class</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/20">
                  <div className="flex items-start gap-2">
                    <Zap size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-400/80 leading-relaxed">{result.sustainabilityMetrics.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
