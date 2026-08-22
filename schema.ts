/**
 * schema.ts — the single source of truth for data shapes.
 *
 * SECURITY DECISION: AI output (or any analyzer output) is UNTRUSTED.
 * Every result must pass `AnalysisResultSchema.parse()` on the server side
 * before it reaches the browser. If a model (or an attacker manipulating a
 * model) returns malformed or hostile JSON, parsing fails and the user sees
 * a generic error — never raw model output, stack traces, or internals.
 */
import { z } from "zod";

export const MAX_DOCUMENT_CHARS = 12_000;
export const MIN_DOCUMENT_CHARS = 40;

/** Client → server request envelope. Validated server-side; the server never trusts the client. */
export const AnalyzeRequestSchema = z.object({
  text: z
    .string({ message: "Document text must be a string." })
    .min(1, "Document text is required.")
    .max(MAX_DOCUMENT_CHARS, `Document exceeds the ${MAX_DOCUMENT_CHARS.toLocaleString()} character limit.`),
  /** Redaction is ALWAYS re-applied server-side; this field is informational only. */
  clientRedactionCount: z.number().int().min(0).max(10_000).optional(),
});
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const CertaintySchema = z.enum(["clear", "unclear"]);
export type Certainty = z.infer<typeof CertaintySchema>;

export const ImportantDateSchema = z.object({
  date: z.string().min(1).max(200),
  meaning: z.string().min(1).max(300),
  certainty: CertaintySchema,
});
export type ImportantDate = z.infer<typeof ImportantDateSchema>;

export const AttentionItemSchema = z.object({
  title: z.string().min(1).max(160),
  explanation: z.string().min(1).max(500),
  certainty: CertaintySchema,
});
export type AttentionItem = z.infer<typeof AttentionItemSchema>;

/**
 * Strict output contract. Unknown keys are stripped (`z.object` default),
 * arrays are capped so a runaway model cannot flood the UI.
 */
export const AnalysisResultSchema = z.object({
  document_type: z.string().min(1).max(80),
  summary: z.array(z.string().min(1).max(400)).max(6),
  agreements: z.array(z.string().min(1).max(400)).max(12),
  money_and_fees: z.array(z.string().min(1).max(400)).max(15),
  important_dates: z.array(ImportantDateSchema).max(12),
  cancellation_and_renewal: z.array(z.string().min(1).max(400)).max(10),
  attention_items: z.array(AttentionItemSchema).max(12),
  questions_to_ask: z.array(z.string().min(1).max(300)).max(10),
  limitations: z.array(z.string().min(1).max(400)).max(10),
  confidence: z.object({
    clearly_stated: z.array(z.string().min(1).max(300)).max(12),
    needs_attention: z.array(z.string().min(1).max(300)).max(12),
    unclear: z.array(z.string().min(1).max(300)).max(12),
  }),
  /** Number of redactions applied before analysis — counts only, never content. */
  redactions_applied: z.number().int().min(0).max(10_000),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

/**
 * Validate an unknown analyzer payload. Throws `AnalysisValidationError`
 * (mapped to a safe user-facing message upstream) on any schema violation.
 */
export class AnalysisValidationError extends Error {
  constructor(issues: string[]) {
    super("Analyzer output failed schema validation.");
    this.name = "AnalysisValidationError";
    // SECURITY: issue detail is kept for server logs only; callers must not surface it to users.
    this.issues = issues;
  }
  issues: string[];
}

export function parseAnalysisResult(candidate: unknown): AnalysisResult {
  const parsed = AnalysisResultSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new AnalysisValidationError(
      parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    );
  }
  return parsed.data;
}
