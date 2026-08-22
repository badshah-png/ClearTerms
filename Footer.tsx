import { Link } from "react-router-dom";
import { LogoMark } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="h-1.5 w-full bg-hl" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark width={28} height={28} className="text-paper" />
            <span className="font-display text-lg font-black tracking-tight">ClearTerms</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
            A plain-language reader for contracts, bills, and fine print. Built privacy-first: no account, no
            storage, no training on your documents.
          </p>
          <p className="mt-4 max-w-sm rounded-md border border-paper/15 bg-paper/5 px-3.5 py-3 text-xs leading-relaxed text-paper/60">
            ClearTerms provides general information only. It is not legal, financial, or professional advice, and it
            never guarantees that a document is safe to sign.
          </p>
        </div>

        <nav aria-label="Pages">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">Pages</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="link-sweep text-paper/80 hover:text-paper" to="/analyze">Analyze a document</Link></li>
            <li><Link className="link-sweep text-paper/80 hover:text-paper" to="/">How it works</Link></li>
            <li><Link className="link-sweep text-paper/80 hover:text-paper" to="/privacy">Privacy policy</Link></li>
            <li><Link className="link-sweep text-paper/80 hover:text-paper" to="/terms">Terms of use</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">Privacy by design</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
            <li className="flex gap-2"><span aria-hidden className="mt-[7px] h-1.5 w-3 shrink-0 bg-hl" />No account required</li>
            <li className="flex gap-2"><span aria-hidden className="mt-[7px] h-1.5 w-3 shrink-0 bg-hl" />Document text is never stored</li>
            <li className="flex gap-2"><span aria-hidden className="mt-[7px] h-1.5 w-3 shrink-0 bg-hl" />Sensitive data auto-redacted</li>
            <li className="flex gap-2"><span aria-hidden className="mt-[7px] h-1.5 w-3 shrink-0 bg-hl" />Never used for AI training</li>
            <li className="flex gap-2"><span aria-hidden className="mt-[7px] h-1.5 w-3 shrink-0 bg-hl" />Security model in SECURITY.md</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-paper/50 sm:flex-row sm:items-center sm:px-6">
          <p>© 2026 ClearTerms. Informational only — not legal advice.</p>
          <p className="font-mono">secure-by-default · OWASP-aligned · CSP enforced</p>
        </div>
      </div>
    </footer>
  );
}
