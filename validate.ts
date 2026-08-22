/**
 * validate.ts — input validation helpers.
 *
 * SECURITY DECISION: this module is a *client-side UX guard only*.
 * The server boundary (src/server/analyze.ts) re-validates everything with
 * Zod and is the authoritative source of truth. A malicious client can skip
 * these checks entirely, so none of them are relied upon for safety.
 */
import { MAX_DOCUMENT_CHARS, MIN_DOCUMENT_CHARS } from "./schema";

export type ValidationCode = "NOT_TEXT" | "EMPTY" | "TOO_SHORT" | "TOO_LARGE" | "OK";

export interface ValidationResult {
  ok: boolean;
  code: ValidationCode;
  message: string;
}

export function validateDocumentText(value: unknown): ValidationResult {
  if (typeof value !== "string") {
    return { ok: false, code: "NOT_TEXT", message: "Please paste document text to analyze." };
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { ok: false, code: "EMPTY", message: "Please paste some document text first — the box is empty." };
  }
  if (trimmed.length < MIN_DOCUMENT_CHARS) {
    return {
      ok: false,
      code: "TOO_SHORT",
      message: `That looks too short to analyze meaningfully (minimum ${MIN_DOCUMENT_CHARS} characters).`,
    };
  }
  if (value.length > MAX_DOCUMENT_CHARS) {
    return {
      ok: false,
      code: "TOO_LARGE",
      message: `Document is too long (${value.length.toLocaleString()} characters). The limit is ${MAX_DOCUMENT_CHARS.toLocaleString()} — try analyzing one section or page at a time.`,
    };
  }
  return { ok: true, code: "OK", message: "" };
}
