import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL: React caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-[#111318]">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-rose-200 p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg">
                !
              </div>
              <div>
                <h2 className="font-bold text-base text-[#2B1421]">Something went wrong</h2>
                <p className="text-xs text-[#6D475B]">An error occurred while loading this view.</p>
              </div>
            </div>
            <div className="rounded-xl bg-[#FFF9FB] border border-rose-100 p-3.5 text-xs font-mono text-rose-800 break-words">
              {this.state.error?.message || 'Unknown Application Error'}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 rounded-xl bg-[#111318] hover:bg-[#FF6900] text-white text-xs font-bold transition-colors"
              >
                Reload Studio
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch {}
                  window.location.reload();
                }}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-xs font-semibold text-[#6D475B] hover:text-[#2B1421]"
              >
                Reset Cache
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
