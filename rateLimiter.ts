/**
 * rateLimiter.ts — fixed-window token bucket.
 *
 * SECURITY DECISION: abuse prevention. In production this exact class runs
 * inside the server boundary keyed by IP address (behind a trust proxy),
 * plus a daily quota at the edge/WAF. In this static demo it is keyed by an
 * ephemeral per-tab session id — no fingerprinting, no persistence.
 *
 * The clock is injectable so tests can advance time deterministically.
 */
export interface RateLimitDecision {
  allowed: boolean;
  /** Seconds until the next attempt is allowed (0 when allowed). */
  retryAfterSec: number;
  remaining: number;
}

export class RateLimiter {
  private capacity: number;
  private windowMs: number;
  private tokens: number;
  private windowStart: number;
  private now: () => number;

  constructor(opts: { capacity: number; windowMs: number; now?: () => number }) {
    this.capacity = opts.capacity;
    this.windowMs = opts.windowMs;
    this.tokens = opts.capacity;
    this.now = opts.now ?? (() => Date.now());
    this.windowStart = this.now();
  }

  take(): RateLimitDecision {
    const t = this.now();
    if (t - this.windowStart >= this.windowMs) {
      this.windowStart = t;
      this.tokens = this.capacity;
    }
    if (this.tokens > 0) {
      this.tokens -= 1;
      return { allowed: true, retryAfterSec: 0, remaining: this.tokens };
    }
    const retryAfterSec = Math.max(1, Math.ceil((this.windowStart + this.windowMs - t) / 1000));
    return { allowed: false, retryAfterSec, remaining: 0 };
  }
}

/**
 * Demo limiter: 6 analyses per rolling 60-second window per tab session.
 * Production numbers live in SECURITY.md (10/min + 100/day per IP).
 */
export const DEMO_CAPACITY = 6;
export const DEMO_WINDOW_MS = 60_000;
