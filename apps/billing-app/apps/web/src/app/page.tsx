import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const { embed } = await searchParams;
  const q = embed === "1" ? "?embed=1" : "";
  const session = await getSession();
  if (session?.user) {
    redirect(
      session.user.businessId ? `/dashboard${q}` : `/onboarding${q}`
    );
  }
  redirect(`/login${q}`);
}
