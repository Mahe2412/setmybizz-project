import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";
import { GstExportButton } from "@/components/reports/GstExportButton";
import { CaConnection } from "@/components/reports/CaConnection";

export default async function ReportsPage() {
  const { businessId } = await requireBusinessId();

  const sales = await prisma.document.findMany({
    where: {
      businessId,
      status: "finalized",
      type: { in: ["invoice", "bill_of_supply"] },
    },
    include: { party: true, lines: true },
  });

  const purchases = await prisma.document.findMany({
    where: { businessId, status: "finalized", type: "purchase" },
  });

  const expenses = await prisma.expense.findMany({
    where: { businessId },
  });

  const salesTotal = sales.reduce((s, d) => s + d.grandTotal, 0);
  const purchaseTotal = purchases.reduce((s, d) => s + d.grandTotal, 0);
  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);

  const gstSummary = {
    cgst: sales.reduce((s, d) => s + d.cgstTotal, 0),
    sgst: sales.reduce((s, d) => s + d.sgstTotal, 0),
    igst: sales.reduce((s, d) => s + d.igstTotal, 0),
  };

  const byParty: Record<string, { name: string; total: number }> = {};
  for (const doc of sales) {
    const key = doc.partyId ?? "walk-in";
    const name = doc.party?.name ?? "Walk-in";
    if (!byParty[key]) byParty[key] = { name, total: 0 };
    byParty[key].total += doc.grandTotal;
  }

  const itemSales: Record<string, { name: string; qty: number; amount: number }> = {};
  for (const doc of sales) {
    for (const line of doc.lines) {
      if (!itemSales[line.description]) {
        itemSales[line.description] = {
          name: line.description,
          qty: 0,
          amount: 0,
        };
      }
      itemSales[line.description].qty += line.qty;
      itemSales[line.description].amount += line.lineTotal;
    }
  }

  const topItems = Object.values(itemSales)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const report = {
    salesTotal,
    purchaseTotal,
    expenseTotal,
    profitEstimate: salesTotal - purchaseTotal - expenseTotal,
    gstSummary,
    byParty: Object.values(byParty).sort((a, b) => b.total - a.total),
    topItems,
    invoiceCount: sales.length,
    purchaseCount: purchases.length,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Audit ledgers and perform monthly GST filings.</p>
        </div>
        <GstExportButton />
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard label="Total sales" value={formatCurrency(report.salesTotal)} />
        <ReportCard label="Total purchases" value={formatCurrency(report.purchaseTotal)} />
        <ReportCard label="Operational Expenses" value={formatCurrency(report.expenseTotal)} />
        <ReportCard
          label="Net Profit (estimate)"
          value={formatCurrency(report.profitEstimate)}
          highlight={report.profitEstimate >= 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* GST dashboard */}
        <div className="card p-5 border border-slate-200/80 bg-white shadow-sm rounded-2xl">
          <h2 className="mb-4 font-bold text-slate-800 text-sm">GST Filings Center (Sales Summary)</h2>
          <div className="space-y-3 text-sm">
            <Row label="Central Tax (CGST)" value={formatCurrency(report.gstSummary.cgst)} />
            <Row label="State Tax (SGST)" value={formatCurrency(report.gstSummary.sgst)} />
            <Row label="Integrated Tax (IGST)" value={formatCurrency(report.gstSummary.igst)} />
            <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-slate-800">
              <span>Total Tax Payable</span>
              <span>{formatCurrency(report.gstSummary.cgst + report.gstSummary.sgst + report.gstSummary.igst)}</span>
            </div>
          </div>
        </div>

        {/* Sales by party */}
        <div className="card p-5 border border-slate-200/80 bg-white shadow-sm rounded-2xl">
          <h2 className="mb-4 font-bold text-slate-800 text-sm">Sales distribution by Customer</h2>
          {report.byParty.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No customer distributions logged yet.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {report.byParty.map((p, i) => (
                <li key={i} className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-slate-600 font-medium">{p.name}</span>
                  <span className="font-bold text-slate-800">{formatCurrency(p.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top selling items */}
        <div className="card lg:col-span-2 p-5 border border-slate-200/80 bg-white shadow-sm rounded-2xl">
          <h2 className="mb-4 font-bold text-slate-800 text-sm">Top Revenue Contributing Products</h2>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-2">Product Name</th>
                <th className="pb-2">Quantity Sold</th>
                <th className="pb-2 text-right">Revenue Share</th>
              </tr>
            </thead>
            <tbody>
              {report.topItems.map((item, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 font-semibold text-slate-700">{item.name}</td>
                  <td className="text-slate-500">{item.qty} units</td>
                  <td className="text-right font-black text-slate-800">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connect CA Connection Panel */}
      <CaConnection
        sales={sales}
        purchases={purchases}
        expenses={expenses}
      />
    </div>
  );
}

function ReportCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  let accent = "border-t-slate-500 text-slate-800";
  if (highlight !== undefined) {
    accent = highlight ? "border-t-emerald-500 text-emerald-700" : "border-t-rose-500 text-rose-700 animate-pulse";
  }
  return (
    <div className={`card p-5 border border-slate-200/80 bg-white shadow-sm border-t-4 ${accent} rounded-2xl`}>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-50 pb-1.5">
      <span className="text-slate-500 font-semibold">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}
