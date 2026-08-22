/**
 * analyze.ts — THE server boundary. Every analysis request funnels through
 * `analyzeDocument()` and nothing else touches document text.
 *
 * DEPLOYMENT NOTE: in this static demo the boundary executes in an isolated
 * module inside the browser — document text never leaves the device at all,
 * which is the strongest possible privacy posture for a demo. In production
 * this exact module ships as a Next.js route handler (or equivalent); the
 * client then calls `POST /api/analyze` instead of importing this file, and
 * step 4 routes through aiProvider.example.ts with the key read from env.
 *
 * Pipeline (defence in depth — every step re-checks, nothing trusts the client):
 *   1. Rate limit            → abuse prevention (per-IP in production)
 *   2. Zod input validation  → hard 12,000-char limit, string typing
 *   3. Re-redaction          → secrets masked server-side regardless of client
 *   4. Analysis              → treats document strictly as DATA (see engine)
 *   5. Zod output validation → malformed/hostile output rejected, generic error
 *
 * LOGGING POLICY: we log counts, categories and error codes — NEVER document
 * text or redacted secrets. See SECURITY.md.
 */
import { AnalyzeRequestSchema, parseAnalysisResult, type AnalysisResult } from "../lib/schema";
import { redactSensitive } from "../lib/redact";
import { RateLimiter, DEMO_CAPACITY, DEMO_WINDOW_MS } from "../lib/rateLimiter";
import { analyzePlainText } from "../lib/analysisEngine";

export type AnalyzeErrorCode = "EMPTY" | "TOO_LARGE" | "INVALID_INPUT" | "RATE_LIMITED" | "ANALYSIS_FAILED";

export class AnalyzeError extends Error {
  code: AnalyzeErrorCode;
  retryAfterSec: number;
  constructor(code: AnalyzeErrorCode, userMessage: string, retryAfterSec = 0) {
    super(userMessage);
    this.name = "AnalyzeError";
    this.code = code;
    this.retryAfterSec = retryAfterSec;
  }
}

/**
 * Module-level limiter. In the demo it is keyed per tab (privacy-preserving).
 * In production: per-IP behind the trust proxy + a daily quota at the edge.
 */
const limiter = new RateLimiter({ capacity: DEMO_CAPACITY, windowMs: DEMO_WINDOW_MS });

/** SECURITY: never expose internals — all failures surface as AnalyzeError with a safe message. */
function toSafeError(e: unknown): AnalyzeError {
  if (e instanceof AnalyzeError) return e;
  if (e && e instanceof Error && e.name === "AnalysisValidationError") {
    // Detail is useful server-side only. Never include it in the user message.
    console.warn("[cleartems] analyzer output failed schema validation (details withheld from client)");
    return new AnalyzeError(
      "ANALYSIS_FAILED",
      "The analysis produced an unexpected format and was discarded. Please try again."
    );
  }
  return new AnalyzeError("ANALYSIS_FAILED", "Something went wrong while analyzing the document. Please try again.");
}

/**
 * Analyze a pasted document. Input is `unknown` on purpose: the boundary
 * assumes nothing about what the client sent.
 */
export async function analyzeDocument(rawInput: unknown): Promise<AnalysisResult> {
  try {
    /* 1 — rate limit FIRST (cheapest rejection, before any processing). */
    const decision = limiter.take();
    if (!decision.allowed) {
      throw new AnalyzeError(
        "RATE_LIMITED",
        `Too many analyses in a short period. Please try again in ${decision.retryAfterSec}s.`,
        decision.retryAfterSec
      );
    }

    /* 2 — server-side input validation (source of truth). */
    const parsed = AnalyzeRequestSchema.safeParse({ text: rawInput });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      const msg = first?.message ?? "Invalid input.";
      if (/limit/i.test(msg)) throw new AnalyzeError("TOO_LARGE", msg);
      if (/required|at least/i.test(msg))
        throw new AnalyzeError("EMPTY", "Please paste some document text first — the box is empty.");
      throw new AnalyzeError("INVALID_INPUT", "The submitted text could not be processed. Please paste plain text.");
    }

    /* 3 — re-redact server-side. Client-side redaction is a courtesy, never trusted. */
    const { text: safeText, count } = redactSensitive(parsed.data.text);

    /* 4 — analyze. In production this is where the server-only AI provider is
          called (key from env, fenced content, injection-hardened system prompt).
          The document is DATA; embedded instructions are never executed. */
    await new Promise((r) => setTimeout(r, 650)); // simulate async processing boundary
    const candidate = analyzePlainText(safeText, count);

    /* 5 — validate output against the strict schema before it may leave the
          boundary. Malformed or manipulated output is rejected here. */
    const result = parseAnalysisResult(candidate);

    // SECURITY: log metadata only — never document content.
    console.info(
      `[cleartems] analysis ok type="${result.document_type}" attention=${result.attention_items.length} redactions=${result.redactions_applied}`
    );
    return result;
  } catch (e) {
    throw toSafeError(e);
  }
}


