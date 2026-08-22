import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary — catches render crashes and shows a calm, safe fallback.
 * SECURITY: only a generic message is shown; the raw error object is logged
 * to the console for developers but never rendered, so no internals
 * (paths, stack detail, secrets in memory) can leak into the DOM.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[cleartems] render error caught by boundary", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-paper p-6">
          <div className="w-full max-w-md rounded-lg border border-paperline bg-card p-8 shadow-[var(--shadow-card)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">ClearTerms</p>
            <h1 className="mt-3 font-display text-2xl font-bold text-ink">Something went wrong</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              An unexpected problem occurred while rendering this page. Nothing you pasted has been stored or sent
              anywhere. Reloading usually fixes it.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] active:scale-95"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
