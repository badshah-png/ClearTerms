/**
 * ui.tsx — small shared primitives.
 * SECURITY NOTE: every component renders children as React text nodes —
 * React escapes them, so user/AI text can never inject markup or scripts.
 * There is deliberately no dangerouslySetInnerHTML anywhere in this app.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { IconCheck, IconCopy } from "./icons";

/* ---------- scroll reveal (IntersectionObserver, CSS handles reduced-motion) ---------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/* ---------- mono kicker label with highlighter tick ---------- */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-faint">
      <span aria-hidden className="inline-block h-[9px] w-6 bg-hl" />
      {children}
    </p>
  );
}

/* ---------- certainty badge ---------- */
export type BadgeKind = "clear" | "unclear" | "attention";
const BADGE_STYLES: Record<BadgeKind, string> = {
  clear: "bg-moss-soft text-moss border-moss/25",
  attention: "bg-ambersoft text-amberink border-amberink/25",
  unclear: "bg-slatesoft text-slateink border-slateink/25",
};
const BADGE_LABELS: Record<BadgeKind, string> = {
  clear: "Clearly stated",
  attention: "Needs attention",
  unclear: "Unclear",
};
export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${BADGE_STYLES[kind]}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {BADGE_LABELS[kind]}
    </span>
  );
}

/* ---------- copy button with perceptible feedback ---------- */
export function CopyButton({ text, compact = false }: { text: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / non-secure contexts.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied to clipboard" : "Copy section to clipboard"}
      className={`inline-flex items-center gap-1.5 rounded-md border border-paperline bg-card text-xs font-semibold text-ink-soft transition-all duration-200 hover:border-ink/30 hover:text-ink active:scale-95 ${
        compact ? "px-2 py-1" : "px-2.5 py-1.5"
      } ${copied ? "border-moss/40 text-moss" : ""}`}
    >
      {copied ? <IconCheck width={13} height={13} /> : <IconCopy width={13} height={13} />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/* ---------- empty-category line ---------- */
export function EmptyLine({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-md border border-dashed border-paperline bg-paper px-3.5 py-3 text-sm text-ink-faint">
      <span aria-hidden className="mt-[3px] h-3 w-3 shrink-0 rounded-full border-[1.5px] border-ink-faint/50" />
      {children}
    </p>
  );
}
