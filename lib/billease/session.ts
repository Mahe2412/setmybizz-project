import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

import { isDevAuthBypass } from "@/lib/devAuth";
import { prisma } from "@billease/db";

export async function getSession() {
  if (isDevAuthBypass()) {
    // Return mock NextAuth session using seeded demo user for local development bypass
    try {
      const user = await prisma.user.findUnique({
        where: { email: "demo@billease.app" }
      });
      const membership = await prisma.membership.findFirst({
        where: { userId: user?.id },
        include: { business: true }
      });
      return {
        user: {
          id: user?.id || "mock-user-id",
          email: user?.email || "demo@billease.app",
          name: user?.name || "Demo User",
          businessId: membership?.businessId || "seed-business",
          businessName: membership?.business.name || "Demo Traders"
        }
      };
    } catch (e) {
      console.error("Error in mock session generation:", e);
    }
  }
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireBusinessId() {
  const session = await requireSession();
  if (!session.user.businessId) redirect("/onboarding");
  return { session, businessId: session.user.businessId };
}

