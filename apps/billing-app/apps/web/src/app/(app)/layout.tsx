import { EmbedLayout } from "@/components/layout/EmbedLayout";
import { requireSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <EmbedLayout businessName={session.user.businessName}>
      {children}
    </EmbedLayout>
  );
}
