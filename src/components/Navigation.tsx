import { useState } from 'react';
import { Brain, Menu, X, Shield, ChevronRight } from 'lucide-react';

interface NavProps {
  currentPage: 'home' | 'analyze' | 'results';
  onNavigate: (page: 'home' | 'analyze' | 'results') => void;
}

export default function Navigation({ currentPage, onNavigate }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: { id: 'home' | 'analyze'; label: string }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'analyze', label: 'Analyzer' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Brain size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-sm tracking-wide">VeriMind AI</span>
              <span className="text-slate-400 text-xs font-medium">Reliability Framework</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === link.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('analyze')}
              className="ml-3 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Shield size={14} />
              Run Analysis
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-3 flex flex-col gap-1">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                currentPage === link.id
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onNavigate('analyze'); setMobileOpen(false); }}
            className="mt-1 flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Shield size={14} />
            Run Analysis
          </button>
        </div>
      )}
    </nav>
  );
}
