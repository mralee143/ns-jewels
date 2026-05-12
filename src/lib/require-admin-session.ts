import type { Session } from "next-auth";

import { auth } from "@/auth";

export async function requireAdminSession(): Promise<Session | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}
