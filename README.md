# ClearTerms

**Understand confusing documents in plain English.**

ClearTerms turns contracts, bills, subscription terms, insurance documents, employment agreements, and terms &
conditions into a clear, eight-section plain-English report — without requiring an account and without storing your
document.

> **Informational only.** ClearTerms is not legal, financial, or professional advice and never guarantees that a
> document is safe to sign or pay.

---

## Quick start

```bash
npm install
npm run dev        # local development
npm run build      # production build (dist/)
npm run typecheck  # TypeScript strict check
npx vitest run     # unit tests (redaction, injection, malformed output, limits)
```

## Features

- **Landing page** — how it works, privacy model, supported document types, FAQ, explicit disclaimer.
- **Analysis page** — paste → validate → redact → analyze → structured report:
  1. Plain English summary &nbsp;2. What you are agreeing to &nbsp;3. Money and fees &nbsp;4. Important dates
  5. Cancellation and renewal &nbsp;6. Things to pay attention to &nbsp;7. Questions to ask &nbsp;8. Confidence and limitations
- Character counter with hard **12,000-char** limit, staged loading states, clear non-technical errors.
- **Automatic redaction** of card numbers (Luhn-checked), SSN-style IDs, IBANs, API keys/tokens, PEM keys,
  credential assignments, and one-time codes — with a preview of exactly what will be masked.
- **Certainty labels** — “Clearly stated”, “Needs attention”, “Unclear”. Empty categories stay empty (never invented).
- Copy any section or the full report. Sample documents included (fictional, with a standard test card number so you
  can watch redaction work).

## Architecture

```
src/
├── lib/          Pure logic + tests (schema, redaction, validation, rate limiter, engine, samples)
├── server/       ⚠ SERVER-ONLY boundary — the single choke point for analysis
│   ├── analyze.ts            validate → rate-limit → re-redact → analyze → schema-validate
│   └── aiProvider.example.ts Reference adapter for a hosted LLM (never imported by client code)
├── components/   Nav, footer, specimen card, UI primitives, custom SVG icons
└── pages/        Landing, Analyze, Privacy (placeholder), Terms (placeholder)
```

**Where analysis runs.** This repository ships as a static Vite build; the server boundary executes in an isolated
module *in the browser*, so in the demo **document text never leaves the device at all** — the strongest possible
privacy posture. In production, `src/server/analyze.ts` maps 1:1 to a Next.js route handler (or equivalent):
the client posts to `POST /api/analyze`, all validation/limits/redaction run server-side, and the AI call happens
there via `aiProvider.example.ts` with the key read from server-only environment variables. Nothing about that
contract changes — only the transport.

**Data flow.** Textarea → client validation (UX only) → redaction → server boundary (Zod-validated input,
rate limit, re-redaction, analysis, Zod-validated output) → rendered as escaped text nodes → discarded.
Nothing is persisted anywhere; only non-content metadata is logged.

## Environment variables

See `.env.example` — **placeholder names only; never commit real secrets.** In production the AI key is read
**server-side only** (`process.env` in the route handler). Never prefix it with `VITE_`/`NEXT_PUBLIC_` — that would
ship the key to browsers.

## Security

- Strict CSP (meta + hosting headers in `public/_headers`), HSTS/nosniff/frame-deny in production.
- No `dangerouslySetInnerHTML`; all user/AI text renders through React text nodes (auto-escaped).
- Prompt-injection hardened: documents are fenced, untrusted data; embedded instructions are analyzed as text only;
  every response must pass a strict Zod schema before release.
- Rate limiting (token bucket): 6/min per tab in the demo; 10/min + 100/day per IP in production (see SECURITY.md).
- Error boundary + safe error codes — no stack traces, internals, or model errors reach the UI.
- Dependency hygiene: minimal runtime dependencies (`react`, `react-router-dom`, `zod`); audit with `npm audit`.

Read **[SECURITY.md](SECURITY.md)** for the full model and the responsible-disclosure process.

## Testing

```bash
npx vitest run
```

Covered: redaction patterns + false-positive resistance, prompt-injection payloads (obey/leak/override attempts),
malformed analyzer output, input validation, rate limiting, and the “never invent information” rule.

## Legal pages

`/privacy` and `/terms` ship as clearly-marked **placeholders** to be replaced with counsel-reviewed text before
production deployment.
