import crypto from "crypto";

/** Unguessable token used in public feedback URLs, e.g. /feedback/[token]. */
export function generateFeedbackToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}
