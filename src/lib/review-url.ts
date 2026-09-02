/**
 * Normalizes a review-page URL supplied via CSV/API: if it's a plain Shopify
 * App Store listing URL (with or without tracking params), strips the tracking
 * params and appends the fragment that auto-opens the "Write a review" modal —
 * so callers only ever need to paste the plain app URL, not the exact modal
 * incantation. Anything else (a non-Shopify review URL, or one that already
 * has a #hash) is passed through untouched.
 */
export function normalizeReviewUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "apps.shopify.com" && !parsed.hash) {
      parsed.search = "";
      parsed.hash = "modal-show=WriteReviewModal";
      return parsed.toString();
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}
