import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import { ItemForm } from "@/components/billease/items/ItemForm";
import { notFound } from "next/navigation";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const item = await prisma.item.findFirst({ where: { id, businessId } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit item</h1>
      <ItemForm itemId={id} initial={item as unknown as Record<string, unknown>} />
    </div>
  );
}
