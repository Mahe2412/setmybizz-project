import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/session";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const { businessId } = await requireBusinessId();

  const business = await prisma.business.findUniqueOrThrow({
    where: { id: businessId },
  });

  const memberships = await prisma.membership.findMany({
    where: { businessId },
    include: { user: true },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsForm initial={business} />

      <div className="card">
        <h2 className="mb-4 font-semibold">Team (roles)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th>User</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="py-2">{m.user.email}</td>
                <td className="capitalize">{m.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-slate-500">
          Multi-user invites coming soon. Current role: owner / staff enforced in API.
        </p>
      </div>
    </div>
  );
}
