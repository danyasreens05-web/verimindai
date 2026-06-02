import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import type { AnalysisResult } from './types';

type Page = 'home' | 'analyze' | 'results';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setPage('results');
  };

  const handleNavigate = (target: 'home' | 'analyze' | 'results') => {
    if (target === 'results' && !analysisResult) return;
    setPage(target);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation currentPage={page} onNavigate={handleNavigate} />
      {page === 'home' && <HomePage onNavigate={handleNavigate} />}
      {page === 'analyze' && (
        <AnalysisPage onComplete={handleComplete} />
      )}
      {page === 'results' && analysisResult && (
        <ResultsPage
          result={analysisResult}
          onBack={() => setPage('analyze')}
          onNewAnalysis={() => setPage('analyze')}
        />
      )}
    </div>
  );
}
