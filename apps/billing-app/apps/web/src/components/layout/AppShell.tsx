import { Sidebar } from "./Sidebar";

export function AppShell({
  children,
  businessName,
}: {
  children: React.ReactNode;
  businessName?: string | null;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar businessName={businessName} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
