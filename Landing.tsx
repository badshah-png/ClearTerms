import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SpecimenCard } from "../components/SpecimenCard";
import { Kicker, Reveal } from "../components/ui";
import { scrollToId } from "../components/Nav";
import {
  IconArrow,
  IconCalendar,
  IconChevron,
  IconCoins,
  IconCpu,
  IconDoc,
  IconEraser,
  IconMask,
  IconPaste,
  IconPen,
  IconScale,
  IconShield,
  IconShred,
} from "../components/icons";

/* ---------------- hero ---------------- */

function Hero() {
  const [swept, setSwept] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setSwept(true), 350);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* giant section mark watermark — the symbol of fine print */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-24 select-none font-display text-[26rem] font-black leading-none text-ink/[0.045] sm:text-[34rem]"
      >
        §
      </span>
      <div className="bg-dotgrid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
        <div>
          <Kicker>Plain-language document reader</Kicker>
          <h1 className="mt-5 font-display text-[2.6rem] font-black leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
            Understand confusing documents in{" "}
            <span className={`hl-sweep whitespace-nowrap ${swept ? "is-on" : ""}`}>plain English.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Paste complicated terms, bills, or agreements and get a clear explanation of what they mean —
            what you're agreeing to, what it costs, and what to watch out for.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2.5 rounded-md bg-ink px-6 py-3.5 text-base font-bold text-paper shadow-[0_10px_28px_-12px_rgba(27,36,51,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(27,36,51,0.6)] active:translate-y-0 active:scale-95"
            >
              <IconPaste />
              Paste a document
              <IconArrow width={17} height={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => scrollToId("how")}
              className="link-sweep inline-flex items-center gap-2 px-1 py-2 text-base font-semibold text-ink"
            >
              See how it works
            </button>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            <li className="flex items-center gap-2"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-moss" />No account</li>
            <li className="flex items-center gap-2"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-moss" />Nothing stored</li>
            <li className="flex items-center gap-2"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-moss" />Sensitive data redacted</li>
            <li className="flex items-center gap-2"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-moss" />Not legal advice</li>
          </ul>
        </div>

        <Reveal delay={120}>
          <SpecimenCard />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- typographic stat band ---------------- */

