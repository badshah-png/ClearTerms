/**
 * Tests: malformed AI/analyzer output, input validation, rate limiting,
 * and the "never invent information" rule.
 * Run with: npx vitest run
 */
import { describe, expect, it } from "vitest";
import { AnalysisResultSchema, AnalysisValidationError, MAX_DOCUMENT_CHARS, parseAnalysisResult } from "../schema";
import { validateDocumentText } from "../validate";
import { RateLimiter } from "../rateLimiter";
import { analyzePlainText } from "../analysisEngine";
import { SAMPLE_DOCUMENTS } from "../sampleDocuments";

describe("malformed analyzer output is rejected", () => {
  const valid = {
    document_type: "Test",
    summary: ["a", "b", "c"],
    agreements: [],
    money_and_fees: [],
    important_dates: [],
    cancellation_and_renewal: [],
    attention_items: [],
    questions_to_ask: [],
    limitations: ["x"],
    confidence: { clearly_stated: ["a"], needs_attention: [], unclear: [] },
    redactions_applied: 0,
  };

  it("accepts a well-formed result", () => {
    expect(() => parseAnalysisResult(valid)).not.toThrow();
    expect(AnalysisResultSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects non-object payloads", () => {
    expect(() => parseAnalysisResult("hello")).toThrow(AnalysisValidationError);
    expect(() => parseAnalysisResult(null)).toThrow(AnalysisValidationError);
    expect(() => parseAnalysisResult(42)).toThrow(AnalysisValidationError);
  });

  it("rejects wrong shapes (summary as string, missing fields)", () => {
    expect(() => parseAnalysisResult({ ...valid, summary: "not an array" })).toThrow(AnalysisValidationError);
    const { confidence: _c, ...missing } = valid;
    expect(() => parseAnalysisResult(missing)).toThrow(AnalysisValidationError);
  });

  it("rejects invalid certainty enums in nested items", () => {
    expect(() =>
      parseAnalysisResult({
        ...valid,
        important_dates: [{ date: "Jan 1", meaning: "m", certainty: "maybe" }],
      })
    ).toThrow(AnalysisValidationError);
  });

  it("rejects oversized arrays (runaway model output)", () => {
    expect(() => parseAnalysisResult({ ...valid, summary: Array(50).fill("x") })).toThrow(AnalysisValidationError);
  });
});

describe("input validation (client guard; server re-validates)", () => {
  it("rejects empty and whitespace-only input", () => {
    expect(validateDocumentText("").ok).toBe(false);
    expect(validateDocumentText("   \n\t ").ok).toBe(false);
    expect(validateDocumentText(null).ok).toBe(false);
  });
  it("rejects oversize input with a clear code", () => {
    const r = validateDocumentText("x".repeat(MAX_DOCUMENT_CHARS + 1));
    expect(r.ok).toBe(false);
    expect(r.code).toBe("TOO_LARGE");
  });
  it("accepts valid input", () => {
    expect(validateDocumentText("This is a perfectly reasonable document excerpt for analysis.").ok).toBe(true);
  });
});

describe("rate limiter", () => {
  it("allows up to capacity, then blocks with retry-after, then refills", () => {
    let now = 0;
    const rl = new RateLimiter({ capacity: 3, windowMs: 60_000, now: () => now });
    expect(rl.take().allowed).toBe(true);
    expect(rl.take().allowed).toBe(true);
    expect(rl.take().allowed).toBe(true);
    const blocked = rl.take();
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(blocked.retryAfterSec).toBeLessThanOrEqual(60);

    now += 61_000; // window elapsed
    expect(rl.take().allowed).toBe(true);
  });
});

describe("the engine never invents information", () => {
  it("leaves categories empty when the text has nothing for them", () => {
    const text =
      "This confidentiality agreement obligates both parties to keep shared information secret. " +
      "Each party is responsible for protecting the other party's documents.";
    const r = analyzePlainText(text, 0);
    expect(r.money_and_fees).toEqual([]);
    expect(r.important_dates).toEqual([]);
    expect(r.agreements.length).toBeGreaterThan(0);
  });

  it("produces schema-valid, non-empty reports for every sample document", () => {
    for (const s of SAMPLE_DOCUMENTS) {
      const r = analyzePlainText(s.text, 0);
      expect(AnalysisResultSchema.safeParse(r).success).toBe(true);
      expect(r.summary.length).toBeGreaterThanOrEqual(3);
      expect(r.summary.length).toBeLessThanOrEqual(6);
      expect(r.limitations.some((l) => /not legal, financial/i.test(l))).toBe(true);
    }
  });

  it("never claims a document is safe or gives a verdict", () => {
    for (const s of SAMPLE_DOCUMENTS) {
      const flat = JSON.stringify(analyzePlainText(s.text, 0)).toLowerCase();
      expect(flat).not.toContain("this document is safe");
      expect(flat).not.toContain("safe to sign");
      expect(flat).not.toContain("illegal");
      expect(flat).not.toContain("fraudulent");
    }
  });
});
