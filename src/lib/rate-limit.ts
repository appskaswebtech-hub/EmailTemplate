/**
 * Simple in-memory token-bucket rate limiter. Good enough for a single-instance
 * deployment; if this app ever runs across multiple serverless instances, swap
 * this for a shared store (e.g. Upstash Redis) since buckets here are per-process.
 */
const buckets = new Map<string, { tokens: number; updatedAt: number }>();

const CAPACITY = 20;
const REFILL_PER_MS = CAPACITY / (60 * 1000); // full refill every 60s

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: CAPACITY, updatedAt: now };

  const elapsed = now - bucket.updatedAt;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsed * REFILL_PER_MS);
  bucket.updatedAt = now;

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}
