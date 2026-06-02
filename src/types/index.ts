export type ClaimStatus = 'verified' | 'unverified' | 'disputed' | 'hallucinated';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface FinancialClaim {
  id: string;
  text: string;
  category: 'revenue' | 'profitability' | 'debt' | 'valuation' | 'market' | 'growth' | 'other';
  status: ClaimStatus;
  confidence: number;
  evidence?: string;
  source?: string;
  verificationNote: string;
}

export interface HallucinationFlag {
  id: string;
  claimId?: string;
  text: string;
  type: 'fabricated_metric' | 'unsupported_claim' | 'overconfident' | 'vague' | 'contradictory' | 'missing_evidence';
  severity: SeverityLevel;
  explanation: string;
  suggestedCorrection?: string;
}

export interface ReliabilityScores {
  overall: number;
  hallucinationRisk: RiskLevel;
  evidenceCoverage: number;
  reasoningConsistency: number;
  claimVerification: number;
  confidenceCalibration: number;
}

export interface GuardrailViolation {
  rule: string;
  triggered: boolean;
  description: string;
}

export interface ExplainabilityEntry {
  subject: string;
  decision: 'trusted' | 'flagged' | 'uncertain';
  reasoning: string;
  requiresHumanReview: boolean;
}

export interface HumanReviewPoint {
  id: string;
  area: string;
  aiConclusion: string;
  concern: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  id: string;
  query: string;
  company: string;
  timestamp: string;
  aiReasoning: string;
  keyInsights: string[];
  assumptions: string[];
  claims: FinancialClaim[];
  hallucinationFlags: HallucinationFlag[];
  scores: ReliabilityScores;
  guardrailViolations: GuardrailViolation[];
  explainability: ExplainabilityEntry[];
  humanReviewPoints: HumanReviewPoint[];
  processingSteps: ProcessingStep[];
  sustainabilityMetrics: SustainabilityMetrics;
}

export interface ProcessingStep {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  details?: string;
}

export interface SustainabilityMetrics {
  tokensUsed: number;
  estimatedEnergyWh: number;
  modelSize: string;
  recommendation: string;
}
