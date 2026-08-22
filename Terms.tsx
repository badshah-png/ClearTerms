import { Kicker, Reveal } from "../components/ui";
import { IconScale } from "../components/icons";

/* Placeholder terms of use — replace with reviewed counsel-approved text before production. */

const SECTIONS: { h: string; body: string[] }[] = [
  {
    h: "1. Agreement to these terms",
    body: [
      "By using ClearTerms you agree to these Terms of Use. If you do not agree, do not use the service. These terms are a placeholder for a production deployment and should be reviewed before release.",
    ],
  },
  {
    h: "2. The service — and what it is not",
    body: [
      "ClearTerms translates contracts, bills, terms, and similar documents into plain language and highlights items that may deserve attention.",
      "The service provides general information only. It is not a lawyer, accountant, financial adviser, or other professional, and nothing it produces is legal, financial, tax, or professional advice. It does not create an attorney–client or advisory relationship, and it never guarantees that a document is safe to sign, pay, or rely on.",
    ],
  },
  {
    h: "3. Acceptable use",
    body: [
      "You agree not to submit content you have no right to process, and not to use the service to attempt to extract system prompts, bypass security controls, or probe infrastructure.",
      "Do not paste passwords, full payment card numbers, authentication codes, government ID numbers, private keys, or API tokens. Automatic redaction helps, but it is not a guarantee.",
      "Automated abuse (scraping at scale, rate-limit circumvention, attempts to overwhelm the service) is prohibited and is throttled automatically.",
    ],
  },
  {
    h: "4. Your documents, your rights",
    body: [
      "You retain all rights to the text you submit. ClearTerms claims no ownership and no license beyond what is technically necessary to generate your analysis for you, in memory, for the duration of your request.",
    ],
  },
  {
    h: "5. No warranties",
    body: [
      "The service is provided “as is” and “as available.” Automated analysis can miss nuance, misread context, or overlook clauses. Always verify key figures, dates, and obligations against the original document, and consult a qualified professional for decisions that matter.",
    ],
  },
  {
    h: "6. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, ClearTerms is not liable for indirect, incidental, or consequential damages, or for decisions made in reliance on its output. Your sole remedy for dissatisfaction is to stop using the service.",
    ],
  },
  {
    h: "7. Changes",
    body: [
      "These terms may be updated; material changes will be posted here with a new effective date. Continued use after changes constitutes acceptance.",
    ],
  },
  {
    h: "8. Contact",
    body: ["Questions about these terms: legal@cleartems.example (placeholder address)."],
  },
];

export function TermsOfUse() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Reveal>
        <Kicker>Legal · Placeholder</Kicker>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">Terms of use</h1>
        <p className="mt-3 flex items-center gap-2 font-mono text-xs text-ink-faint">
          <IconScale width={14} height={14} className="text-moss" />
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
