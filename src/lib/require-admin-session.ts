import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Returns the session, or null if the caller is not an authenticated admin. */
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  return session;
}
