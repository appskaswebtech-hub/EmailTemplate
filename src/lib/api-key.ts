import crypto from "crypto";
import bcrypt from "bcryptjs";

const PREFIX_BYTES = 6;
const SECRET_BYTES = 24;
const KEY_PREFIX_TAG = "kw_live_";

/**
 * API keys look like: kw_live_<prefix>.<secret>
 * The prefix half is stored in plaintext so we can look up the owning Application
 * without a full-table bcrypt scan; the whole key is bcrypt-hashed and compared
 * on every request, so the stored hash alone is useless to an attacker.
 */
export function generateApiKey(): { plaintextKey: string; prefix: string } {
  const prefix = KEY_PREFIX_TAG + crypto.randomBytes(PREFIX_BYTES).toString("hex");
  const secret = crypto.randomBytes(SECRET_BYTES).toString("hex");
  return { plaintextKey: `${prefix}.${secret}`, prefix };
}

export async function hashApiKey(plaintextKey: string): Promise<string> {
  return bcrypt.hash(plaintextKey, 12);
}

export async function verifyApiKey(plaintextKey: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintextKey, hash);
}

export function extractKeyPrefix(plaintextKey: string): string | null {
  const [prefix] = plaintextKey.split(".");
  if (!prefix || !prefix.startsWith(KEY_PREFIX_TAG)) return null;
  return prefix;
}
