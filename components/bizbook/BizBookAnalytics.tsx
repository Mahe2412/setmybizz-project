import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, AlertTriangle } from 'lucide-react';

interface Transaction {
  id: string;
  total: number;
  txn_date: string;
  status: string;
  balance: number;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

interface AnalyticsProps {
  transactions: Transaction[];
  expenses: Expense[];
  darkMode?: boolean;
}

export const BizBookAnalytics: React.FC<AnalyticsProps> = ({ 
  transactions, 
  expenses, 
  darkMode = false 
}) => {
  const analytics = useMemo(() => {
    // Calculate trends
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const sales7 = transactions
      .filter(t => new Date(t.txn_date) >= last7Days)
      .reduce((sum, t) => sum + t.total, 0);

    const sales30 = transactions
      .filter(t => new Date(t.txn_date) >= last30Days)
      .reduce((sum, t) => sum + t.total, 0);

    const expenses7 = expenses
      .filter(e => new Date(e.date) >= last7Days)
      .reduce((sum, e) => sum + e.amount, 0);

    const expenses30 = expenses
      .filter(e => new Date(e.date) >= last30Days)
      .reduce((sum, e) => sum + e.amount, 0);

    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, exp) => {
      const existing = acc.find(e => e.category === exp.category);
      if (existing) {
        existing.amount += exp.amount;
        existing.count += 1;
      } else {
        acc.push({ category: exp.category, amount: exp.amount, count: 1 });
      }
      return acc;
    }, [] as Array<{ category: string; amount: number; count: number }>);

    // Sort by amount
    expensesByCategory.sort((a, b) => b.amount - a.amount);

    // Calculate daily sales trend
    const dailySales = new Map<string, number>();
    transactions.forEach(t => {
      const date = new Date(t.txn_date).toLocaleDateString('en-IN');
      dailySales.set(date, (dailySales.get(date) || 0) + t.total);
    });

    return {
      sales7,
      sales30,
      expenses7,
      expenses30,
      expensesByCategory,
      dailySales,
      avgDailySales7: sales7 / 7,
      avgDailySales30: sales30 / 30,
    };
  }, [transactions, expenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const bgClass = darkMode
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200';

  const cardClass = darkMode
    ? 'bg-slate-700/50 border-slate-700'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className="space-y-6">
      {/* Sales Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className={`rounded-lg border ${cardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 mb-1">7-DAY SALES</div>
              <div className="text-2xl font-black">{formatCurrency(analytics.sales7)}</div>
              <div className="text-xs text-slate-500 mt-1">Avg: {formatCurrency(analytics.avgDailySales7)}/day</div>
            </div>
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        <div className={`rounded-lg border ${cardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 mb-1">30-DAY SALES</div>
              <div className="text-2xl font-black">{formatCurrency(analytics.sales30)}</div>
              <div className="text-xs text-slate-500 mt-1">Avg: {formatCurrency(analytics.avgDailySales30)}/day</div>
            </div>
            <ShoppingCart className="w-6 h-6 text-violet-600" />
          </div>
        </div>

        <div className={`rounded-lg border ${cardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 mb-1">EXPENSE RATIO</div>
              <div className="text-2xl font-black">
                {analytics.sales30 > 0 ? ((analytics.expenses30 / analytics.sales30) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-slate-500 mt-1">of sales</div>
            </div>
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      {analytics.expensesByCategory.length > 0 && (
        <div className={`rounded-lg border ${bgClass} p-4`}>
          <h3 className="font-bold mb-4">Expense Breakdown</h3>
          <div className="space-y-3">
            {analytics.expensesByCategory.map((item, idx) => {
              const total = analytics.expensesByCategory.reduce((sum, e) => sum + e.amount, 0);
              const percentage = (item.amount / total) * 100;
              const colors = [
                'bg-indigo-600',
                'bg-violet-600',
                'bg-cyan-600',
                'bg-emerald-600',
                'bg-amber-600',
              ];

              return (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">{item.category}</span>
                    <span className="text-sm font-bold">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full ${colors[idx % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{percentage.toFixed(1)}% • {item.count} entries</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-lg border-l-4 border-emerald-500 ${cardClass} p-4`}>
          <div className="text-xs font-bold text-slate-500 mb-2">📈 SALES MOMENTUM</div>
          <div className="text-lg font-bold">
            {analytics.sales7 > 0 ? (
              <span className="text-emerald-600">
                ↑ {((analytics.sales7 / (analytics.sales30 || 1)) * 100).toFixed(0)}% of monthly
              </span>
            ) : (
              <span className="text-slate-600">No sales yet</span>
            )}
          </div>
        </div>

        <div className={`rounded-lg border-l-4 border-rose-500 ${cardClass} p-4`}>
          <div className="text-xs font-bold text-slate-500 mb-2">💸 EXPENSE ALERT</div>
          <div className="text-lg font-bold">
            {analytics.expenses30 > 0 ? (
              <span className="text-rose-600">
                {analytics.expensesByCategory[0]?.category} leads spend
              </span>
            ) : (
              <span className="text-slate-600">No expenses tracked</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BizBookAnalytics;
