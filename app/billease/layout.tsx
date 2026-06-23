import { EmbedLayout } from "@/components/billease/layout/EmbedLayout";
import { requireSession } from "@/lib/billease/session";

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

