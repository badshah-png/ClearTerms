/**
 * redact.ts — detect and mask obviously sensitive information BEFORE any text
 * crosses the module boundary toward analysis.
 *
 * SECURITY DECISIONS:
 * - Redaction runs on the client as a courtesy AND again inside the server
 *   boundary (server/analyze.ts). Client-side work is never trusted.
 * - We only mask patterns that are *obviously* sensitive. Over-aggressive
 *   redaction would damage the analysis, so PANs are Luhn-checked to avoid
 *   destroying innocent number sequences (order ids, dates, etc.).
 * - We report COUNTS and categories only — never the matched secrets
 *   themselves — so logging cannot leak user data.
 */

export interface RedactionReport {
  text: string;
  /** Total number of masked items. */
  count: number;
  /** Category → count. Keys are fixed, safe labels (never secret content). */
  kinds: Record<string, number>;
}

const PLACEHOLDERS = {
  card: "[REDACTED:card-number]",
  nationalId: "[REDACTED:national-id]",
  bank: "[REDACTED:bank-account]",
  credential: "[REDACTED:credential]",
  token: "[REDACTED:api-key-or-token]",
  code: "[REDACTED:one-time-code]",
} as const;

/** Luhn checksum — filters out random digit strings that are not payment card numbers. */
export function luhnValid(digits: string): boolean {
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return digits.length > 0 && sum % 10 === 0;
}

const strip = (s: string) => s.replace(/[ -]/g, "");

export function redactSensitive(input: string): RedactionReport {
  const kinds: Record<string, number> = {};
  let text = input;
  const bump = (k: string) => {
    kinds[k] = (kinds[k] ?? 0) + 1;
  };

  // 1) Private keys / PEM blocks — full match, highest sensitivity.
  text = text.replace(
    /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
    () => {
      bump("credential");
      return PLACEHOLDERS.credential;
    }
  );

  // 2) Well-known API key / token prefixes (Stripe, GitHub, Google, AWS, Slack, OpenAI, JWTs).
  text = text.replace(
    /\b(?:sk|pk)_(?:live|test)_[A-Za-z0-9_-]{8,}\b|\bgithub_pat_[A-Za-z0-9_]{10,}\b|\bgh[posr]_[A-Za-z0-9]{16,}\b|\bAIza[A-Za-z0-9_-]{20,}\b|\bAKIA[A-Z0-9]{12,}\b|\bxox[baprs]-[A-Za-z0-9-]{8,}\b|\bsk-[A-Za-z0-9_-]{20,}\b|\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g,
    () => {
      bump("token");
      return PLACEHOLDERS.token;
    }
  );

  // 3) Credential assignments: `password: hunter2`, `API_KEY=abc`, `pin = 1234`…
  text = text.replace(
    /\b(password|passwd|passphrase|pwd|secret|api[_ -]?key|access[_ -]?token|auth[_ -]?token|client[_ -]?secret|security[_ -]?code|cvv2?|cvc)\b(\s*[:=]\s*)([^\s,;]{3,})/gi,
    (_m, label: string, sep: string) => {
      bump("credential");
      return `${label}${sep}${PLACEHOLDERS.credential}`;
    }
  );

  // 4) One-time / verification codes: "your code is 482913", "OTP: 9912".
  text = text.replace(
    /\b(?:verification|one[- ]time|security|confirmation|login|authentication|auth)?\s*\b(?:code|otp|pin)\b\s*(?:is|of|:)?\s*#?\s*(\d{4,8})\b/gi,
    (m, _digits: string) => {
      bump("code");
      return m.replace(/\d{4,8}/, PLACEHOLDERS.code);
    }
  );

  // 5) US SSN / national ID style numbers.
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, () => {
    bump("nationalId");
    return PLACEHOLDERS.nationalId;
  });
  text = text.replace(/\b\d{3}\s\d{2}\s\d{4}\b/g, () => {
    bump("nationalId");
    return PLACEHOLDERS.nationalId;
  });

  // 6) IBAN-style bank account numbers.
  text = text.replace(/\b[A-Z]{2}\d{2}[ ]?(?:\d{4}[ ]?){2,7}\d{1,4}\b/g, () => {
    bump("bank");
    return PLACEHOLDERS.bank;
  });

  // 7) Payment card numbers (13–19 digits, grouped, Luhn-validated).
  text = text.replace(/\b\d(?:[ -]?\d){12,18}\b/g, (m) => {
    const digits = strip(m);
    if (digits.length >= 13 && digits.length <= 19 && luhnValid(digits)) {
      bump("card");
      return PLACEHOLDERS.card;
    }
    return m;
  });

  let count = 0;
  for (const v of Object.values(kinds)) count += v;
  return { text, count, kinds };
}

/** Human-readable category labels for the UI preview. */
export const KIND_LABELS: Record<string, string> = {
  card: "card numbers",
  nationalId: "national ID numbers",
  bank: "bank account numbers",
  credential: "passwords / credentials",
  token: "API keys / tokens",
  code: "one-time codes",
};
