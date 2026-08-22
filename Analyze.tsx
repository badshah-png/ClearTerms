import { useEffect, useMemo, useRef, useState, type CSSProperties, type JSX, type ReactNode } from "react";
import type { AnalysisResult } from "../lib/schema";
import { MAX_DOCUMENT_CHARS } from "../lib/schema";
import { redactSensitive, KIND_LABELS } from "../lib/redact";
import { validateDocumentText } from "../lib/validate";
import { analyzeDocument, AnalyzeError } from "../server/analyze";
import { SAMPLE_DOCUMENTS } from "../lib/sampleDocuments";
import { Badge, CopyButton, EmptyLine, Kicker, Reveal } from "../components/ui";
import {
  IconArrow,
  IconCalendar,
  IconCheck,
  IconClock,
  IconCoins,
  IconCpu,
  IconDoc,
  IconEraser,
  IconEye,
  IconFlag,
  IconMask,
  IconPen,
  IconQuestion,
  IconScale,
} from "../components/icons";

type Phase = "idle" | "loading" | "done" | "error";

const LOADING_STEPS = [
  "Validating input & enforcing limits",
  "Masking sensitive patterns",
  "Reading document structure",
  "Writing the plain-English report",
];

const SECTION_NAMES = [
  "Plain English summary",
  "What you are agreeing to",
  "Money and fees",
  "Important dates",
  "Cancellation and renewal",
  "Things to pay attention to",
  "Questions to ask",
  "Confidence and limitations",
];

function sectionToText(title: string, lines: string[]): string {
  return `${title}\n${"-".repeat(title.length)}\n${lines.map((l) => `• ${l}`).join("\n")}`;
}

/* ------------------------------------------------------------------ */
/* Result section card                                                 */
/* ------------------------------------------------------------------ */

