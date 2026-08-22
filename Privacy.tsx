import { Kicker, Reveal } from "../components/ui";
import { IconShield } from "../components/icons";

/* Placeholder privacy policy — replace with reviewed counsel-approved text before production. */

const SECTIONS: { h: string; body: string[] }[] = [
  {
    h: "1. The short version",
    body: [
      "ClearTerms explains documents in plain language. It does not require an account, does not store your documents, and does not use your documents to train AI models. What you paste is processed only long enough to produce your report, then discarded.",
      "This page is a working placeholder for a production deployment and should be reviewed and adapted (with legal counsel where appropriate) before release.",
    ],
  },
  {
    h: "2. What we do not collect",
    body: [
      "No account data: there is no registration for the core analysis feature, so there is no name, email, or profile to collect.",
      "No document archive: submitted text is not written to any database, file store, or log. Only non-content metadata (such as request counts and error categories) may be recorded for abuse prevention and reliability.",
      "No tracking: no advertising trackers, no cross-site profiling, no sale of personal data.",
    ],
  },
  {
    h: "3. What is processed, and for how long",
    body: [
      "When you analyze a document, the text you paste is validated, size-checked, and screened for obviously sensitive patterns (card numbers, national IDs, credentials, one-time codes), which are masked automatically.",
      "The masked text is analyzed solely to generate your report. Processing data exists only in temporary memory for the duration of the request and is deleted when the request completes.",
    ],
  },
  {
    h: "4. Redaction is a safety net, not a guarantee",
    body: [
      "Automatic redaction catches common patterns of obviously sensitive data, but no pattern matching is perfect. Please do not paste passwords, full payment card numbers, authentication codes, government ID numbers, private keys, or API tokens.",
      "You can preview exactly what will be masked before any analysis runs.",
    ],
  },
  {
    h: "5. AI providers and training",
    body: [
      "In this demo build, analysis runs entirely in your browser — text never leaves your device.",
      "In a production deployment where a hosted AI provider is used, only redacted text necessary for the analysis is transmitted over HTTPS, and the provider is contractually prohibited from training on user submissions. Your documents are never used to train models without separate, explicit, opt-in consent — and there is currently no such opt-in.",
    ],
  },
  {
    h: "6. Security measures",
    body: [
      "Secure-by-default architecture: strict Content Security Policy, secure transport (HTTPS) in production, input validation and size limits enforced server-side, per-IP rate limiting, secrets stored only in server-side environment variables, and no browser access to API keys.",
      "The full security model, including how to report vulnerabilities responsibly, is documented in the project's SECURITY.md.",
    ],
  },
  {
    h: "7. Your controls",
    body: [
      "Because nothing is stored, there is nothing to delete on request: closing the tab ends the entire data lifecycle. You control what you paste, you can preview redactions, and you can copy your report if you want to keep it.",
    ],
  },
  {
    h: "8. Changes and contact",
    body: [
      "Material changes to this policy will be announced on this page with an updated effective date.",
      "Privacy questions or vulnerability reports: security@cleartems.example (placeholder address).",
    ],
  },
];

export function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Reveal>
        <Kicker>Legal · Placeholder</Kicker>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">Privacy policy</h1>
        <p className="mt-3 flex items-center gap-2 font-mono text-xs text-ink-faint">
          <IconShield width={14} height={14} className="text-moss" />
          Effective date: January 2026 · placeholder pending legal review
        </p>
      </Reveal>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.h} delay={(i % 3) * 70}>
            <section className="rounded-lg border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)] sm:p-7">
              <h2 className="font-display text-xl font-bold text-ink">{s.h}</h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p, j) => (
                  <p key={j} className="text-[15px] leading-relaxed text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