function StatBand() {
  const stats = [
    { n: "0", label: "documents stored — ever" },
    { n: "12,000", label: "character safe limit per analysis" },
    { n: "8", label: "sections in every report" },
    { n: "100%", label: "ephemeral processing" },
  ];
  return (
    <section aria-label="Privacy statistics" className="border-y border-ink/10 bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-paperline px-4 sm:px-6 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className={`px-5 py-8 ${i >= 2 ? "border-t border-paperline lg:border-t-0" : ""}`}>
            <p className="font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">{s.n}</p>
            <p className="mt-2 max-w-[16ch] text-[13px] font-medium leading-snug text-ink-faint">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- document-type ticker ---------------- */

const TICKER = [
  "Leases",
  "Subscription terms",
  "Invoices & bills",
  "Insurance policies",
  "Employment agreements",
  "Terms of service",
  "Loan agreements",
  "Gym memberships",
  "Service contracts",
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="ticker overflow-hidden border-b border-ink/10 bg-ink py-3 text-paper" aria-hidden>
      <div className="ticker-track flex w-max items-center gap-8">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-lg font-semibold italic tracking-wide">
            {t}
            <span className="not-italic text-hl">§</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- how it works ---------------- */

const STEPS = [
  {
    n: "01",
    icon: IconPaste,
    title: "Paste the text",
    body: "Copy the clause, bill, or agreement into the analyzer. A clear warning reminds you not to include passwords, card numbers, or ID numbers — and anything that slips through is detected and masked automatically before analysis.",
  },
  {
    n: "02",
    icon: IconShield,
    title: "Analyzed behind a security boundary",
    body: "Your text crosses a single, validated checkpoint: size limits enforced, abuse rate-limiting applied, sensitive patterns re-redacted server-side, and the document treated strictly as data — instructions embedded inside it are never executed.",
  },
  {
    n: "03",
    icon: IconDoc,
    title: "Read the plain-English breakdown",
    body: "Get eight clear sections: a summary, what you're agreeing to, money and fees, dates, cancellation, things to review, questions to ask, and an honest confidence report. Copy any section. Then it's gone — nothing is stored.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Kicker>How it works</Kicker>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
              Three steps.
              <br />
              Zero fine print.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              ClearTerms reads the document the way a careful friend would — pointing at each important line and
              telling you what it actually means, without pretending to be your lawyer.
            </p>
            <Link
              to="/analyze"
              className="group mt-7 inline-flex items-center gap-2 font-semibold text-ink"
            >
              <span className="link-sweep">Try it with a sample document</span>
              <IconArrow width={16} height={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="flex flex-col">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="group flex gap-6 border-t border-ink/10 py-9 transition-colors duration-300 hover:bg-card/70 sm:gap-8">
                <div className="flex flex-col items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-ink-faint">{s.n}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-md border border-ink/15 bg-card text-ink transition-all duration-300 group-hover:border-hl-deep group-hover:bg-hl group-hover:shadow-[0_6px_18px_-8px_rgba(245,197,24,0.7)]">
                    <s.icon />
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">{s.title}</h3>
                  <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- privacy panel ---------------- */

const PRIVACY_POINTS = [
  {
    icon: IconShield,
    title: "No account required",
    body: "The analyzer works immediately. No email, no sign-up, no profile to leak.",
  },
  {
    icon: IconShred,
    title: "Nothing is stored",
    body: "Document text is processed only while generating your analysis, then discarded. No database, no logs of your content.",
  },
  {
    icon: IconMask,
    title: "Automatic redaction",
    body: "Card numbers, national IDs, API keys, passwords, and one-time codes are detected and masked before analysis — and you can preview every mask first.",
  },
  {
    icon: IconCpu,
    title: "On-device in this demo",
    body: "This build runs the analyzer entirely in your browser — text never leaves your machine. In production the same boundary runs server-side, with keys that never reach the browser.",
  },
];

function PrivacyPanel() {
  const flow = ["Your browser", "Validation", "Redaction", "Analysis", "Discarded"];
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper">
      <span aria-hidden className="pointer-events-none absolute -left-8 -bottom-32 select-none font-display text-[24rem] font-black leading-none text-paper/[0.035]">
        §
      </span>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-hl">
                <span aria-hidden className="inline-block h-[9px] w-6 bg-hl" />
                Privacy-first
              </p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
                Private by architecture,
                <br />
                not by promise.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-paper/70">
                Anyone can claim to “value your privacy.” Instead, ClearTerms removes the ability to misuse your
                documents: there is no storage to breach, no training pipeline to opt out of, and no account graph to
                sell. The security model is documented end-to-end in the project's SECURITY.md.
              </p>
              <p className="mt-6 max-w-lg rounded-md border border-paper/15 bg-paper/5 px-4 py-3.5 text-sm leading-relaxed text-paper/75">
                <strong className="text-paper">One honest warning:</strong> even with redaction, no tool catches
                everything. Please don't paste passwords, full card numbers, authentication codes, or government ID
                numbers.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PRIVACY_POINTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="group h-full rounded-lg border border-paper/12 bg-paper/[0.045] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-hl/50 hover:bg-paper/[0.07]">
                  <p.icon className="text-hl transition-transform duration-300 group-hover:-rotate-6" />
                  <h3 className="mt-4 font-display text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/65">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* data flow strip */}
        <Reveal delay={120}>
          <div className="mt-16 rounded-lg border border-paper/12 bg-paper/[0.04] p-6 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
              Where your text goes — and where it stops
            </p>
            <ol className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-4">
              {flow.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={`rounded-md border px-3.5 py-2 font-mono text-[13px] font-medium ${
                      i === flow.length - 1
                        ? "border-moss/60 bg-moss/15 text-[#7fd6ae]"
                        : "border-paper/20 bg-paper/5 text-paper/85"
                    }`}
                  >
                    {step}
                  </span>
                  {i < flow.length - 1 && <IconArrow width={16} height={16} className="text-hl" />}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[13px] text-paper/50">
              No arrow points to a database, a training set, or a third party. In this demo the entire pipeline runs
              in your browser.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- supported document types ---------------- */

const DOC_TYPES = [
  { icon: IconPen, title: "Contracts & leases", body: "Rental agreements, service contracts, purchase terms — obligations, deposits, and notice periods pulled out.", tag: "lease-excerpt.txt", wide: true },
  { icon: IconDoc, title: "Subscription terms", body: "Auto-renewals, billing periods, price-change clauses, and exactly how to cancel.", tag: "terms-v7.pdf → text" },
  { icon: IconCoins, title: "Bills & invoices", body: "Amounts due, payment deadlines, late charges, and anything that looks like a hidden fee.", tag: "invoice-2041.pdf" },
  { icon: IconShield, title: "Insurance documents", body: "Premiums, deductibles, exclusions, and what the policy actually covers.", tag: "policy-schedule.pdf" },
  { icon: IconCalendar, title: "Employment agreements", body: "Compensation, restrictive covenants, confidentiality, and what survives after you leave.", tag: "offer-letter.docx" },
  { icon: IconScale, title: "Terms & conditions", body: "Arbitration clauses, liability limits, data sharing, and unilateral changes.", tag: "app-tos.html" },
];

function DocTypes() {
  return (
    <section id="types" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>Supported documents</Kicker>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
              If it's full of fine print,
              <br />
              paste it.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-faint">
            Plain text works best. Copy from a PDF, email, or web page and paste — the analyzer reads the words, not
            the formatting.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOC_TYPES.map((d, i) => (
          <Reveal key={d.title} delay={(i % 3) * 90} className={d.wide ? "sm:col-span-2 lg:col-span-1" : ""}>
            <div className="group flex h-full flex-col rounded-lg border border-ink/12 bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-slatesoft text-ink transition-colors duration-300 group-hover:bg-hl">
                  <d.icon />
                </span>
                <IconArrow width={17} height={17} className="-translate-x-1 text-ink/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-ink/60" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{d.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{d.body}</p>
              <p className="mt-5 inline-flex w-max items-center gap-2 rounded border border-paperline bg-paper px-2.5 py-1 font-mono text-[11px] text-ink-faint">
                <IconDoc width={12} height={12} /> {d.tag}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- disclaimer ---------------- */

function Disclaimer() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <Reveal>
        <div className="flex flex-col gap-5 rounded-lg border-2 border-ink/15 bg-ambersoft/60 p-7 sm:flex-row sm:items-start sm:p-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-ink text-hl">
            <IconScale width={24} height={24} />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Read this part — it's the honest part</h2>
            <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
              ClearTerms provides <strong>general information only</strong>. It is not legal, financial, tax, or any
              other professional advice, and no attorney–client or advisory relationship is created. It never
              guarantees that a contract, bill, or document is “safe” to sign or pay. Laws vary by jurisdiction and
              individual circumstances — for decisions that matter, consult a qualified professional.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQS = [
  {
    q: "Is my document saved anywhere?",
    a: "No. Text is processed only for as long as it takes to generate your analysis, then discarded. There is no database of documents, no account, and no analytics on content. In this demo the analysis runs entirely in your browser, so the text never even makes a network request.",
  },
  {
    q: "Is this legal advice?",
    a: "No — and it's designed never to pretend otherwise. ClearTerms translates document language into plain English and points out items worth reviewing. It does not judge clauses as legal or illegal, and it will tell you when something is unclear or depends on circumstances outside the document.",
  },
  {
    q: "What should I not paste?",
    a: "Passwords, full bank card numbers, authentication or one-time codes, government ID numbers (like SSNs), private keys, and API tokens. The app automatically detects and masks common patterns, but redaction is a safety net, not a guarantee — when in doubt, remove the line before pasting.",
  },
  {
    q: "Could instructions hidden in a document trick the app?",
    a: "The analyzer treats your document strictly as data. Text like “ignore previous instructions” is recognized as an oddity and flagged for your review — it is never executed. Output is also validated against a strict schema server-side, so malformed or manipulated responses are rejected outright.",
  },
  {
    q: "What does the confidence section mean?",
    a: "Every report separates what is clearly stated in the text, what needs your attention, and what is unclear or depends on outside factors (like local law). If a category has no supporting text — for example, no dates are mentioned — it is shown as empty rather than guessed.",
  },
];

function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <Kicker>FAQ</Kicker>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Asked,
            <br />
            answered.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            The questions people actually have before pasting a document — answered without the waffle.
          </p>
        </Reveal>

        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <Reveal key={f.q} delay={i * 60}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className={`font-display text-lg font-bold transition-colors ${open ? "text-ink" : "text-ink-soft"}`}>
                      {f.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        open ? "rotate-180 border-ink bg-ink text-paper" : "border-ink/20 text-ink"
                      }`}
                    >
                      <IconChevron width={15} height={15} />
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- final CTA ---------------- */

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-xl bg-ink px-7 py-14 text-paper sm:px-14">
          <IconEraser width={220} height={220} className="pointer-events-none absolute -right-10 -top-10 rotate-12 text-paper/[0.06]" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-black tracking-tight sm:text-5xl">
              The fine print,
              <br />
              minus the <span className="hl-static">squinting.</span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-paper/70">
              Paste a document now — get an eight-section plain-English report in seconds, then carry on with your
              day. Nothing is stored.
            </p>
            <Link
              to="/analyze"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-md bg-hl px-6 py-3.5 text-base font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-hl-deep active:translate-y-0 active:scale-95"
            >
              <IconPaste />
              Analyze a document
              <IconArrow width={17} height={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Landing() {
  return (
    <>
      <Hero />
      <StatBand />
      <Ticker />
      <HowItWorks />
      <PrivacyPanel />
      <DocTypes />
      <Disclaimer />
      <Faq />
      <FinalCta />
    </>
  );
}
