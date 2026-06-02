import { useState, useEffect, useRef } from 'react';
import type { AnalysisResult, ProcessingStep } from '../types';
import { SAMPLE_ANALYSES } from '../data/sampleData';

export function useAnalysisEngine() {
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const abortRef = useRef(false);

  const run = async (query: string, companyKey: string) => {
    abortRef.current = false;
    setResult(null);
    setCurrentStep(0);
    setIsRunning(true);

    const template = SAMPLE_ANALYSES[companyKey] || SAMPLE_ANALYSES['apple'];
    const initialSteps: ProcessingStep[] = template.processingSteps.map(s => ({
      ...s,
      status: 'pending',
    }));
    setSteps(initialSteps);

    for (let i = 0; i < initialSteps.length; i++) {
      if (abortRef.current) break;

      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
      setCurrentStep(i + 1);

      await delay(template.processingSteps[i].duration ?? 500);

      if (abortRef.current) break;
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s));
    }

    if (!abortRef.current) {
      setResult({ ...template, query, timestamp: new Date().toISOString() });
    }
    setIsRunning(false);
  };

  const abort = () => {
    abortRef.current = true;
    setIsRunning(false);
  };

  const reset = () => {
    abortRef.current = true;
    setIsRunning(false);
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };

  return { isRunning, steps, result, currentStep, run, abort, reset };
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useCountUp(target: number, duration = 1200, active = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return value;
}