function SectionCard({
  index,
  title,
  icon: Icon,
  copyText,
  delay,
  children,
}: {
  index: number;
  title: string;
  icon: (p: { width?: number; height?: number; className?: string }) => JSX.Element;
  copyText: string | null;
  delay: number;
  children: ReactNode;
}) {
  return (
    <article
      className="card-in rounded-lg border border-ink/12 bg-card shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
      style={{ "--card-delay": `${delay}ms` } as CSSProperties}
    >
      <header className="flex items-center justify-between gap-3 border-b border-paperline px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3.5">
          <span className="font-mono text-xs font-semibold text-ink-faint">{String(index).padStart(2, "0")}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slatesoft text-ink">
            <Icon width={18} height={18} />
          </span>
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        </div>
        {copyText !== null && <CopyButton text={copyText} compact />}
      </header>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </article>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <EmptyLine>Nothing in this category was found in the provided text — and nothing was invented.</EmptyLine>;
  }
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
          <span aria-hidden className="mt-[9px] h-[9px] w-[14px] shrink-0 bg-hl" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Analysis page                                                       */
/* ------------------------------------------------------------------ */

export function Analyze() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [retryIn, setRetryIn] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showRedactedPreview, setShowRedactedPreview] = useState(false);
  const stepTimer = useRef<number | null>(null);
  const retryTimer = useRef<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* Live (client-side) view of what the server boundary will mask. */
  const redaction = useMemo(() => (text.trim() ? redactSensitive(text) : null), [text]);
  const overLimit = text.length > MAX_DOCUMENT_CHARS;
  const nearLimit = text.length > MAX_DOCUMENT_CHARS * 0.85 && !overLimit;

  useEffect(() => () => {
    if (stepTimer.current) window.clearInterval(stepTimer.current);
    if (retryTimer.current) window.clearInterval(retryTimer.current);
  }, []);

  useEffect(() => {
    if (retryIn <= 0) {
      if (retryTimer.current) window.clearInterval(retryTimer.current);
      return;
    }
    retryTimer.current = window.setInterval(() => setRetryIn((v) => Math.max(0, v - 1)), 1000);
    return () => {
      if (retryTimer.current) window.clearInterval(retryTimer.current);
    };
  }, [retryIn > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSample = (id: string) => {
    const s = SAMPLE_DOCUMENTS.find((d) => d.id === id);
    if (s) {
      setText(s.text);
      setResult(null);
      setPhase("idle");
      setErrorMsg("");
    }
  };

  const run = async () => {
    /* Client-side guard for fast, friendly UX feedback.
       SECURITY: the server boundary repeats every check — this is not trusted. */
    const v = validateDocumentText(text);
    if (!v.ok) {
      setErrorMsg(v.message);
      setPhase("error");
      setResult(null);
      return;
    }

    setPhase("loading");
    setErrorMsg("");
    setLoadingStep(0);
    let step = 0;
    stepTimer.current = window.setInterval(() => {
      step = Math.min(step + 1, LOADING_STEPS.length - 1);
      setLoadingStep(step);
    }, 520);

    try {
      /* Only the necessary text crosses the boundary; redaction is re-applied inside. */
      const [res] = await Promise.all([analyzeDocument(text), new Promise((r) => setTimeout(r, 1900))]);
      setResult(res);
      setPhase("done");
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    } catch (e) {
      setResult(null);
      setPhase("error");
      if (e instanceof AnalyzeError) {
        setErrorMsg(e.code === "RATE_LIMITED" ? "Too many analyses in a short period. The limit resets shortly." : e.message);
        if (e.code === "RATE_LIMITED") setRetryIn(e.retryAfterSec);
      } else {
        /* SECURITY: never surface unknown error internals. */
        setErrorMsg("Something went wrong while analyzing the document. Please try again.");
      }
    } finally {
      if (stepTimer.current) window.clearInterval(stepTimer.current);
    }
  };

  const fullReport = useMemo(() => {
    if (!result) return "";
    const parts: string[] = [`ClearTerms report — ${result.document_type}`, ""];
    parts.push(sectionToText("Plain English Summary", result.summary));
    parts.push(sectionToText("What You Are Agreeing To", result.agreements));
    parts.push(sectionToText("Money and Fees", result.money_and_fees));
    parts.push(
      sectionToText(
        "Important Dates",
        result.important_dates.map((d) => `${d.date} — ${d.meaning} (${d.certainty === "clear" ? "clearly stated" : "unclear"})`)
      )
    );
    parts.push(sectionToText("Cancellation and Renewal", result.cancellation_and_renewal));
    parts.push(
      sectionToText(
        "Things to Pay Attention To",
        result.attention_items.map((a) => `${a.title}: ${a.explanation}`)
      )
    );
    parts.push(sectionToText("Questions to Ask", result.questions_to_ask));
    parts.push(sectionToText("Confidence and Limitations", result.limitations));
    parts.push("", "Informational only — not legal, financial, or professional advice.");
    return parts.join("\n\n");
  }, [result]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      {/* header */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>Analysis workspace</Kicker>
            <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
              Paste it. <span className="hl-static">We'll translate.</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
              Text is processed only while your report is generated — then it's discarded, permanently.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            <li className="flex items-center gap-2"><IconCpu width={14} height={14} className="text-moss" />On-device demo</li>
            <li className="flex items-center gap-2"><IconEraser width={14} height={14} className="text-moss" />Auto-redaction</li>
            <li className="flex items-center gap-2"><IconClock width={14} height={14} className="text-moss" />6 analyses / min</li>
          </ul>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.08fr]">
        {/* ---------------- input column ---------------- */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {/* sensitive-data warning */}
          <div role="note" className="flex items-start gap-3 rounded-lg border border-amberink/30 bg-ambersoft px-4.5 py-3.5 sm:px-5">
            <IconMask className="mt-0.5 shrink-0 text-amberink" />
            <p className="text-sm font-medium leading-relaxed text-amberink">
              Do not paste passwords, card numbers, authentication codes, or highly sensitive personal information.
              Obvious patterns are masked automatically — but redaction is a safety net, not a guarantee.
            </p>
          </div>

          {/* samples */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">Try a sample:</span>
            {SAMPLE_DOCUMENTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => loadSample(s.id)}
                className="rounded-full border border-ink/15 bg-card px-3.5 py-1.5 text-[13px] font-semibold text-ink-soft transition-all duration-200 hover:border-ink hover:bg-hl hover:text-ink active:scale-95"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* textarea */}
          <div className="mt-4 overflow-hidden rounded-lg border border-ink/15 bg-card shadow-[var(--shadow-card)] focus-within:border-ink/40 focus-within:shadow-[var(--shadow-lift)] transition-all duration-300">
            <div className="flex items-center justify-between border-b border-paperline bg-paper/60 px-4 py-2.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">Document text</p>
              <p
                className={`font-mono text-xs font-semibold tabular-nums ${
                  overLimit ? "text-danger" : nearLimit ? "text-amberink" : "text-ink-faint"
                }`}
                aria-live="polite"
              >
                {text.length.toLocaleString()} / {MAX_DOCUMENT_CHARS.toLocaleString()}
              </p>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the contract, bill, or terms here… (plain text works best)"
              aria-label="Document text to analyze"
              spellCheck={false}
              className="block min-h-[300px] w-full resize-y bg-card px-4 py-4 font-mono text-[13px] leading-relaxed text-ink placeholder:text-ink-faint/70 focus:outline-none sm:min-h-[340px]"
            />
            {/* limit bar */}
            <div className="h-1 w-full bg-paperline" aria-hidden>
              <div
                className={`h-full transition-all duration-300 ${overLimit ? "bg-danger" : nearLimit ? "bg-amberink" : "bg-moss"}`}
                style={{ width: `${Math.min(100, (text.length / MAX_DOCUMENT_CHARS) * 100)}%` }}
              />
            </div>
          </div>

          {/* redaction status */}
          {redaction && redaction.count > 0 && (
            <div className="mt-4 rounded-lg border border-moss/30 bg-moss-soft px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-moss">
                  <IconEraser width={16} height={16} />
                  {redaction.count} sensitive item{redaction.count === 1 ? "" : "s"} will be masked before analysis:{" "}
                  {Object.entries(redaction.kinds)
                    .map(([k, n]) => `${KIND_LABELS[k] ?? k} (${n})`)
                    .join(", ")}
                </p>
                <button
                  type="button"
                  onClick={() => setShowRedactedPreview((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-moss/40 bg-card px-2.5 py-1 text-xs font-bold text-moss transition-colors hover:bg-moss hover:text-paper"
                  aria-expanded={showRedactedPreview}
                >
                  <IconEye width={13} height={13} />
                  {showRedactedPreview ? "Hide preview" : "Preview"}
                </button>
              </div>
              {showRedactedPreview && (
                <pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap rounded-md border border-moss/25 bg-card p-3 font-mono text-[12px] leading-relaxed text-ink-soft">
                  {redaction.text}
                </pre>
              )}
            </div>
          )}

          {/* analyze button + inline validation */}
          <button
            type="button"
            onClick={run}
            disabled={phase === "loading" || overLimit}
            className="group mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-md bg-ink px-6 py-4 text-base font-bold text-paper shadow-[0_10px_28px_-12px_rgba(27,36,51,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {phase === "loading" ? (
              <>
                <span className="pulse-soft inline-flex items-center gap-2">
                  <IconClock /> Analyzing…
                </span>
              </>
            ) : (
              <>
                Analyze document
                <IconArrow width={17} height={17} className="transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
          {overLimit && (
            <p className="mt-2.5 text-sm font-medium text-danger" role="alert">
              Over the {MAX_DOCUMENT_CHARS.toLocaleString()} character limit — trim the text or analyze it in parts.
            </p>
          )}
          <p className="mt-3 text-center text-xs text-ink-faint">
            In production this calls the secure server endpoint. Here it runs the identical boundary on-device —
            your text never leaves this browser tab.
          </p>
        </div>

        {/* ---------------- results column ---------------- */}
        <div ref={resultsRef} className="scroll-mt-24" aria-live="polite">
          {phase === "idle" && (
            <div className="flex h-full min-h-[420px] flex-col justify-center rounded-lg border-2 border-dashed border-ink/15 bg-card/50 p-8 text-center sm:p-12">
              <IconDoc width={40} height={40} className="mx-auto text-ink/25" />
              <h2 className="mt-4 font-display text-2xl font-bold text-ink">Your report lands here</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-faint">
                Eight sections, written in plain English. Empty categories are shown as empty — never invented.
              </p>
              <ol className="mx-auto mt-6 grid max-w-md grid-cols-1 gap-x-6 gap-y-1.5 text-left sm:grid-cols-2">
                {SECTION_NAMES.map((s, i) => (
                  <li key={s} className="flex items-baseline gap-2.5 text-[13px] text-ink-soft">
                    <span className="font-mono text-[11px] font-semibold text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {phase === "loading" && (
            <div className="flex min-h-[420px] flex-col justify-center rounded-lg border border-ink/12 bg-card p-8 shadow-[var(--shadow-card)] sm:p-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">Processing — nothing is stored</p>
              <h2 className="mt-3 font-display text-3xl font-black text-ink">Reading the fine print…</h2>
              <ul className="mt-8 space-y-4">
                {LOADING_STEPS.map((s, i) => {
                  const done = i < loadingStep;
                  const current = i === loadingStep;
                  return (
                    <li key={s} className="flex items-center gap-3.5">
                      <span
                        className={`step-dot flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                          done
                            ? "border-moss bg-moss text-paper"
                            : current
                              ? "pulse-soft border-ink bg-hl text-ink"
                              : "border-ink/15 text-transparent"
                        }`}
                      >
                        <IconCheck width={14} height={14} />
                      </span>
                      <span className={`text-[15px] font-medium ${done ? "text-ink-faint line-through decoration-ink/20" : current ? "text-ink" : "text-ink-faint/60"}`}>
                        {s}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-paperline">
                <div
                  className="h-full bg-ink transition-all duration-500"
                  style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {phase === "error" && (
            <div role="alert" className="flex min-h-[420px] flex-col items-start justify-center rounded-lg border border-danger/30 bg-dangersoft/60 p-8 sm:p-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-danger text-paper">
                <IconFlag />
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold text-ink">This one needs another look</h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">{errorMsg}</p>
              {retryIn > 0 && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-ink/15 bg-card px-3.5 py-2 font-mono text-sm text-ink-soft">
                  <IconClock width={15} height={15} /> Retry available in {retryIn}s
                </p>
              )}
              <button
                type="button"
                onClick={run}
                disabled={retryIn > 0}
                className="mt-6 rounded-md bg-ink px-5 py-2.5 text-sm font-bold text-paper transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          )}

          {phase === "done" && result && (
            <div className="space-y-5">
              {/* report header */}
              <div className="card-in flex flex-wrap items-center justify-between gap-4 rounded-lg border border-ink bg-ink px-5 py-4 text-paper sm:px-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">Detected document</p>
                  <p className="mt-0.5 font-display text-xl font-bold">{result.document_type}</p>
                </div>
                <div className="flex items-center gap-3">
                  {result.redactions_applied > 0 && (
                    <span className="rounded-full border border-hl/50 bg-hl/10 px-3 py-1 font-mono text-[11px] font-semibold text-hl">
                      {result.redactions_applied} masked
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(fullReport).catch(() => undefined);
                    }}
                    className="inline-flex items-center gap-2 rounded-md bg-hl px-3.5 py-2 text-xs font-bold text-ink transition-all hover:bg-hl-deep active:scale-95"
                  >
                    <IconDoc width={14} height={14} /> Copy full report
                  </button>
                </div>
              </div>

              <SectionCard index={1} title="Plain English Summary" icon={IconDoc} delay={0}
                copyText={sectionToText("Plain English Summary", result.summary)}>
                <BulletList items={result.summary} />
              </SectionCard>

              <SectionCard index={2} title="What You Are Agreeing To" icon={IconPen} delay={60}
                copyText={result.agreements.length ? sectionToText("What You Are Agreeing To", result.agreements) : null}>
                <BulletList items={result.agreements} />
              </SectionCard>

              <SectionCard index={3} title="Money and Fees" icon={IconCoins} delay={120}
                copyText={result.money_and_fees.length ? sectionToText("Money and Fees", result.money_and_fees) : null}>
                <BulletList items={result.money_and_fees} />
              </SectionCard>

              <SectionCard index={4} title="Important Dates" icon={IconCalendar} delay={180}
                copyText={result.important_dates.length ? sectionToText("Important Dates", result.important_dates.map((d) => `${d.date} — ${d.meaning} (${d.certainty})`)) : null}>
                {result.important_dates.length === 0 ? (
                  <EmptyLine>No dates or deadlines found in the provided text.</EmptyLine>
                ) : (
                  <ul className="space-y-3">
                    {result.important_dates.map((d, i) => (
                      <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md border border-paperline bg-paper px-3.5 py-2.5">
                        <span className="rounded bg-ink px-2.5 py-1 font-mono text-[13px] font-semibold text-hl">{d.date}</span>
                        <span className="flex-1 text-sm text-ink-soft">{d.meaning}</span>
                        <Badge kind={d.certainty === "clear" ? "clear" : "unclear"} />
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>

              <SectionCard index={5} title="Cancellation and Renewal" icon={IconClock} delay={240}
                copyText={result.cancellation_and_renewal.length ? sectionToText("Cancellation and Renewal", result.cancellation_and_renewal) : null}>
                <BulletList items={result.cancellation_and_renewal} />
              </SectionCard>

              <SectionCard index={6} title="Things to Pay Attention To" icon={IconFlag} delay={300}
                copyText={result.attention_items.length ? sectionToText("Things to Pay Attention To", result.attention_items.map((a) => `${a.title}: ${a.explanation}`)) : null}>
                {result.attention_items.length === 0 ? (
                  <EmptyLine>No clauses were flagged in the provided text. That is a finding, not a guarantee.</EmptyLine>
                ) : (
                  <ul className="grid gap-3.5">
                    {result.attention_items.map((a, i) => (
                      <li key={i} className="rounded-md border border-amberink/25 bg-ambersoft/50 px-4 py-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="flex items-center gap-2 font-display text-[15px] font-bold text-ink">
                            <IconFlag width={15} height={15} className="text-amberink" />
                            {a.title}
                          </p>
                          <Badge kind={a.certainty === "clear" ? "attention" : "unclear"} />
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{a.explanation}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>

              <SectionCard index={7} title="Questions to Ask" icon={IconQuestion} delay={360}
                copyText={result.questions_to_ask.length ? sectionToText("Questions to Ask", result.questions_to_ask) : null}>
                {result.questions_to_ask.length === 0 ? (
                  <EmptyLine>No open questions were identified from this text.</EmptyLine>
                ) : (
                  <ol className="space-y-3">
                    {result.questions_to_ask.map((q, i) => (
                      <li key={i} className="flex gap-3.5 text-[15px] leading-relaxed text-ink-soft">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slatesoft font-mono text-[11px] font-bold text-ink">
                          {i + 1}
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </SectionCard>

              <SectionCard index={8} title="Confidence and Limitations" icon={IconScale} delay={420}
                copyText={sectionToText("Confidence and Limitations", [
                  ...result.confidence.clearly_stated.map((s) => `[Clearly stated] ${s}`),
                  ...result.confidence.needs_attention.map((s) => `[Needs attention] ${s}`),
                  ...result.confidence.unclear.map((s) => `[Unclear] ${s}`),
                  ...result.limitations,
                ])}>
                <div className="grid gap-4">
                  {(
                    [
                      ["clear", result.confidence.clearly_stated],
                      ["attention", result.confidence.needs_attention],
                      ["unclear", result.confidence.unclear],
                    ] as const
                  ).map(([kind, items]) => (
                    <div key={kind}>
                      <div className="flex items-center gap-2.5">
                        <Badge kind={kind} />
                      </div>
                      {items.length > 0 ? (
                        <ul className="mt-2.5 space-y-1.5">
                          {items.map((s, i) => (
                            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                              <span aria-hidden className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-ink-faint">Nothing in this bucket.</p>
                      )}
                    </div>
                  ))}
                  <div className="rounded-md border border-paperline bg-paper px-4 py-3.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Limitations</p>
                    <ul className="mt-2 space-y-1.5">
                      {result.limitations.map((l, i) => (
                        <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-faint">
                          <span aria-hidden className="mt-[7px] h-1.5 w-3 shrink-0 bg-paperline" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionCard>

              <p className="pb-2 text-center text-xs text-ink-faint">
                Informational only — not legal, financial, or professional advice. The analysis is now complete and
                the source text was not stored.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
