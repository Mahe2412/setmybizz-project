import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface HealthCheckProps {
  salesTotal: number;
  totalExpenses: number;
  outstandingReceivables: number;
  overdueInvoices: number;
  lowStockItems: number;
  transactions: Array<{ total: number; txn_date: string }>;
  expenses: Array<{ amount: number; date: string }>;
  darkMode?: boolean;
}

type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical';
type AlertLevel = 'info' | 'warning' | 'critical';

interface HealthAlert {
  level: AlertLevel;
  title: string;
  message: string;
  action?: string;
}

export const BusinessHealthChecker: React.FC<HealthCheckProps> = ({
  salesTotal,
  totalExpenses,
  outstandingReceivables,
  overdueInvoices,
  lowStockItems,
  transactions,
  expenses,
  darkMode = false,
}) => {
  const healthData = useMemo(() => {
    const alerts: HealthAlert[] = [];

    // Check cash flow health
    const profitMargin = salesTotal > 0 ? ((salesTotal - totalExpenses) / salesTotal) * 100 : 0;
    
    if (salesTotal === 0) {
      alerts.push({
        level: 'warning',
        title: '🎯 No Sales Yet',
        message: 'Start creating invoices to build your sales history',
        action: 'Create first invoice',
      });
    } else if (profitMargin < 10) {
      alerts.push({
        level: 'critical',
        title: '⚠️ Low Profit Margin',
        message: `Your profit margin is ${profitMargin.toFixed(1)}%. Consider reducing expenses.`,
        action: 'Review expenses',
      });
    } else if (profitMargin < 20) {
      alerts.push({
        level: 'warning',
        title: '📊 Monitor Margins',
        message: `Profit margin is ${profitMargin.toFixed(1)}%. Keep expenses in check.`,
      });
    }

    // Check receivables health
    if (outstandingReceivables > salesTotal * 0.5) {
      alerts.push({
        level: 'critical',
        title: '💰 High Receivables',
        message: `You have ₹${outstandingReceivables.toFixed(0)} pending collection (${((outstandingReceivables / salesTotal) * 100).toFixed(0)}% of sales)`,
        action: 'Send reminders',
      });
    }

    // Check overdue invoices
    if (overdueInvoices > 0) {
      alerts.push({
        level: overdueInvoices > 3 ? 'critical' : 'warning',
        title: '📋 Overdue Invoices',
        message: `${overdueInvoices} invoice(s) pending payment. Follow up with customers.`,
        action: 'Generate reminders',
      });
    }

    // Check inventory health
    if (lowStockItems > 0) {
      alerts.push({
        level: 'warning',
        title: '📦 Low Stock Alert',
        message: `${lowStockItems} product(s) have low stock levels (≤5 units)`,
        action: 'Reorder now',
      });
    }

    // Check expense trends
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentExpenses = expenses
      .filter(e => new Date(e.date) >= last7Days)
      .reduce((sum, e) => sum + e.amount, 0);

    if (recentExpenses > salesTotal * 0.8) {
      alerts.push({
        level: 'warning',
        title: '💸 High Spending This Week',
        message: `You've spent ₹${recentExpenses.toFixed(0)} in the last 7 days`,
        action: 'Budget review',
      });
    }

    // Calculate overall health score (0-100)
    let healthScore = 100;

    if (salesTotal === 0) healthScore -= 50;
    if (profitMargin < 10) healthScore -= 30;
    else if (profitMargin < 20) healthScore -= 15;

    if (outstandingReceivables > salesTotal * 0.5) healthScore -= 20;
    if (overdueInvoices > 3) healthScore -= 15;
    if (overdueInvoices > 0) healthScore -= 10;

    if (lowStockItems > 5) healthScore -= 10;

    healthScore = Math.max(0, Math.min(100, healthScore));

    let status: HealthStatus = 'excellent';
    if (healthScore < 50) status = 'critical';
    else if (healthScore < 70) status = 'warning';
    else if (healthScore < 85) status = 'good';

    return { alerts, healthScore, status };
  }, [salesTotal, totalExpenses, outstandingReceivables, overdueInvoices, lowStockItems, transactions, expenses]);

  const getHealthColor = (status: HealthStatus) => {
    switch (status) {
      case 'excellent':
        return { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-700' };
      case 'good':
        return { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-700' };
      case 'warning':
        return { bg: 'bg-amber-600', light: 'bg-amber-50', text: 'text-amber-700' };
      case 'critical':
        return { bg: 'bg-rose-600', light: 'bg-rose-50', text: 'text-rose-700' };
    }
  };

  const getStatusLabel = (status: HealthStatus) => {
    switch (status) {
      case 'excellent':
        return '✅ Excellent';
      case 'good':
        return '👍 Good';
      case 'warning':
        return '⚠️ Fair';
      case 'critical':
        return '🚨 Critical';
    }
  };

  const getAlertIcon = (level: AlertLevel) => {
    switch (level) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
      default:
        return <CheckCircle2 className="w-5 h-5 text-indigo-600" />;
    }
  };

  const colors = getHealthColor(healthData.status);
  const bgClass = darkMode ? 'bg-slate-800' : 'bg-white';

  return (
    <div className="space-y-4">
      {/* Health Score Card */}
      <div className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'} ${bgClass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Business Health</h3>
            <p className="text-sm text-slate-500">{getStatusLabel(healthData.status)}</p>
          </div>
          <div className={`rounded-full ${colors.bg} h-20 w-20 flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-3xl font-black text-white">{healthData.healthScore}</div>
              <div className="text-xs text-white/80">score</div>
            </div>
          </div>
        </div>

        {/* Health bar */}
        <div className={`rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} overflow-hidden`}>
          <div
            className={`h-full ${colors.bg} transition-all duration-500`}
            style={{ width: `${healthData.healthScore}%` }}
          />
        </div>
      </div>

      {/* Alerts */}
      {healthData.alerts.length > 0 ? (
        <div className="space-y-3">
          {healthData.alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`rounded-lg border-l-4 p-4 ${
                alert.level === 'critical'
                  ? `border-rose-500 ${darkMode ? 'bg-rose-900/20' : 'bg-rose-50'}`
                  : alert.level === 'warning'
                  ? `border-amber-500 ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`
                  : `border-indigo-500 ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`
              }`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.level)}
                <div className="flex-1">
                  <div className="font-semibold text-sm">{alert.title}</div>
                  <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                  {alert.action && (
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-2">
                      → {alert.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'} p-4 text-center`}>
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <div className="font-semibold text-sm">✅ All Systems Healthy</div>
          <p className="text-xs text-slate-500 mt-1">Your business is performing well. Keep it up!</p>
        </div>
      )}

      {/* Quick Recommendations */}
      <div className={`rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4`}>
        <div className="text-sm font-bold mb-3">💡 Recommendations</div>
        <ul className="space-y-2 text-sm">
          {healthData.healthScore < 50 && (
            <li className="flex gap-2">
              <span>→</span>
              <span>Focus on reducing expenses and collecting outstanding payments</span>
            </li>
          )}
          {outstandingReceivables > 0 && (
            <li className="flex gap-2">
              <span>→</span>
              <span>Send payment reminders to improve cash flow</span>
            </li>
          )}
          {lowStockItems > 0 && (
            <li className="flex gap-2">
              <span>→</span>
              <span>Reorder low stock items to avoid stockouts</span>
            </li>
          )}
          {healthData.healthScore > 70 && (
            <li className="flex gap-2">
              <span>→</span>
              <span>Great progress! Consider reinvesting profits to grow</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BusinessHealthChecker;
