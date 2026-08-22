import { useEffect, useRef, useState } from "react";

/**
 * SpecimenCard — the opening exhibit: a dense subscription clause that
 * decodes itself. One phrase is highlighted at a time and translated into
 * plain English below, cycling like a highlighter pen working down the page.
 */

const SEGMENTS: { t: string; a: number }[] = [
  { t: "This Agreement ", a: -1 },
  { t: "renews automatically at the end of each billing period", a: 0 },
  { t: " unless cancelled 24 hours before renewal. ", a: -1 },
  { t: "We may modify the subscription fee upon notice to you", a: 1 },
  { t: ". You agree to ", a: -1 },
  { t: "binding arbitration and waive any right to join a class action", a: 2 },
  { t: ". ", a: -1 },
  { t: "We may share your usage data with third-party partners", a: 3 },
  { t: ". Failure to pay may result in a ", a: -1 },
  { t: "late charge of $15 or 1.5% per month", a: 4 },
  { t: ".", a: -1 },
];

const NOTES = [
  "It keeps charging until you actively cancel.",
  "The price can change — watch for notices.",
  "Disputes go to arbitration; you can't sue as a group.",
  "Your usage data may be shared with other companies.",
  "A late payment stacks extra costs on top.",
];

export function SpecimenCard() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;
    if (paused) return;
    const id = window.setInterval(() => setActive((v) => (v + 1) % NOTES.length), 2900);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* stacked paper behind */}
      <div aria-hidden className="absolute inset-0 -rotate-2 rounded-lg border border-paperline bg-card/60" />
      <div aria-hidden className="absolute inset-0 rotate-1 rounded-lg border border-paperline bg-card/80" />

      <div className="relative rounded-lg border border-ink/15 bg-card shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between border-b border-paperline px-5 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Exhibit A · Subscription terms
          </p>
          <span className="rounded-full bg-hl px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">
            auto-annotated
          </span>
        </div>

        <p className="bg-ruled px-5 py-5 font-mono text-[13px] leading-[2.1] text-ink-soft sm:px-6 sm:text-sm">
          {SEGMENTS.map((s, i) =>
            s.a === -1 ? (
              <span key={i}>{s.t}</span>
            ) : (
              <span key={i} className={`spec-seg ${s.a === active ? "active" : ""}`}>
                {s.t}
              </span>
            )
          )}
        </p>

        <div className="border-t border-paperline px-5 py-4 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Plain English</p>
          <p key={active} className="spec-note mt-1.5 flex items-start gap-2.5 text-[15px] font-semibold leading-snug text-ink">
            <span aria-hidden className="mt-1 inline-block h-3 w-5 shrink-0 bg-hl" />
            {NOTES[active]}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-paperline px-5 py-3 sm:px-6">
          <div className="flex gap-1.5" role="tablist" aria-label="Annotation selector">
            {NOTES.map((n, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Annotation ${i + 1}: ${n}`}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-7 bg-ink" : "w-2.5 bg-ink/20 hover:bg-ink/40"
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-[11px] text-ink-faint">
            {String(active + 1).padStart(2, "0")} / {String(NOTES.length).padStart(2, "0")} decoded
          </p>
        </div>
      </div>
    </div>
  );
}
