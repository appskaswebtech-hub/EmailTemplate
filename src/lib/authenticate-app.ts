import { prisma } from "@/lib/prisma";
import { extractKeyPrefix, verifyApiKey } from "@/lib/api-key";
import type { Application } from "@prisma/client";

export type AuthenticateResult =
  | { ok: true; application: Application }
  | { ok: false; status: number; message: string };

/**
 * Authenticates a Shopify-app-to-platform request using the `x-api-key` header.
 * Looks the key's prefix up (cheap, indexed) then bcrypt-verifies the full key
 * against the stored hash, so a leaked prefix alone is never enough to authenticate.
 */
export async function authenticateApp(request: Request): Promise<AuthenticateResult> {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) {
    return { ok: false, status: 401, message: "Missing x-api-key header" };
  }

  const prefix = extractKeyPrefix(apiKey);
  if (!prefix) {
    return { ok: false, status: 401, message: "Malformed API key" };
  }

  const application = await prisma.application.findUnique({ where: { apiKeyPrefix: prefix } });
  if (!application) {
    return { ok: false, status: 401, message: "Invalid API key" };
  }

  const valid = await verifyApiKey(apiKey, application.apiKeyHash);
  if (!valid) {
    return { ok: false, status: 401, message: "Invalid API key" };
  }

  if (application.status !== "ACTIVE") {
    return { ok: false, status: 403, message: "Application is not active" };
  }

  return { ok: true, application };
}
