/**
 * Unit tests for sensitive-information redaction.
 * Run with: npx vitest run
 */
import { describe, expect, it } from "vitest";
import { luhnValid, redactSensitive } from "../redact";

describe("luhnValid", () => {
  it("accepts a known-valid card number", () => {
    expect(luhnValid("4539148803436467")).toBe(true);
  });
  it("rejects an invalid digit sequence", () => {
    expect(luhnValid("1234567890123456")).toBe(false);
  });
});

describe("redactSensitive", () => {
  it("masks Luhn-valid card numbers, grouped or plain", () => {
    const a = redactSensitive("Card on file: 4539 1488 0343 6467.");
    expect(a.text).toContain("[REDACTED:card-number]");
    expect(a.text).not.toContain("4539");
    expect(a.kinds.card).toBe(1);

    const b = redactSensitive("number 4539148803436467 ok");
    expect(b.text).toContain("[REDACTED:card-number]");
  });

  it("leaves non-Luhn digit sequences untouched (order ids, dates)", () => {
    const r = redactSensitive("Order 1234 5678 9012 3456 ships on 12/01/2026.");
    expect(r.text).toContain("1234 5678 9012 3456");
    expect(r.count).toBe(0);
  });

  it("masks SSN-style national IDs", () => {
    const r = redactSensitive("SSN 123-45-6789 and also 987 65 4321.");
    expect(r.text).not.toContain("123-45-6789");
    expect(r.text).not.toContain("987 65 4321");
    expect(r.kinds.nationalId).toBe(2);
  });

  it("masks API keys and tokens", () => {
    const r = redactSensitive(
      "Keys: sk_live_abcdefghij123456 and ghp_abcdefghijklmnopqrstuvwxyz012345 and AKIAIOSFODNN7EXAMPLE."
    );
    expect(r.text).not.toContain("sk_live_abcdefghij123456");
    expect(r.text).not.toContain("ghp_abcdefghijklmnop");
    expect(r.text).not.toContain("AKIAIOSFODNN7EXAMPLE");
    expect(r.kinds.token).toBeGreaterThanOrEqual(3);
  });

  it("masks credential assignments but keeps the label", () => {
    const r = redactSensitive("Login with password: WinterSun$2026 then continue.");
    expect(r.text).toContain("password");
    expect(r.text).not.toContain("WinterSun$2026");
    expect(r.kinds.credential).toBe(1);
  });

  it("masks one-time codes", () => {
    const r = redactSensitive("Your verification code is 482913. Enter it now.");
    expect(r.text).not.toContain("482913");
    expect(r.kinds.code).toBe(1);
  });

  it("masks IBAN-style bank accounts", () => {
    const r = redactSensitive("Transfer to DE89 3704 0044 0532 0130 00 please.");
    expect(r.text).not.toContain("DE89 3704 0044 0532 0130 00");
    expect(r.kinds.bank).toBe(1);
  });

  it("masks PEM private key blocks", () => {
    const pem = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA7\n-----END RSA PRIVATE KEY-----";
    const r = redactSensitive(`Key: ${pem}`);
    expect(r.text).not.toContain("MIIEpAIBAAKCAQEA7");
    expect(r.kinds.credential).toBe(1);
  });

  it("does not alter innocent text", () => {
    const plain =
      "The meeting is scheduled for March 5, 2026 in room 7. Total attendees: 42. Rent is due on the 1st of each month.";
    const r = redactSensitive(plain);
    expect(r.text).toBe(plain);
    expect(r.count).toBe(0);
  });

  it("counts equal the sum of categories and never echo secrets", () => {
    const r = redactSensitive("pw secret: abcdef123 and card 4539148803436467 and ssn 123-45-6789");
    const total = Object.values(r.kinds).reduce((a, b) => a + b, 0);
    expect(r.count).toBe(total);
    expect(r.count).toBeGreaterThanOrEqual(3);
    // The report object itself must not contain raw secrets.
    expect(JSON.stringify({ count: r.count, kinds: r.kinds })).not.toContain("abcdef123");
  });
});
